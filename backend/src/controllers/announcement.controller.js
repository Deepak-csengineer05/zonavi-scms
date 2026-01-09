import Announcement from '../models/Announcement.js';

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, type, targetAudience } = req.body;

        const announcement = await Announcement.create({
            title,
            content,
            type,
            targetAudience,
            createdBy: req.user._id
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all active announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        // If admin, show all. If student, show 'all' and 'students' targets
        const filter = { isActive: true };

        if (req.user.role !== 'admin') {
            filter.targetAudience = { $in: ['all', 'students'] };
        }

        const announcements = await Announcement.find(filter)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name');

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { createAnnouncement, getAnnouncements, deleteAnnouncement };
