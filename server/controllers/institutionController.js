const InstitutionProfile = require('../models/InstitutionProfile');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const User = require('../models/User');

// ─── Get Profile ──────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const profile = await InstitutionProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Create or Update Profile ─────────────────────────────────────────────────
const createOrUpdateProfile = async (req, res) => {
  try {
    const profileData = { ...req.body };

    const profile = await InstitutionProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { ...profileData, userId: req.user.id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Dashboard Stats ──────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const studentProfiles = await StudentProfile.find().select('skills skillScores appliedJobs branch department');

    // Skill distribution
    const skillCount = {};
    studentProfiles.forEach(p => {
      p.skills.forEach(skill => {
        const name = skill.name?.toLowerCase();
        if (name) skillCount[name] = (skillCount[name] || 0) + 1;
      });
    });
    const skillDistribution = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1]).slice(0, 10).map(([skill, count]) => ({ skill, count }));

    // Avg skill score
    let totalScores = 0; let scoreCount = 0;
    studentProfiles.forEach(p => p.skillScores.forEach(s => { totalScores += s.score; scoreCount++; }));
    const avgSkillScore = scoreCount > 0 ? Math.round(totalScores / scoreCount) : 0;

    // Placement rate
    const allJobs = await Job.find().select('applicants');
    let totalApplications = 0; let totalSelected = 0;
    allJobs.forEach(job => {
      totalApplications += job.applicants.length;
      totalSelected += job.applicants.filter(a => a.status === 'selected').length;
    });
    const placementRate = totalApplications > 0 ? Math.round((totalSelected / totalApplications) * 100) : 0;

    // Profile completeness
    const profilesWithCompletion = studentProfiles.map(p => {
      let score = 0;
      if (p.skills?.length > 0) score += 25;
      if (p.skillScores?.length > 0) score += 25;
      if (p.appliedJobs?.length > 0) score += 25;
      if (p.branch) score += 25;
      return score;
    });
    const avgProfileComplete = profilesWithCompletion.length > 0
      ? Math.round(profilesWithCompletion.reduce((a, b) => a + b, 0) / profilesWithCompletion.length)
      : 0;

    // Department-wise placement from real student profiles
    const deptMap = {};
    studentProfiles.forEach(p => {
      const dept = p.branch || 'Unknown';
      if (!deptMap[dept]) deptMap[dept] = { students: 0, placed: 0 };
      deptMap[dept].students++;
      const isPlaced = p.appliedJobs?.some(j => j.status === 'selected');
      if (isPlaced) deptMap[dept].placed++;
    });
    const departmentPlacement = Object.entries(deptMap)
      .filter(([dept]) => dept !== 'Unknown')
      .map(([dept, d]) => ({
        dept,
        students: d.students,
        placed: d.placed,
        rate: d.students > 0 ? Math.round((d.placed / d.students) * 100) : 0,
      }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 8);

    res.json({
      totalStudents, avgSkillScore, skillDistribution, placementRate,
      totalApplications, totalSelected, avgProfileComplete, departmentPlacement,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ─── Get Students List ────────────────────────────────────────────────────────
const getStudentsList = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const studentIds = students.map(s => s._id);
    const profiles = await StudentProfile.find({ userId: { $in: studentIds } });

    const profileMap = {};
    profiles.forEach(p => { profileMap[p.userId.toString()] = p; });

    const result = students.map(student => {
      const profile = profileMap[student._id.toString()] || null;

      // Compute profile completeness score
      let profileComplete = 0;
      if (profile) {
        if (profile.branch) profileComplete += 20;
        if (profile.cgpa) profileComplete += 20;
        if (profile.skills?.length > 0) profileComplete += 20;
        if (profile.skillScores?.length > 0) profileComplete += 20;
        if (profile.portfolio?.about) profileComplete += 10;
        if (profile.avatar) profileComplete += 10;
      }

      return { user: student, profile, profileComplete };
    });

    res.json({ students: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ─── Get Placement Analytics ──────────────────────────────────────────────────
const getPlacementAnalytics = async (req, res) => {
  try {
    // Total selected per company
    const jobs = await Job.find().select('companyName applicants createdAt');

    const companyStats = {};
    const monthlyData = {};

    jobs.forEach((job) => {
      const company = job.companyName || 'Unknown';
      if (!companyStats[company]) {
        companyStats[company] = { totalApplications: 0, selected: 0, shortlisted: 0 };
      }

      job.applicants.forEach((applicant) => {
        companyStats[company].totalApplications++;
        if (applicant.status === 'selected') companyStats[company].selected++;
        if (applicant.status === 'shortlisted') companyStats[company].shortlisted++;

        // Monthly breakdown
        const month = new Date(applicant.appliedAt).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { applied: 0, shortlisted: 0, selected: 0 };
        }
        monthlyData[month].applied++;
        if (applicant.status === 'selected') monthlyData[month].selected++;
        if (applicant.status === 'shortlisted') monthlyData[month].shortlisted++;
      });
    });

    const companyAnalytics = Object.entries(companyStats)
      .sort((a, b) => b[1].selected - a[1].selected)
      .map(([company, stats]) => ({ company, ...stats }));

    const monthlyAnalytics = Object.entries(monthlyData).map(([month, stats]) => ({
      month,
      ...stats,
    }));

    res.json({ companyAnalytics, monthlyAnalytics });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Skill Demand Trends ──────────────────────────────────────────────────
const getSkillDemandTrends = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }).select('requiredSkills preferredSkills');

    const skillCount = {};

    jobs.forEach((job) => {
      [...job.requiredSkills, ...job.preferredSkills].forEach((skill) => {
        const normalized = skill.toLowerCase();
        skillCount[normalized] = (skillCount[normalized] || 0) + 1;
      });
    });

    const trends = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([skill, count]) => ({ skill, count }));

    res.json({ trends });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile,
  getDashboardStats,
  getStudentsList,
  getPlacementAnalytics,
  getSkillDemandTrends,
};
