const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const {
  getProfile,
  createOrUpdateProfile,
  getOpportunities,
  getResearchCollaborations,
  applyToOpportunity,
  applyToCollaboration,
  getDashboardStats,
} = require('../controllers/academicianController');

const protect = [auth, allowRoles('academician')];

// GET /api/academician/dashboard
router.get('/dashboard', protect, getDashboardStats);

// GET /api/academician/profile
router.get('/profile', protect, getProfile);

// PUT /api/academician/profile
router.put('/profile', protect, createOrUpdateProfile);

// GET /api/academician/opportunities
router.get('/opportunities', protect, getOpportunities);

// POST /api/academician/opportunities/:id/apply
router.post('/opportunities/:id/apply', protect, applyToOpportunity);

// GET /api/academician/research
router.get('/research', protect, getResearchCollaborations);

// POST /api/academician/research/:id/apply
router.post('/research/:id/apply', protect, applyToCollaboration);

module.exports = router;
