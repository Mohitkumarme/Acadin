const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const IndustryProfile = require('../models/IndustryProfile');

// ─── Get All Jobs ─────────────────────────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const { type, location, skills, search, page = 1, limit = 10 } = req.query;

    const filter = { status: 'active' };

    if (type)     filter.type     = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      filter.requiredSkills = { $in: skillArray };
    }
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { requiredSkills: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({
      jobs,
      total,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ─── Get Job By ID ────────────────────────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'postedBy',
      'name email'
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Post Job ─────────────────────────────────────────────────────────────────
const postJob = async (req, res) => {
  try {
    // Auto-fill companyName from IndustryProfile
    const industryProfile = await IndustryProfile.findOne({ userId: req.user.id });

    const jobData = {
      ...req.body,
      postedBy: req.user.id,
    };

    if (industryProfile) {
      jobData.companyName = jobData.companyName || industryProfile.companyName;
      jobData.companyLogo = jobData.companyLogo || industryProfile.logo;
    }

    const job = await Job.create(jobData);
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Apply To Job ─────────────────────────────────────────────────────────────
const applyToJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const studentId = req.user.id;
    const { resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'active') {
      return res.status(400).json({ message: 'Job is not accepting applications' });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      (a) => a.studentId.toString() === studentId
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    // Add to job applicants
    job.applicants.push({ studentId, resumeUrl });
    await job.save();

    // Add to student's applied jobs
    await StudentProfile.findOneAndUpdate(
      { userId: studentId },
      {
        $push: {
          appliedJobs: { jobId, status: 'applied' },
        },
      },
      { upsert: true }
    );

    res.json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Posted Jobs ──────────────────────────────────────────────────────────
const getPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Update Applicant Status ──────────────────────────────────────────────────
const updateApplicantStatus = async (req, res) => {
  try {
    const { id: jobId, studentId } = req.params;
    const { status } = req.body;

    const validStatuses = ['applied', 'shortlisted', 'rejected', 'selected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const job = await Job.findOne({ _id: jobId, postedBy: req.user.id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const applicant = job.applicants.find(
      (a) => a.studentId.toString() === studentId
    );
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    applicant.status = status;
    await job.save();

    // Sync status in StudentProfile
    await StudentProfile.findOneAndUpdate(
      { userId: studentId, 'appliedJobs.jobId': jobId },
      { $set: { 'appliedJobs.$.status': status } }
    );

    res.json({ message: 'Applicant status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Recommended Jobs ─────────────────────────────────────────────────────
const getRecommendedJobs = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ userId: req.user.id }).select('skills');

    if (!studentProfile || studentProfile.skills.length === 0) {
      // No skills — return recent active jobs
      const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 }).limit(10);
      return res.json({ jobs });
    }

    const studentSkills = studentProfile.skills.map((s) => s.name.toLowerCase());
    const activeJobs = await Job.find({ status: 'active' });

    // Score each job by skill match
    const scoredJobs = activeJobs.map((job) => {
      const requiredSkills = job.requiredSkills.map((s) => s.toLowerCase());
      const matchCount = requiredSkills.filter((s) => studentSkills.includes(s)).length;
      const matchScore = requiredSkills.length > 0 ? matchCount / requiredSkills.length : 0;
      return { job, matchScore };
    });

    // Sort by match score descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ jobs: scoredJobs.slice(0, 10).map((s) => ({ ...s.job.toObject(), matchScore: Math.round(s.matchScore * 100) })) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  postJob,
  applyToJob,
  getPostedJobs,
  updateApplicantStatus,
  getRecommendedJobs,
};
