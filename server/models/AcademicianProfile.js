const mongoose = require('mongoose');

const academicianProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    institution: { type: String },
    department: { type: String },
    designation: { type: String },
    specializations: [{ type: String }],
    researchInterests: [{ type: String }],
    experience: { type: Number }, // years
    publications: { type: Number },
    qualifications: [
      {
        degree: { type: String },
        institution: { type: String },
        year: { type: Number },
      },
    ],
    appliedOpportunities: [
      {
        opportunityId: { type: mongoose.Schema.Types.ObjectId },
        type: {
          type: String,
          enum: ['fdp', 'research', 'internship', 'consultancy'],
        },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['applied', 'shortlisted', 'rejected', 'selected'],
          default: 'applied',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('AcademicianProfile', academicianProfileSchema);
