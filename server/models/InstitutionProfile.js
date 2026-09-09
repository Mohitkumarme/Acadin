const mongoose = require('mongoose');

const institutionProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    institutionName: {
      type: String,
      required: [true, 'Institution name is required'],
    },
    type: {
      type: String,
      enum: ['university', 'college', 'polytechnic', 'iit', 'nit', 'deemed'],
    },
    location: { type: String },
    website: { type: String },
    accreditation: { type: String },
    totalStudents: { type: Number },
    totalFaculty: { type: Number },
    departments: [{ type: String }],
    placementStats: {
      avgPackage: { type: Number },
      highestPackage: { type: Number },
      placementRate: { type: Number },
      year: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InstitutionProfile', institutionProfileSchema);
