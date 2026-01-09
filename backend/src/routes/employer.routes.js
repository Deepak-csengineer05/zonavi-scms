import express from 'express';
import {
    registerEmployer,
    getProfile,
    updateProfile,
    createJob,
    getJobs,
    updateJob,
    deleteJob,
    getJobApplicants,
    updateApplicationStatus,
    getAnalytics
} from '../controllers/employer.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.post('/register', registerEmployer);

// Protected routes (employer only)
const authorizeEmployer = (req, res, next) => {
    if (req.user && req.user.role === 'employer') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Employers only.' });
    }
};

router.use(protect); // All routes below require authentication
router.use(authorizeEmployer); // All routes below require employer role

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Job routes
router.post('/jobs', createJob);
router.get('/jobs', getJobs);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// Applicant routes
router.get('/jobs/:id/applicants', getJobApplicants);
router.put('/applications/:id/status', updateApplicationStatus);

// Analytics
router.get('/analytics', getAnalytics);

export default router;
