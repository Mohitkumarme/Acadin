const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const LearningProgram = require('../models/LearningProgram');

// GET /api/learning — public with filters
router.get('/', async (req, res) => {
  try {
    const { type, targetAudience, skills } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (targetAudience) filter.targetAudience = { $in: [targetAudience, 'both'] };
    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillArray };
    }

    const programs = await LearningProgram.find(filter).sort({ createdAt: -1 });
    res.json({ programs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/learning/:id — public
router.get('/:id', async (req, res) => {
  try {
    const program = await LearningProgram.findById(req.params.id).populate(
      'postedBy',
      'name email'
    );
    if (!program) {
      return res.status(404).json({ message: 'Learning program not found' });
    }
    res.json({ program });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/learning — auth + industry
router.post('/', auth, allowRoles('industry'), async (req, res) => {
  try {
    const program = await LearningProgram.create({
      ...req.body,
      postedBy: req.user.id,
    });
    res.status(201).json({ program });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
