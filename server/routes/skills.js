const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const {
  getQuestions,
  submitAssessment,
  getAssessmentResult,
  getCategories,
} = require('../controllers/skillController');

// GET /api/skills/questions?category=Programming
router.get('/questions', getQuestions);

// GET /api/skills/categories
router.get('/categories', getCategories);

// POST /api/skills/submit
router.post('/submit', auth, allowRoles('student'), submitAssessment);

// GET /api/skills/result
router.get('/result', auth, allowRoles('student'), getAssessmentResult);

module.exports = router;
