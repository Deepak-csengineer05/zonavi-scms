import { getDashboardStats, calculateCareerScore } from '../utils/calculateScore.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
    try {
        // Recalculate career score
        await calculateCareerScore(req.user._id);

        // Get all stats
        const stats = await getDashboardStats(req.user._id);

        if (stats) {
            res.json(stats);
        } else {
            res.status(500).json({ message: 'Could not retrieve stats' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getStats };
