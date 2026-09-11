import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiCheckCircle, FiAlertTriangle, FiZap } from 'react-icons/fi';
import { jobAPI, industryAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

// ── Branch list ────────────────────────────────────────────────────────────────
const ALL_BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'MBA', 'MCA', 'BCA', 'B.Sc'];

// ── Role suggestion presets ────────────────────────────────────────────────────
const ROLE_PRESETS = [
  {
    label: 'Web Developer',
    type: 'fulltime',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Data Scientist',
    type: 'fulltime',
    skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'SQL'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'ML Engineer',
    type: 'fulltime',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'MLOps'],
    color: 'from-amber-500 to-orange-500',
  },
  {
    label: 'Backend Developer',
    type: 'fulltime',
    skills: ['Node.js', 'MongoDB', 'REST API', 'Docker', 'PostgreSQL'],
    color: 'from-purple-500 to-violet-500',
  },
  {
    label: 'UI/UX Designer',
    type: 'fulltime',
    skills: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research'],
    color: 'from-pink-500 to-rose-500',
  },
  {
    label: 'DevOps Engineer',
    type: 'fulltime',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'],
    color: 'from-indigo-500 to-blue-500',
  },
  {
    label: 'Web Intern',
    type: 'internship',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    color: 'from-cyan-500 to-sky-500',
  },
  {
    label: 'Data Analyst',
    type: 'fulltime',
    skills: ['SQL', 'Excel', 'Python', 'Tableau', 'Statistics'],
    color: 'from-lime-500 to-green-500',
  },
];

const InputClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition';
const LabelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5';
const SelectClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition appearance-none';

