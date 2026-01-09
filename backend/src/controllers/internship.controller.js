import Internship from '../models/Internship.js';
import { calculateCareerScore } from '../utils/calculateScore.js';

// @desc    Get all internships for current user
// @route   GET /api/internships
// @access  Private
const getInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ user: req.user._id }).sort({ startDate: -1 });
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Private
const getInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        if (internship.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create internship
// @route   POST /api/internships
// @access  Private
const createInternship = async (req, res) => {
    try {
        const { company, role, description, location, locationType, startDate, endDate, duration, stipend, certificateUrl, isCurrentlyWorking } = req.body;

        const internship = await Internship.create({
            user: req.user._id,
            company,
            role,
            description,
            location,
            locationType: locationType || 'onsite',
            startDate,
            endDate,
            duration,
            stipend,
            certificateUrl,
            isCurrentlyWorking: isCurrentlyWorking || false
        });

        await calculateCareerScore(req.user._id);

        res.status(201).json(internship);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private
const updateInternship = async (req, res) => {
    try {
        let internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        if (internship.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        internship = await Internship.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private
const deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        if (internship.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await internship.deleteOne();
        await calculateCareerScore(req.user._id);

        res.json({ message: 'Internship deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getInternships, getInternship, createInternship, updateInternship, deleteInternship };
