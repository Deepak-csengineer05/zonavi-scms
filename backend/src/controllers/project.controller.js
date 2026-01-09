import Project from '../models/Project.js';
import { calculateCareerScore } from '../utils/calculateScore.js';

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { title, description, technologies, githubUrl, liveUrl, imageUrl, startDate, endDate, status } = req.body;

        const project = await Project.create({
            user: req.user._id,
            title,
            description,
            technologies: technologies || [],
            githubUrl,
            liveUrl,
            imageUrl,
            startDate,
            endDate,
            status: status || 'ongoing'
        });

        // Update career score
        await calculateCareerScore(req.user._id);

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await project.deleteOne();

        // Update career score
        await calculateCareerScore(req.user._id);

        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getProjects, getProject, createProject, updateProject, deleteProject };
