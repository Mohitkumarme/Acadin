const { QuestionBank, AssessmentResult } = require('../models/SkillAssessment');
const StudentProfile = require('../models/StudentProfile');

// ─── Get Questions ────────────────────────────────────────────────────────────
const getQuestions = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const questions = await QuestionBank.find(filter)
      .select('-correctAnswer') // do not expose correct answers to client
      .limit(30);

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Submit Assessment ────────────────────────────────────────────────────────
const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body; // [{questionId, answer}]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers array is required' });
    }

    // Fetch all relevant questions with correct answers
    const questionIds = answers.map((a) => a.questionId);
    const questions = await QuestionBank.find({ _id: { $in: questionIds } });

    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    // Build processed answers
    const processedAnswers = [];
    const categoryMap = {}; // { category: { score, total } }

    for (const ans of answers) {
      const question = questionMap[ans.questionId];
      if (!question) continue;

      let isCorrect = false;
      let score = 0;

      if (question.type === 'mcq') {
        isCorrect = ans.answer === question.correctAnswer;
        score = isCorrect ? 1 : 0;
      } else if (question.type === 'boolean') {
        isCorrect = ans.answer === question.correctAnswer;
        score = isCorrect ? 1 : 0;
      } else if (question.type === 'rating') {
        // rating: answer is 1-5, normalize to 0-1
        const ratingValue = parseFloat(ans.answer) || 0;
        score = Math.min(ratingValue / 5, 1);
        isCorrect = score >= 0.6;
      }

      processedAnswers.push({
        questionId: question._id,
        answer: ans.answer,
        isCorrect,
        score,
      });

      if (!categoryMap[question.category]) {
        categoryMap[question.category] = { score: 0, total: 0 };
      }
      categoryMap[question.category].score += score;
      categoryMap[question.category].total += 1;
    }

    // Build category scores
    const categoryScores = Object.entries(categoryMap).map(([category, { score, total }]) => {
      const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
      return {
        category,
        score: Math.round(score * 10) / 10,
        maxScore: total,
        percentage,
      };
    });

    // Overall score (average of category percentages)
    const overallScore =
      categoryScores.length > 0
        ? Math.round(
            categoryScores.reduce((sum, c) => sum + c.percentage, 0) / categoryScores.length
          )
        : 0;

    // Generate recommendations
    const recommendations = categoryScores
      .filter((c) => c.percentage < 50)
      .map((c) => `Improve your ${c.category} skills — your score was ${c.percentage}%. Consider taking online courses or practice problems.`);

    // Find previous attempts
    const previousResult = await AssessmentResult.findOne({ studentId: req.user.id })
      .sort({ attemptNumber: -1 });

    const attemptNumber = previousResult ? previousResult.attemptNumber + 1 : 1;

    // Save result
    const result = await AssessmentResult.create({
      studentId: req.user.id,
      attemptNumber,
      answers: processedAnswers,
      categoryScores,
      overallScore,
      recommendations,
    });

    // Update student profile skillScores
    const skillScoreUpdates = categoryScores.map((c) => ({
      category: c.category,
      score: c.percentage,
    }));

    await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { skillScores: skillScoreUpdates } },
      { upsert: true }
    );

    res.json({
      message: 'Assessment submitted successfully',
      result: {
        attemptNumber,
        categoryScores,
        overallScore,
        recommendations,
        completedAt: result.completedAt,
      },
    });
  } catch (error) {
    console.error('submitAssessment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Assessment Result ────────────────────────────────────────────────────
const getAssessmentResult = async (req, res) => {
  try {
    const result = await AssessmentResult.findOne({ studentId: req.user.id }).sort({
      completedAt: -1,
    });

    if (!result) {
      return res.status(404).json({ message: 'No assessment result found' });
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Categories ───────────────────────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const categories = await QuestionBank.distinct('category');
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getQuestions, submitAssessment, getAssessmentResult, getCategories };
