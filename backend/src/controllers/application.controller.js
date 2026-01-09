import JobApplication from '../models/JobApplication.js';
import JobPosting from '../models/JobPosting.js';
import User from '../models/User.js';

// @desc    Create a job application (Student applies to a job)
// @route   POST /api/applications
// @access  Private (Student)
export const createApplication = async (req, res) => {
    try {
        const { jobId, coverLetter, resumeUrl } = req.body;

        // Check if job exists
        const job = await JobPosting.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if job is still active
        if (!job.isActive) {
            return res.status(400).json({ message: 'This job posting is no longer active' });
        }

        // Check if already applied
        const existingApplication = await JobApplication.findOne({
            student: req.user._id,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        // Create application
        const application = await JobApplication.create({
            student: req.user._id,
            job: jobId,
            coverLetter,
            resumeUrl
        });

        // Increment application count on job
        job.applicationCount += 1;
        await job.save();

        const populatedApplication = await JobApplication.findById(application._id)
            .populate('job', 'position company location type salary')
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'companyName logo'
                }
            });

        res.status(201).json(populatedApplication);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
export const getMyApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({ student: req.user._id })
            .populate({
                path: 'job',
                select: 'position company location type salary deadline',
                populate: {
                    path: 'company',
                    select: 'companyName logo'
                }
            })
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private (Student - own application only)
export const getApplicationById = async (req, res) => {
    try {
        const application = await JobApplication.findById(req.params.id)
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'companyName logo description website'
                }
            })
            .populate('student', 'name email year branch cgpa');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ensure student can only access their own application
        if (application.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if student has already applied to a job
// @route   GET /api/applications/check/:jobId
// @access  Private (Student)
export const checkApplication = async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            student: req.user._id,
            job: req.params.jobId
        });

        res.json({ hasApplied: !!application, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
