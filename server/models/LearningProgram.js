const mongoose = require('mongoose');

const learningProgramSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: { type: String },
    title: { type: String, required: [true, 'Title is required'] },
    type: {
      type: String,
      enum: ['certification', 'workshop', 'training', 'mentorship', 'fdp', 'webinar', 'course'],
    },
    targetAudience: {
      type: String,
      enum: ['student', 'academician', 'both'],
      default: 'student',
    },
    description: { type: String },
    skills: [{ type: String }], // skills taught
    duration: { type: String },
    mode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
    },
    fee: {
      amount: { type: Number },
      currency: { type: String, default: 'INR' },
      isFree: { type: Boolean, default: false },
    },
    schedule: {
      startDate: { type: Date },
      endDate: { type: Date },
      registrationDeadline: { type: Date },
    },
    applicationLink: { type: String },
    maxParticipants: { type: Number },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningProgram', learningProgramSchema);
