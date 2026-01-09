import express from 'express';
import { uploadAvatar } from '../controllers/upload.controller.js';
import upload from '../middleware/upload.middleware.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Upload avatar route
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