export default function PostJob() {
  const navigate = useNavigate();
  const [profileComplete, setProfileComplete] = useState(null); // null = loading
  const [form, setForm] = useState({
    title: '', type: 'fulltime', description: '', location: '', mode: 'onsite',
    duration: '', stipendAmount: '', salaryMin: '', salaryMax: '', openings: 1,
    applicationDeadline: '', requiredSkills: [],
    eligibilityMinCGPA: '', eligibilityBranches: [], allBranchesAccepted: false,
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    industryAPI.getProfile()
      .then(res => setProfileComplete(res.data?.profileComplete ?? false))
      .catch(() => setProfileComplete(false));
  }, []);

  const applyPreset = (preset) => {
    setForm(f => ({
      ...f,
      title: preset.label,
      type: preset.type,
      requiredSkills: preset.skills,
    }));
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.requiredSkills.includes(skillInput.trim())) {
        setForm({ ...form, requiredSkills: [...form.requiredSkills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) =>
    setForm({ ...form, requiredSkills: form.requiredSkills.filter(s => s !== skill) });

  const toggleBranch = (b) => {
    const branches = form.eligibilityBranches.includes(b)
      ? form.eligibilityBranches.filter(x => x !== b)
      : [...form.eligibilityBranches, b];
    setForm({ ...form, eligibilityBranches: branches });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      if (form.type === 'internship') {
        payload.stipend = { amount: Number(form.stipendAmount) };
      } else {
        payload.salary = { min: Number(form.salaryMin), max: Number(form.salaryMax) };
      }
      payload.eligibility = {
        minCGPA: Number(form.eligibilityMinCGPA) || 0,
        branches: form.allBranchesAccepted ? [] : form.eligibilityBranches,
        allBranchesAccepted: form.allBranchesAccepted,
      };
      await jobAPI.postJob(payload);
      setSuccess(true);
      setTimeout(() => navigate('/industry/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (profileComplete === null) return <LoadingSpinner text="Checking profile..." />;

  // Profile incomplete gate
  if (!profileComplete) {
    return <ProfileSetupGate />;
  }

  // Success screen
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
          <FiCheckCircle className="text-3xl text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Job Posted Successfully!</h2>
        <p className="text-gray-500 text-sm mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Post a New Opportunity</h1>
      </div>

      {/* Role Suggestions */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <FiZap className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-gray-300">Quick Fill — Choose a Role Template</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ROLE_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="group rounded-xl p-3 text-left border border-white/[0.06] bg-white/[0.02] hover:border-indigo-500/30 hover:bg-indigo-500/5 transition"
            >
              <div className={`w-7 h-1.5 rounded-full bg-gradient-to-r ${p.color} mb-2`} />
              <p className="text-xs font-semibold text-gray-300 group-hover:text-white transition leading-snug">{p.label}</p>
              <p className="text-[10px] text-gray-600 mt-0.5 capitalize">{p.type}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.06]">
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
            <FiAlertTriangle size={14} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title + Type */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={LabelClass}>Job Title</label>
              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className={InputClass}
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div>
              <label className={LabelClass}>Opportunity Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={SelectClass}>
                <option value="internship">Internship</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={LabelClass}>Job Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className={`${InputClass} resize-none`}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className={LabelClass}>Required Skills <span className="text-gray-600 normal-case font-normal">(Press Enter to add)</span></label>
            <div className="bg-dark-50 border border-white/10 rounded-xl p-2.5 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500/50 min-h-[46px]">
              {form.requiredSkills.map(s => (
                <span key={s} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  {s} <FiX className="cursor-pointer hover:text-indigo-200" size={10} onClick={() => removeSkill(s)} />
                </span>
              ))}
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600 min-w-[120px]"
                placeholder="Add a skill..."
              />
            </div>
          </div>

          {/* Location + Mode */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={LabelClass}>Location</label>
              <input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className={InputClass}
                placeholder="e.g. Bangalore / Remote"
              />
            </div>
            <div>
              <label className={LabelClass}>Work Mode</label>
              <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} className={SelectClass}>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Stipend / Salary */}
          <div className="grid sm:grid-cols-2 gap-4">
            {form.type === 'internship' ? (
              <>
                <div>
                  <label className={LabelClass}>Duration</label>
                  <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className={InputClass} placeholder="e.g. 3 Months" />
                </div>
                <div>
                  <label className={LabelClass}>Stipend (/month in ₹)</label>
                  <input type="number" value={form.stipendAmount} onChange={e => setForm({ ...form, stipendAmount: e.target.value })} className={InputClass} placeholder="e.g. 20000" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={LabelClass}>Min Salary (LPA)</label>
                  <input type="number" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} className={InputClass} placeholder="e.g. 6" />
                </div>
                <div>
                  <label className={LabelClass}>Max Salary (LPA)</label>
                  <input type="number" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} className={InputClass} placeholder="e.g. 14" />
                </div>
              </>
            )}
          </div>

          {/* Openings + Deadline + CGPA */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={LabelClass}>No. of Openings</label>
              <input type="number" min={1} value={form.openings} onChange={e => setForm({ ...form, openings: e.target.value })} className={InputClass} />
            </div>
            <div>
              <label className={LabelClass}>Application Deadline</label>
              <input type="date" value={form.applicationDeadline} onChange={e => setForm({ ...form, applicationDeadline: e.target.value })} className={InputClass} />
            </div>
            <div>
              <label className={LabelClass}>Min CGPA</label>
              <input type="number" step="0.1" min="0" max="10" value={form.eligibilityMinCGPA} onChange={e => setForm({ ...form, eligibilityMinCGPA: e.target.value })} className={InputClass} placeholder="e.g. 7.0" />
            </div>
          </div>

          {/* Branches */}
          <div>
            <label className={LabelClass}>Eligible Branches</label>
            <label className="flex items-center gap-2.5 mb-3 cursor-pointer group">
              <div
                onClick={() => setForm(f => ({ ...f, allBranchesAccepted: !f.allBranchesAccepted, eligibilityBranches: [] }))}
                className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${form.allBranchesAccepted ? 'bg-indigo-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.allBranchesAccepted ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm text-gray-300 font-medium">All Branches Accepted</span>
            </label>

            <AnimatePresence>
              {!form.allBranchesAccepted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {ALL_BRANCHES.map(b => {
                      const checked = form.eligibilityBranches.includes(b);
                      return (
                        <button
                          type="button"
                          key={b}
                          onClick={() => toggleBranch(b)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                            checked
                              ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                              : 'bg-white/[0.02] text-gray-500 border-white/10 hover:border-indigo-500/20 hover:text-gray-300'
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-glow-md transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Posting...</>
            ) : (
              'Post Opportunity'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Profile Setup Gate ─────────────────────────────────────────────────────────
function ProfileSetupGate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: '', industry: '', description: '', website: '',
    location: '', size: 'startup', linkedin: '',
    contactPerson: { name: '', email: '', phone: '', designation: '' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Manufacturing', 'Consulting', 'Media', 'Government', 'Other'];
  const SIZES = [
    { value: 'startup', label: 'Startup (1–10)' },
    { value: 'small', label: 'Small (11–50)' },
    { value: 'medium', label: 'Medium (51–200)' },
    { value: 'large', label: 'Large (201–1000)' },
    { value: 'enterprise', label: 'Enterprise (1000+)' },
  ];

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await industryAPI.updateProfile(form);
      navigate('/industry/post-job', { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const InputClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition';
  const LabelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5';
  const SelectClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition appearance-none';

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="glass-card rounded-2xl p-5 border border-amber-500/15 flex items-start gap-3">
        <FiAlertTriangle className="text-amber-400 text-xl flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-400">Profile Setup Required</p>
          <p className="text-xs text-amber-400/70 mt-0.5">Complete your company profile first to start posting jobs and internships.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-white/[0.06] space-y-5">
        <h2 className="font-bold text-white text-lg">Company Details</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LabelClass}>Company Name *</label>
            <input required value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} className={InputClass} placeholder="e.g. Acme Corp" />
          </div>
          <div>
            <label className={LabelClass}>Industry *</label>
            <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className={SelectClass}>
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={LabelClass}>About the Company *</label>
          <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${InputClass} resize-none`} placeholder="Briefly describe your company, mission, and culture..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LabelClass}>Website *</label>
            <input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className={InputClass} placeholder="https://yourcompany.com" />
          </div>
          <div>
            <label className={LabelClass}>Headquarters Location *</label>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={InputClass} placeholder="e.g. Bangalore, India" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LabelClass}>Company Size</label>
            <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className={SelectClass}>
              {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className={LabelClass}>LinkedIn</label>
            <input type="url" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className={InputClass} placeholder="https://linkedin.com/company/..." />
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Contact Person</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { field: 'name', placeholder: 'Contact Name' },
              { field: 'designation', placeholder: 'e.g. HR Manager' },
              { field: 'email', placeholder: 'work@company.com', type: 'email' },
              { field: 'phone', placeholder: '+91 98765 43210' },
            ].map(({ field, placeholder, type = 'text' }) => (
              <div key={field}>
                <label className={LabelClass}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={type}
                  value={form.contactPerson[field] || ''}
                  onChange={e => setForm({ ...form, contactPerson: { ...form.contactPerson, [field]: e.target.value } })}
                  className={InputClass}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !form.companyName || !form.industry || !form.description || !form.website || !form.location}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-glow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save & Continue to Post Job'}
        </button>
      </div>
    </div>
  );
}
