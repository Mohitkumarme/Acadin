const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const {
  getProfile,
  createOrUpdateProfile,
  getDashboardStats,
  getStudentsList,
  getPlacementAnalytics,
  getSkillDemandTrends,
} = require('../controllers/institutionController');

const protect = [auth, allowRoles('institution')];

// GET /api/institution/profile
router.get('/profile', protect, getProfile);

// PUT /api/institution/profile
router.put('/profile', protect, createOrUpdateProfile);

// GET /api/institution/dashboard
router.get('/dashboard', protect, getDashboardStats);

// GET /api/institution/students
router.get('/students', protect, getStudentsList);

// GET /api/institution/placement-analytics
router.get('/placement-analytics', protect, getPlacementAnalytics);

// GET /api/institution/skill-trends
router.get('/skill-trends', protect, getSkillDemandTrends);

module.exports = router;
