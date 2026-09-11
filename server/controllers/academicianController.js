const AcademicianProfile = require('../models/AcademicianProfile');
const LearningProgram = require('../models/LearningProgram');
const Collaboration = require('../models/Collaboration');

const isProfileComplete = (p) => !!(p && p.institution && p.department && p.designation && p.institutionEmail);

const getProfile = async (req, res) => {
  try {
    const profile = await AcademicianProfile.findOne({ userId: req.user.id });
    res.json({ profile: profile || null, profileComplete: isProfileComplete(profile) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const createOrUpdateProfile = async (req, res) => {
  try {
    const profile = await AcademicianProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...req.body, userId: req.user.id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const profile = await AcademicianProfile.findOne({ userId: req.user.id }).select('appliedOpportunities');

    const ops = profile ? profile.appliedOpportunities : [];
    const approved = ops.filter(o => o.status === 'approved' || o.status === 'selected').length;
    const pending  = ops.filter(o => o.status === 'applied').length;

    // upcoming programs for this academician
    const upcomingPrograms = await LearningProgram.find({
      targetAudience: { $in: ['academician', 'both'] },
      status: { $in: ['upcoming', 'ongoing'] },
    }).sort({ createdAt: -1 }).limit(3);

    // build recent applications list
    const recentApplications = ops.slice(-5).reverse().map(o => ({
      title:     o.opportunityId?.toString() || 'Opportunity',
      organizer: 'Industry Partner',
      status:    o.status,
      type:      o.type,
    }));

    res.json({
      stats: {
        totalApplied:    ops.length,
        approved,
        pending,
        researchProjects: ops.filter(o => o.type === 'research').length,
      },
      recentApplications,
      upcomingPrograms,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOpportunities = async (req, res) => {
  try {
    const programs = await LearningProgram.find({
      targetAudience: { $in: ['academician', 'both'] },
      status: { $in: ['upcoming', 'ongoing'] },
    }).sort({ createdAt: -1 });
    // return as "programs" so frontend can use res.data.programs or res.data
    res.json({ programs, opportunities: programs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getResearchCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.find({
      status: 'open',
    }).populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json({ collaborations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const applyToOpportunity = async (req, res) => {
  try {
    const { id: opportunityId } = req.params;
    const { type = 'fdp' } = req.body; // default to fdp if not provided

    let profile = await AcademicianProfile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new AcademicianProfile({ userId: req.user.id });
    }

    const alreadyApplied = profile.appliedOpportunities.some(
      o => o.opportunityId?.toString() === opportunityId
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this opportunity' });
    }

    profile.appliedOpportunities.push({
      opportunityId,
      type,
      appliedAt: new Date(),
      status: 'applied',
    });
    await profile.save();

    res.json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const applyToCollaboration = async (req, res) => {
  try {
    const { id: collabId } = req.params;
    const collab = await Collaboration.findById(collabId);
    if (!collab || collab.status !== 'open') {
      return res.status(400).json({ message: 'Collaboration is not open' });
    }
    let profile = await AcademicianProfile.findOne({ userId: req.user.id });
    if (!profile) profile = new AcademicianProfile({ userId: req.user.id });

    const already = profile.appliedOpportunities.some(o => o.opportunityId?.toString() === collabId);
    if (already) return res.status(400).json({ message: 'Already applied' });

    profile.appliedOpportunities.push({ opportunityId: collabId, type: 'research', status: 'applied' });
    await profile.save();
    res.json({ message: 'Applied to collaboration successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  getDashboardStats,
  getOpportunities,
  getResearchCollaborations,
  applyToOpportunity,
  applyToCollaboration,
};

