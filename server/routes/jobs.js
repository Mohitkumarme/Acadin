const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const {
  getAllJobs,
  getJobById,
  postJob,
  applyToJob,
  getPostedJobs,
  updateApplicantStatus,
  getRecommendedJobs,
} = require('../controllers/jobController');

// GET /api/jobs  — public, with filters
router.get('/', getAllJobs);

// GET /api/jobs/recommended — auth + student (must be before /:id)
router.get('/recommended', auth, allowRoles('student'), getRecommendedJobs);

// GET /api/jobs/posted — auth + industry
router.get('/posted', auth, allowRoles('industry'), getPostedJobs);

// GET /api/jobs/:id — public
router.get('/:id', getJobById);

// POST /api/jobs — auth + industry
router.post('/', auth, allowRoles('industry'), postJob);

// POST /api/jobs/:id/apply — auth + student
router.post('/:id/apply', auth, allowRoles('student'), applyToJob);

// PUT /api/jobs/:id/applicants/:studentId — auth + industry
router.put('/:id/applicants/:studentId', auth, allowRoles('industry'), updateApplicantStatus);

module.exports = router;
