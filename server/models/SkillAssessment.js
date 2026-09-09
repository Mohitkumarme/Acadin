const mongoose = require('mongoose');

// ─── Question Bank Schema ─────────────────────────────────────────────────────
const questionBankSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
    },
    type: {
      type: String,
      enum: ['mcq', 'rating', 'boolean'],
      required: true,
    },
    options: [{ type: String }], // for MCQ
    correctAnswer: { type: String },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// ─── Assessment Result Schema ─────────────────────────────────────────────────
const assessmentResultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attemptNumber: { type: Number, default: 1 },
    answers: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank' },
        answer: { type: String },
        isCorrect: { type: Boolean },
        score: { type: Number },
      },
    ],
    categoryScores: [
      {
        category: { type: String },
        score: { type: Number },
        maxScore: { type: Number },
        percentage: { type: Number },
      },
    ],
    overallScore: { type: Number },
    completedAt: { type: Date, default: Date.now },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);
const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

module.exports = { QuestionBank, AssessmentResult };
