import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import csvUpload from '../middleware/csvUpload.middleware.js';
import {
    getAllStudents,
    getStudentDetails,
    getRankings,
    getAdminStats,
    deleteStudent,
    importStudents,
    exportStudents
} from '../controllers/admin.controller.js';
import { createJobPosting, deleteJobPosting } from '../controllers/jobPosting.controller.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(admin);

// Admin dashboard stats
router.get('/stats', getAdminStats);

// Job Postings
router.post('/jobs', createJobPosting);
router.delete('/jobs/:id', deleteJobPosting);

// Student management
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentDetails);
router.delete('/students/:id', deleteStudent);

// Rankings
router.get('/rankings', getRankings);

// Export/Import
router.get('/export', protect, admin, exportStudents);
router.post('/import', protect, admin, csvUpload.single('file'), importStudents);

export default router;
