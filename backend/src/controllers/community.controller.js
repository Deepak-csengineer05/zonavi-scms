import User from '../models/User.js';
import Skill from '../models/Skill.js';

// @desc    Get community members (students)
// @route   GET /api/community
// @access  Private
const getCommunity = async (req, res) => {
    try {
        const { search, branch, skill } = req.query;

        // Build query
        let query = { role: 'student' };

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by branch
        if (branch && branch !== 'All') {
            query.branch = branch;
        }

        // Filter by skill (requires aggregation or two-step lookup since skills are in a separate collection)
        // For simplicity and performance in this architecture, we will first find users with the skill
        if (skill) {
            const usersWithSkill = await Skill.find({
                name: { $regex: skill, $options: 'i' }
            }).distinct('user');

            query._id = { $in: usersWithSkill };
        }

        // Execute query
        const students = await User.find(query)
            .select('name branch year avatar bio linkedin github careerScore cgpa') // Select only public fields
            .lean();

        // Populate top skills for each student
        // Note: This N+1 query is acceptable for small page sizes (limits), 
        // but for production, we would use $lookup aggregation.
        const studentsWithSkills = await Promise.all(students.map(async (student) => {
            const skills = await Skill.find({ user: student._id })
                .sort({ level: -1 }) // Show best skills first (Advanced > Intermediate > Beginner)
                .limit(4)
                .select('name level');
            return { ...student, skills };
        }));

        res.json(studentsWithSkills);
    } catch (error) {
        console.error('Error fetching community:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { getCommunity };
