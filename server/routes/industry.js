const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const {
  getProfile,
  createOrUpdateProfile,
  getDashboardStats,
  getApplicants,
  getLearningPrograms,
  postLearningProgram,
} = require('../controllers/industryController');

const protect = [auth, allowRoles('industry')];

// GET /api/industry/profile
router.get('/profile', protect, getProfile);

// PUT /api/industry/profile
router.put('/profile', protect, createOrUpdateProfile);

// GET /api/industry/dashboard
router.get('/dashboard', protect, getDashboardStats);

// GET /api/industry/applicants
router.get('/applicants', protect, getApplicants);

// GET /api/industry/programs
router.get('/programs', protect, getLearningPrograms);

// POST /api/industry/programs
router.post('/programs', protect, postLearningProgram);

module.exports = router;
