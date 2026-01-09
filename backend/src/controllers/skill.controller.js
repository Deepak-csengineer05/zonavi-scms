import Skill from '../models/Skill.js';
import { calculateCareerScore } from '../utils/calculateScore.js';

// @desc    Get all skills for current user
// @route   GET /api/skills
// @access  Private
const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.user._id }).sort({ category: 1, name: 1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
    try {
        const { name, category, level } = req.body;

        // Check if skill already exists
        const existingSkill = await Skill.findOne({ user: req.user._id, name: name.toLowerCase() });
        if (existingSkill) {
            return res.status(400).json({ message: 'Skill already exists' });
        }

        const skill = await Skill.create({
            user: req.user._id,
            name: name.toLowerCase(),
            category: category || 'other',
            level: level || 'beginner'
        });

        await calculateCareerScore(req.user._id);

        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
    try {
        let skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (skill.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (skill.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await skill.deleteOne();
        await calculateCareerScore(req.user._id);

        res.json({ message: 'Skill deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getSkills, createSkill, updateSkill, deleteSkill };
