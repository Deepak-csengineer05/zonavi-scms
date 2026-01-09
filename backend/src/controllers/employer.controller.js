import Company from '../models/Company.js';
import JobPosting from '../models/JobPosting.js';
import JobApplication from '../models/JobApplication.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Register employer with company details
// @route   POST /api/employer/register
// @access  Public
export const registerEmployer = async (req, res) => {
    try {
        const { name, email, password, companyName, industry, website, location, size, foundedYear, contactPhone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user with employer role
        // Generate unique username based on email prefix + random number
        const emailPrefix = email.split('@')[0].substring(0, 20);
        const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);

        const user = await User.create({
            username: `${emailPrefix}_${uniqueSuffix}`,
            email,
            password,
            name,
            branch: 'N/A', // Not applicable for employers
            role: 'employer'
        });

        // Create company profile
        const company = await Company.create({
            user: user._id,
            companyName,
            industry,
            size,
            website,
            location,
            foundedYear,
            contactPhone,
            contactEmail: email
        });

        res.status(201).json({
            message: 'Employer registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            company: {
                id: company._id,
                companyName: company.companyName
            }
        });
    } catch (error) {
        console.error('Employer Register Error:', error);

        // Handle Mongoose Validation Errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        // Handle Duplicate Key Errors (e.g., duplicate email that bypassed check)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate field value entered' });
        }

        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get employer's company profile
// @route   GET /api/employer/profile
// @access  Private (Employer)
export const getProfile = async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update employer's company profile
// @route   PUT /api/employer/profile
// @access  Private (Employer)
export const updateProfile = async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        const allowedUpdates = ['companyName', 'description', 'industry', 'size', 'website', 'logo', 'location', 'foundedYear', 'contactEmail', 'contactPhone'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        updates.forEach(update => company[update] = req.body[update]);
        await company.save();

        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a job posting
// @route   POST /api/employer/jobs
// @access  Private (Employer)
export const createJob = async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found. Please complete your profile first.' });
        }

        const job = await JobPosting.create({
            ...req.body,
            postedBy: req.user._id,
            company: company._id
        });

        const populatedJob = await JobPosting.findById(job._id).populate('company', 'companyName logo');

        res.status(201).json(populatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get employer's job postings
// @route   GET /api/employer/jobs
// @access  Private (Employer)
export const getJobs = async (req, res) => {
    try {
        const jobs = await JobPosting.find({ postedBy: req.user._id })
            .populate('company', 'companyName logo')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job posting
// @route   PUT /api/employer/jobs/:id
// @access  Private (Employer)
export const updateJob = async (req, res) => {
    try {
        const job = await JobPosting.findOne({ _id: req.params.id, postedBy: req.user._id });

        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        const allowedUpdates = ['company', 'position', 'description', 'skillsRequired', 'location', 'type', 'salary', 'applyLink', 'deadline', 'isActive'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        updates.forEach(update => job[update] = req.body[update]);
        await job.save();

        const populatedJob = await JobPosting.findById(job._id).populate('company', 'companyName logo');
        res.json(populatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job posting
// @route   DELETE /api/employer/jobs/:id
// @access  Private (Employer)
export const deleteJob = async (req, res) => {
    try {
        const job = await JobPosting.findOne({ _id: req.params.id, postedBy: req.user._id });

        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applicants for a job
// @route   GET /api/employer/jobs/:id/applicants
// @access  Private (Employer)
export const getJobApplicants = async (req, res) => {
    try {
        // Verify job belongs to this employer
        const job = await JobPosting.findOne({ _id: req.params.id, postedBy: req.user._id });

        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        const applications = await JobApplication.find({ job: req.params.id })
            .populate('student', 'name email year branch cgpa phone linkedin github avatar')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/employer/applications/:id/status
// @access  Private (Employer)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await JobApplication.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify the job belongs to this employer
        if (application.job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this application' });
        }

        application.status = status;
        await application.save();

        // Create notification for the student
        const notificationMessage = `Your application for ${application.job.position} at ${application.job.company.companyName} has been updated to: ${status.toUpperCase()}.`;

        await Notification.create({
            user: application.student, // The student ID
            title: 'Application Update',
            message: notificationMessage,
            type: ['accepted', 'shortlisted', 'offered'].includes(status) ? 'success' : status === 'rejected' ? 'error' : 'info',
            link: '/jobs'
        });

        const populatedApplication = await JobApplication.findById(application._id)
            .populate('student', 'name email year branch cgpa')
            .populate('job', 'position company');

        res.json(populatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get employer analytics
// @route   GET /api/employer/analytics
// @access  Private (Employer)
export const getAnalytics = async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user._id });

        if (!company) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        // Get all jobs posted by employer
        const jobs = await JobPosting.find({ postedBy: req.user._id });
        const jobIds = jobs.map(job => job._id);

        // Get all applications for employer's jobs
        const applications = await JobApplication.find({ job: { $in: jobIds } });

        // Calculate stats
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.isActive).length;
        const totalApplications = applications.length;
        const totalViews = jobs.reduce((sum, job) => sum + job.views, 0);

        // Applications by status
        const applicationsByStatus = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        // Recent applicants (last 10)
        const recentApplicants = await JobApplication.find({ job: { $in: jobIds } })
            .populate('student', 'name email year branch cgpa avatar')
            .populate('job', 'position')
            .sort({ appliedAt: -1 })
            .limit(10);

        res.json({
            totalJobs,
            activeJobs,
            totalApplications,
            totalViews,
            applicationsByStatus,
            recentApplicants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
