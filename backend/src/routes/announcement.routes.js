import express from 'express';
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from '../controllers/announcement.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public/Student routes (but need auth)
router.get('/', protect, getAnnouncements);

// Admin routes
router.post('/', protect, admin, createAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);

export default router;
