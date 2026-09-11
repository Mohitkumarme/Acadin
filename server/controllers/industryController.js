const IndustryProfile = require('../models/IndustryProfile');
const Job = require('../models/Job');
const LearningProgram = require('../models/LearningProgram');
const Collaboration = require('../models/Collaboration');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// Helper: check if profile is complete
const isProfileComplete = (p) => !!(p && p.companyName && p.industry && p.description && p.website && p.location);

// ─── Get Profile ──────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const profile = await IndustryProfile.findOne({ userId: req.user.id });
    res.json({ profile: profile || null, profileComplete: isProfileComplete(profile) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Create or Update Profile ─────────────────────────────
const createOrUpdateProfile = async (req, res) => {
  try {
    const profile = await IndustryProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...req.body, userId: req.user.id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Dashboard Stats ──────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });

    let totalApplications = 0;
    let totalShortlisted = 0;
    let totalSelected = 0;

    jobs.forEach((job) => {
      totalApplications += job.applicants.length;
      totalShortlisted += job.applicants.filter((a) => a.status === 'shortlisted').length;
      totalSelected   += job.applicants.filter((a) => a.status === 'selected').length;
    });

    res.json({
      totalJobsPosted:   jobs.length,
      totalApplications,
      totalShortlisted,
      totalSelected,
      recentJobs: jobs.slice(0, 5).map(j => ({
        _id:    j._id,
        title:  j.title,
        type:   j.type,
        status: j.status,
        applicants: j.applicants.length,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get All Applicants ───────────────────────────────────
const getApplicants = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).populate({
      path: 'applicants.studentId',
      model: 'User',
      select: 'name email',
    });

    const applicantsData = [];
    for (const job of jobs) {
      for (const applicant of job.applicants) {
        const studentProfile = await StudentProfile.findOne({
          userId: applicant.studentId?._id,
        }).select('skills cgpa institution degree branch skillScores');

        // calculate match score
        const studentSkills = (studentProfile?.skills || []).map(s => s.name?.toLowerCase());
        const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase());
        const matched = jobSkills.filter(s => studentSkills.includes(s)).length;
        const matchScore = jobSkills.length > 0 ? Math.round((matched / jobSkills.length) * 100) : 0;

        applicantsData.push({
          jobId:    job._id,
          jobTitle: job.title,
          appliedAt: applicant.appliedAt,
          status:   applicant.status,
          matchScore,
          student: {
            _id:         applicant.studentId?._id,
            name:        applicant.studentId?.name,
            email:       applicant.studentId?.email,
            skills:      studentProfile?.skills || [],
            cgpa:        studentProfile?.cgpa,
            institution: studentProfile?.institution,
            branch:      studentProfile?.branch,
          },
        });
      }
    }

    res.json({ applicants: applicantsData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Learning Programs ────────────────────────────────
const getLearningPrograms = async (req, res) => {
  try {
    const programs = await LearningProgram.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ programs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Post Learning Program ────────────────────────────────
const postLearningProgram = async (req, res) => {
  try {
    const industryProfile = await IndustryProfile.findOne({ userId: req.user.id });
    const programData = { ...req.body, postedBy: req.user.id };
    if (industryProfile) {
      programData.companyName = programData.companyName || industryProfile.companyName;
    }
    const program = await LearningProgram.create(programData);
    res.status(201).json({ program });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Collaborations ───────────────────────────────────
const getCollaborations = async (req, res) => {
  try {
    const collabs = await Collaboration.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ collaborations: collabs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Post Collaboration ───────────────────────────────────
const postCollaboration = async (req, res) => {
  try {
    const collab = await Collaboration.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json({ collaboration: collab });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Update Collaboration (close/reopen) ──────────────────
const updateCollaboration = async (req, res) => {
  try {
    const collab = await Collaboration.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!collab) return res.status(404).json({ message: 'Collaboration not found' });
    res.json({ collaboration: collab });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  getDashboardStats,
  getApplicants,
  getLearningPrograms,
  postLearningProgram,
  getCollaborations,
  postCollaboration,
  updateCollaboration,
};

