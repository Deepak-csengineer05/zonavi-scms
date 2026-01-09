import express from 'express';
import { protect } from '../middleware/auth.middleware.js';

// Import controllers
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/project.controller.js';
import { getInternships, getInternship, createInternship, updateInternship, deleteInternship } from '../controllers/internship.controller.js';
import { getJobs, getJob, createJob, updateJob, deleteJob } from '../controllers/job.controller.js';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skill.controller.js';
import { getCertificates, getCertificate, createCertificate, updateCertificate, deleteCertificate } from '../controllers/certificate.controller.js';
import { getStats } from '../controllers/dashboard.controller.js';
import { getCommunity } from '../controllers/community.controller.js';
import { getJobPostings } from '../controllers/jobPosting.controller.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Community
router.get('/community', getCommunity);

// Dashboard
router.get('/dashboard/stats', getStats);

// Job Board (Recommendations)
router.get('/jobs/available', getJobPostings);

// Projects
router.route('/projects')
    .get(getProjects)
    .post(createProject);

router.route('/projects/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

// Internships
router.route('/internships')
    .get(getInternships)
    .post(createInternship);

router.route('/internships/:id')
    .get(getInternship)
    .put(updateInternship)
    .delete(deleteInternship);

// Jobs
router.route('/jobs')
    .get(getJobs)
    .post(createJob);

router.route('/jobs/:id')
    .get(getJob)
    .put(updateJob)
    .delete(deleteJob);

// Skills
router.route('/skills')
    .get(getSkills)
    .post(createSkill);

router.route('/skills/:id')
    .put(updateSkill)
    .delete(deleteSkill);

// Certificates
router.route('/certificates')
    .get(getCertificates)
    .post(createCertificate);

router.route('/certificates/:id')
    .get(getCertificate)
    .put(updateCertificate)
    .delete(deleteCertificate);

export default router;
