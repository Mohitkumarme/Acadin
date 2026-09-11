const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');

const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createOrUpdateProfile = async (req, res) => {
  try {
    const { phone, institution, degree, branch, yearOfStudy, cgpa, skills, avatar } = req.body;
    let profile = await StudentProfile.findOne({ userId: req.user.id });
    if (profile) {
      profile.phone = phone || profile.phone;
      profile.institution = institution || profile.institution;
      profile.degree = degree || profile.degree;
      profile.branch = branch || profile.branch;
      profile.yearOfStudy = yearOfStudy || profile.yearOfStudy;
      profile.cgpa = cgpa || profile.cgpa;
      if (skills) profile.skills = skills;
      if (avatar) profile.avatar = avatar;
      await profile.save();
    } else {
      profile = await StudentProfile.create({
        userId: req.user.id, phone, institution, degree, branch, yearOfStudy, cgpa, skills, avatar,
      });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id }).select('portfolio avatar');
    if (!profile) return res.json({});
    res.json({ ...(profile.portfolio?.toObject?.() || profile.portfolio || {}), avatar: profile.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const { headline, about, github, linkedin, website, projects, certifications, achievements, avatar } = req.body;
    let profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user.id });
    }
    profile.portfolio = { headline, about, github, linkedin, website, projects, certifications, achievements };
    if (avatar !== undefined) profile.avatar = avatar;
    await profile.save();
    res.json({ ...(profile.portfolio?.toObject?.() || profile.portfolio || {}), avatar: profile.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Public portfolio — no auth required
const getPublicPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    const User = require('../models/User');
    const user = await User.findById(userId).select('name email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await StudentProfile.findOne({ userId }).select('portfolio avatar skills skillScores');
    if (!profile) return res.status(404).json({ message: 'Portfolio not found' });

    res.json({
      name: user.name,
      email: user.email,
      avatar: profile.avatar,
      skills: profile.skills,
      skillScores: profile.skillScores,
      ...(profile.portfolio?.toObject?.() || profile.portfolio || {}),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getSkillProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id }).select('skillScores skills');
    if (!profile) return res.json({ skillScores: [], skills: [] });
    res.json({ skillScores: profile.skillScores, skills: profile.skills });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id }).populate('appliedJobs.jobId');
    if (!profile) return res.json({ applications: [] });
    
    const apps = profile.appliedJobs.map(app => {
      const job = app.jobId;
      return {
        _id: app._id,
        jobId: job ? job._id : null,
        companyName: job ? job.companyName : 'Unknown',
        role: job ? job.title : 'Unknown',
        type: job ? job.type : 'Unknown',
        status: app.status,
        appliedDate: app.appliedAt
      };
    });
    res.json({ applications: apps });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id }).populate('appliedJobs.jobId');
    if (!profile) {
      return res.json({
        stats: { totalApplications: 0, shortlisted: 0, selected: 0, rejected: 0, skillScore: 0, profileCompleteness: 0 },
        recentApplications: [],
        skillScores: []
      });
    }

    const totalApplications = profile.appliedJobs.length;
    const shortlisted = profile.appliedJobs.filter((a) => a.status === 'shortlisted').length;
    const selected = profile.appliedJobs.filter((a) => a.status === 'selected').length;
    const rejected = profile.appliedJobs.filter((a) => a.status === 'rejected').length;
    
    const avgSkillScore = profile.skillScores.length > 0
      ? Math.round(profile.skillScores.reduce((sum, s) => sum + s.score, 0) / profile.skillScores.length)
      : 0;
      
    // Recent applications (last 5)
    const recentApps = profile.appliedJobs
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      .slice(0, 5)
      .map(app => {
        const job = app.jobId;
        return {
          companyName: job ? job.companyName : 'Unknown',
          role: job ? job.title : 'Unknown',
          status: app.status
        };
      });

    res.json({
      stats: {
        totalApplications,
        shortlisted,
        selected,
        rejected,
        skillScore: avgSkillScore,
        profileCompleteness: 75
      },
      recentApplications: recentApps,
      skillScores: profile.skillScores || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  getPortfolio,
  updatePortfolio,
  getPublicPortfolio,
  getSkillProfile,
  getApplications,
  getDashboardStats,
};

