const mongoose = require('mongoose');

const industryProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: { type: String, required: [true, 'Company name is required'] },
    industry: { type: String }, // e.g., IT, Finance, Healthcare
    description: { type: String },
    website: { type: String },
    linkedin: { type: String },
    logo: { type: String },
    location: { type: String },
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    },
    verified: { type: Boolean, default: false },
    contactPerson: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      designation: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('IndustryProfile', industryProfileSchema);
