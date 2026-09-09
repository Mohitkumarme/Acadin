const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: [true, 'Title is required'] },
    type: {
      type: String,
      enum: [
        'mentorship',
        'research',
        'live-project',
        'guest-lecture',
        'workshop',
        'innovation-challenge',
        'consultancy',
      ],
    },
    description: { type: String },
    targetAudience: {
      type: String,
      enum: ['student', 'academician', 'both'],
      default: 'both',
    },
    requiredExpertise: [{ type: String }],
    duration: { type: String },
    compensation: { type: String },
    applicationDeadline: { type: Date },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collaboration', collaborationSchema);
