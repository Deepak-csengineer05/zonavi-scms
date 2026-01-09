import Job from '../models/Job.js';
import { calculateCareerScore } from '../utils/calculateScore.js';

// @desc    Get all jobs for current user
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user._id }).sort({ appliedDate: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create job application
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    try {
        const { company, position, location, locationType, salary, jobType, status, appliedDate, jobUrl, notes } = req.body;

        const job = await Job.create({
            user: req.user._id,
            company,
            position,
            location,
            locationType: locationType || 'onsite',
            salary,
            jobType: jobType || 'full-time',
            status: status || 'applied',
            appliedDate: appliedDate || Date.now(),
            jobUrl,
            notes
        });

        await calculateCareerScore(req.user._id);

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // If status changed, update response date
        if (req.body.status && req.body.status !== job.status) {
            req.body.responseDate = Date.now();
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        await calculateCareerScore(req.user._id);

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await job.deleteOne();
        await calculateCareerScore(req.user._id);

        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getJobs, getJob, createJob, updateJob, deleteJob };
