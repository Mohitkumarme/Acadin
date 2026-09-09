const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    phone: { type: String },
    institution: { type: String },
    degree: { type: String },
    branch: { type: String },
    yearOfStudy: { type: String },
    cgpa: { type: Number },
    skills: [
      {
        name: { type: String },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced'],
        },
        verified: { type: Boolean, default: false },
      },
    ],
    skillScores: [
      {
        category: { type: String },
        score: { type: Number, min: 0, max: 100 },
      },
    ],
    portfolio: {
      about: { type: String },
      github: { type: String },
      linkedin: { type: String },
      website: { type: String },
      projects: [
        {
          title: { type: String },
          description: { type: String },
          techStack: { type: String },
          link: { type: String },
          status: { type: String },
        },
      ],
      certifications: [
        {
          name: { type: String },
          issuer: { type: String },
          date: { type: Date },
          credentialUrl: { type: String },
        },
      ],
      achievements: [
        {
          title: { type: String },
          description: { type: String },
          date: { type: Date },
        },
      ],
    },
    appliedJobs: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job',
        },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['applied', 'shortlisted', 'rejected', 'selected'],
          default: 'applied',
        },
      },
    ],
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
