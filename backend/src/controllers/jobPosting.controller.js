import JobPosting from '../models/JobPosting.js';
import Skill from '../models/Skill.js';

// @desc    Create a new job posting
// @route   POST /api/jobs/postings
// @access  Admin
const createJobPosting = async (req, res) => {
    try {
        const { company, position, description, skillsRequired, location, type, salary, applyLink, deadline } = req.body;

        const jobPosting = await JobPosting.create({
            company,
            position,
            description,
            skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim()),
            location,
            type,
            salary,
            applyLink,
            deadline,
            postedBy: req.user._id
        });

        res.status(201).json(jobPosting);
    } catch (error) {
        console.error('Error creating job posting:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all job postings (with recommendation logic)
// @route   GET /api/jobs/postings
// @access  Private
const getJobPostings = async (req, res) => {
    try {
        const { filter } = req.query; // filter='recommended'
        let query = { isActive: true, deadline: { $gte: new Date() } };

        const jobs = await JobPosting.find(query)
            .populate('company', 'companyName')
            .sort({ deadline: 1 })
            .lean();

        // Calculate relevance/match score for each job based on student's skills
        // Note: For a real student user, we fetch their skills. For admin, we just return jobs.

        let processedJobs = jobs;

        if (req.user.role === 'student') {
            const studentSkills = await Skill.find({ user: req.user._id }).distinct('name');
            const studentSkillsSet = new Set(studentSkills.map(s => s.toLowerCase()));

            processedJobs = jobs.map(job => {
                const requiredSkills = job.skillsRequired || [];
                const matchCount = requiredSkills.reduce((acc, skill) => {
                    return acc + (studentSkillsSet.has(skill.toLowerCase()) ? 1 : 0);
                }, 0);

                const matchPercentage = requiredSkills.length > 0
                    ? Math.round((matchCount / requiredSkills.length) * 100)
                    : 0;

                return {
                    ...job,
                    isRecommended: matchPercentage >= 50, // Recommend if > 50% skills match
                    matchPercentage
                };
            });

            // If user specifically asked for recommended only
            if (filter === 'recommended') {
                processedJobs = processedJobs.filter(job => job.isRecommended);
            }

            // Sort by match percentage (desc) then deadline (asc)
            processedJobs.sort((a, b) => {
                if (b.matchPercentage !== a.matchPercentage) {
                    return b.matchPercentage - a.matchPercentage;
                }
                return new Date(a.deadline) - new Date(b.deadline);
            });
        }

        res.json(processedJobs);
    } catch (error) {
        console.error('Error fetching job postings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/postings/:id
// @access  Admin
const deleteJobPosting = async (req, res) => {
    try {
        const job = await JobPosting.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        await job.deleteOne();
        res.json({ message: 'Job posting removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { createJobPosting, getJobPostings, deleteJobPosting };
