const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const {
  getProfile,
  createOrUpdateProfile,
  getPortfolio,
  updatePortfolio,
  getPublicPortfolio,
  getSkillProfile,
  getApplications,
  getDashboardStats,
} = require('../controllers/studentController');

const protect = [auth, allowRoles('student')];

// ─── Public routes (no auth) ───────────────────────────────────────────────
// GET /api/student/portfolio/:userId  — recruiter-facing public portfolio
router.get('/portfolio/:userId', getPublicPortfolio);

// ─── Protected routes ──────────────────────────────────────────────────────
// GET /api/student/profile
router.get('/profile', protect, getProfile);

// PUT /api/student/profile
router.put('/profile', protect, createOrUpdateProfile);

// GET /api/student/portfolio
router.get('/portfolio', protect, getPortfolio);

// PUT /api/student/portfolio
router.put('/portfolio', protect, updatePortfolio);

// GET /api/student/skill-profile
router.get('/skill-profile', protect, getSkillProfile);

// GET /api/student/applications
router.get('/applications', protect, getApplications);

// GET /api/student/dashboard
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
