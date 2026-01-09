import User from '../models/User.js';
import fs from 'fs';
import csv from 'csv-parser';
import { Parser } from 'json2csv';
import Project from '../models/Project.js';
import Internship from '../models/Internship.js';
import Job from '../models/Job.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Admin
const getAllStudents = async (req, res) => {
    try {
        const { search, branch, sortBy } = req.query;

        let query = { role: 'student' };

        // Search by name or username
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by branch
        if (branch) {
            query.branch = { $regex: branch, $options: 'i' };
        }

        let sortOptions = { createdAt: -1 };
        if (sortBy === 'cgpa') sortOptions = { cgpa: -1 };
        if (sortBy === 'score') sortOptions = { careerScore: -1 };
        if (sortBy === 'name') sortOptions = { name: 1 };

        const students = await User.find(query)
            .select('-password')
            .sort(sortOptions);

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single student with all data
// @route   GET /api/admin/students/:id
// @access  Admin
const getStudentDetails = async (req, res) => {
    try {
        const student = await User.findById(req.params.id).select('-password');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Get all related data
        const [projects, internships, jobs, skills, certificates] = await Promise.all([
            Project.find({ user: req.params.id }),
            Internship.find({ user: req.params.id }),
            Job.find({ user: req.params.id }),
            Skill.find({ user: req.params.id }),
            Certificate.find({ user: req.params.id })
        ]);

        res.json({
            student,
            projects,
            internships,
            jobs,
            skills,
            certificates
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get student rankings
// @route   GET /api/admin/rankings
// @access  Admin
const getRankings = async (req, res) => {
    try {
        const { sortBy = 'score', limit = 50 } = req.query;

        let sortOptions = { careerScore: -1 };
        if (sortBy === 'cgpa') sortOptions = { cgpa: -1 };

        const students = await User.find({ role: 'student' })
            .select('username name branch cgpa careerScore avatar')
            .sort(sortOptions)
            .limit(parseInt(limit));

        // Add rank numbers
        const rankings = students.map((student, index) => ({
            rank: index + 1,
            ...student.toObject()
        }));

        res.json(rankings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getAdminStats = async (req, res) => {
    try {
        const [
            totalStudents,
            totalProjects,
            totalInternships,
            totalJobs,
            avgCgpa
        ] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            Project.countDocuments(),
            Internship.countDocuments(),
            Job.countDocuments(),
            User.aggregate([
                { $match: { role: 'student', cgpa: { $gt: 0 } } },
                { $group: { _id: null, avgCgpa: { $avg: '$cgpa' } } }
            ])
        ]);

        // Get job status distribution
        const jobStats = await Job.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Calculate Placement Rate (Students with at least one 'accepted' job)
        const placedStudentsCount = await Job.distinct('user', { status: 'accepted' });
        const placementRate = totalStudents > 0
            ? ((placedStudentsCount.length / totalStudents) * 100).toFixed(1)
            : 0;

        // Get branch distribution
        const branchStats = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: '$branch', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get Top Skills
        const topSkills = await Skill.aggregate([
            { $group: { _id: '$name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 } // Top 5 skills
        ]);

        res.json({
            totalStudents,
            totalProjects,
            totalInternships,
            totalJobs,
            avgCgpa: avgCgpa[0]?.avgCgpa?.toFixed(2) || 0,
            jobStats: jobStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
            placedStudentsCount: placedStudentsCount.length,
            placementRate,
            branchStats,
            topSkills
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Admin
const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        // Delete all related data
        await Promise.all([
            Project.deleteMany({ user: req.params.id }),
            Internship.deleteMany({ user: req.params.id }),
            Job.deleteMany({ user: req.params.id }),
            Skill.deleteMany({ user: req.params.id }),
            Certificate.deleteMany({ user: req.params.id }),
            student.deleteOne()
        ]);

        res.json({ message: 'Student and all related data deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Bulk import students from CSV
// @route   POST /api/admin/imports
// @access  Private/Admin
const importStudents = async (req, res) => {
    try {
        const { students } = req.body; // Expecting array of {name, email, etc}

        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid data. Expected array of students.' });
        }

        const results = [];
        const errors = [];
        let successCount = 0;

        for (const row of students) {
            try {
                // Normalize keys if needed (frontend sends lowercase)
                const { name, email, branch, year, cgpa, phone } = row;

                if (!email || !name) {
                    errors.push({ email: email || 'Unknown', error: 'Missing name or email' });
                    continue;
                }

                // Check for duplicate
                const userExists = await User.findOne({ email });
                if (userExists) {
                    errors.push({ email, error: 'User already exists' });
                    continue;
                }

                // Create User
                const password = row.password || 'Zonavi@123'; // Default password

                await User.create({
                    name,
                    email,
                    password, // Hashes automatically in model pre-save
                    branch: branch || 'General',
                    year: year ? Number(year) : 1,
                    cgpa: cgpa ? Number(cgpa) : 0,
                    phone: phone || '',
                    role: 'student',
                    careerScore: 0
                });

                successCount++;
            } catch (err) {
                console.error(err);
                errors.push({ email: row.email, error: 'Validation Error' });
            }
        }

        res.json({
            success: successCount, // Frontend expects check of success/failed keys
            failed: errors.length,
            errors
        });

    } catch (error) {
        console.error('Import Error:', error);
        res.status(500).json({ message: 'Server Error during import' });
    }
};

// @desc    Export students to CSV
// @route   GET /api/admin/export
// @access  Private/Admin
const exportStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found to export' });
        }

        const fields = ['name', 'email', 'branch', 'year', 'cgpa', 'phone', 'linkedin', 'github', 'careerScore', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csvData = json2csvParser.parse(students);

        res.header('Content-Type', 'text/csv');
        res.attachment('students_export.csv');
        res.send(csvData);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export {
    getAllStudents,
    getStudentDetails,
    getRankings,
    getAdminStats,
    deleteStudent,
    importStudents,
    exportStudents
};
