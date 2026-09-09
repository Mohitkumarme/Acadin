const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: { type: String },
    companyLogo: { type: String },
    title: { type: String, required: [true, 'Job title is required'] },
    type: {
      type: String,
      enum: ['internship', 'fulltime', 'parttime', 'apprenticeship', 'project'],
      required: [true, 'Job type is required'],
    },
    description: { type: String, required: [true, 'Job description is required'] },
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    location: { type: String },
    mode: {
      type: String,
      enum: ['onsite', 'remote', 'hybrid'],
    },
    duration: { type: String }, // for internships, e.g., '3 months'
    stipend: {
      amount: { type: Number },
      currency: { type: String, default: 'INR' },
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'INR' },
    },
    eligibility: {
      minCGPA: { type: Number },
      branches: [{ type: String }],
      yearOfStudy: [{ type: String }],
      degree: [{ type: String }],
    },
    applicationDeadline: { type: Date },
    openings: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['active', 'closed', 'paused'],
      default: 'active',
    },
    applicants: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['applied', 'shortlisted', 'rejected', 'selected'],
          default: 'applied',
        },
        resumeUrl: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
