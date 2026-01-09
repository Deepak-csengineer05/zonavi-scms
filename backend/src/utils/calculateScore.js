import Project from '../models/Project.js';
import Internship from '../models/Internship.js';
import Job from '../models/Job.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';

/**
 * Calculate career score based on:
 * - Projects: 10 points each
 * - Internships: 20 points each
 * - Jobs (accepted): 50 points
 * - Jobs (offered): 30 points
 * - Jobs (interviewing): 15 points
 * - Jobs (applied): 5 points
 * - Certificates: 5 points each
 * - Skills: 2 points each
 * - CGPA: x10 points
 */
const calculateCareerScore = async (userId) => {
    try {
        // Get counts
        const projectCount = await Project.countDocuments({ user: userId });
        const internshipCount = await Internship.countDocuments({ user: userId });
        const skillCount = await Skill.countDocuments({ user: userId });
        const certificateCount = await Certificate.countDocuments({ user: userId });

        // Get job statuses
        const jobs = await Job.find({ user: userId });
        const acceptedJobs = jobs.filter(j => j.status === 'accepted').length;
        const offeredJobs = jobs.filter(j => j.status === 'offered').length;
        const interviewingJobs = jobs.filter(j => j.status === 'interviewing').length;
        const appliedJobs = jobs.filter(j => j.status === 'applied').length;

        // Get user CGPA
        const user = await User.findById(userId);
        const cgpa = user?.cgpa || 0;

        // Calculate score
        const score =
            (projectCount * 10) +
            (internshipCount * 20) +
            (acceptedJobs * 50) +
            (offeredJobs * 30) +
            (interviewingJobs * 15) +
            (appliedJobs * 5) +
            (certificateCount * 5) +
            (skillCount * 2) +
            Math.round(cgpa * 10);

        // Update user's career score and history
        if (user && user.careerScore !== score) {
            await User.findByIdAndUpdate(userId, {
                careerScore: score,
                $push: {
                    careerScoreHistory: {
                        score: score,
                        date: new Date()
                    }
                }
            });
        }

        return score;
    } catch (error) {
        console.error('Error calculating career score:', error);
        return 0;
    }
};

/**
 * Get dashboard statistics for a user
 */
const getDashboardStats = async (userId) => {
    try {
        const [projectCount, internshipCount, jobCount, skillCount, certificateCount, user] = await Promise.all([
            Project.countDocuments({ user: userId }),
            Internship.countDocuments({ user: userId }),
            Job.countDocuments({ user: userId }),
            Skill.countDocuments({ user: userId }),
            Certificate.countDocuments({ user: userId }),
            User.findById(userId)
        ]);

        // Get job status breakdown
        const jobs = await Job.find({ user: userId });
        const jobStats = {
            applied: jobs.filter(j => j.status === 'applied').length,
            interviewing: jobs.filter(j => j.status === 'interviewing').length,
            offered: jobs.filter(j => j.status === 'offered').length,
            accepted: jobs.filter(j => j.status === 'accepted').length,
            rejected: jobs.filter(j => j.status === 'rejected').length
        };

        // Calculate profile completion
        const profileFields = ['name', 'email', 'branch', 'cgpa', 'year', 'phone', 'linkedin', 'github', 'bio'];
        const filledFields = profileFields.filter(field => user[field]);
        const profileCompletion = Math.round((filledFields.length / profileFields.length) * 100);

        // Get skill distribution by level
        const skills = await Skill.find({ user: userId });
        const skillStats = {
            Beginner: skills.filter(s => s.level === 'Beginner').length,
            Intermediate: skills.filter(s => s.level === 'Intermediate').length,
            Advanced: skills.filter(s => s.level === 'Advanced').length
        };

        // Get score history (limit to last 10 entries)
        const scoreHistory = user.careerScoreHistory
            ? user.careerScoreHistory.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-10)
            : [];

        return {
            projects: projectCount,
            internships: internshipCount,
            jobs: jobCount,
            skills: skillCount,
            certificates: certificateCount,
            careerScore: user.careerScore || 0,
            cgpa: user.cgpa || 0,
            profileCompletion,
            jobStats,
            skillStats,
            scoreHistory
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        return null;
    }
};

export { calculateCareerScore, getDashboardStats };
