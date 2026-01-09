import express from 'express';
import {
    createApplication,
    getMyApplications,
    getApplicationById,
    checkApplication
} from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes (require authentication)
router.use(protect);

// Student application routes
router.post('/', createApplication);
router.get('/my', getMyApplications);
router.get('/check/:jobId', checkApplication);
router.get('/:id', getApplicationById);

export default router;
