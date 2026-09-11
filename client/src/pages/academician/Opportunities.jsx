import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCalendar, FiCheckCircle, FiClock, FiAlertTriangle, FiX } from 'react-icons/fi';
import { academicianAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const TABS = ['All', 'FDP', 'Workshop', 'Webinar', 'Training'];

// Mock programs for when DB is empty
const MOCK_PROGRAMS = [
  { _id: 'm1', title: 'Faculty Development Program on AI & ML', companyName: 'IIT Bombay', type: 'fdp', mode: 'hybrid', duration: '5 Days', description: 'A comprehensive FDP covering machine learning, deep learning, and their applications in academia.', schedule: { registrationDeadline: '2025-12-31' } },
  { _id: 'm2', title: 'Workshop on IoT and Embedded Systems', companyName: 'TechCorp', type: 'workshop', mode: 'offline', duration: '2 Days', description: 'Hands-on workshop on IoT protocols, Raspberry Pi, and industry use cases.' },
  { _id: 'm3', title: 'Webinar: Teaching with AI Tools', companyName: 'NASSCOM', type: 'webinar', mode: 'online', duration: '3 Hours', description: 'Learn how to integrate AI tools like ChatGPT and Copilot into your teaching workflow.' },
  { _id: 'm4', title: 'Data Science for Educators', companyName: 'Infosys', type: 'training', mode: 'online', duration: '10 Days', description: 'In-depth training on Python, Pandas, and visualization for faculty members.' },
  { _id: 'm5', title: 'Industry 4.0 Awareness Program', companyName: 'Bosch India', type: 'fdp', mode: 'hybrid', duration: '3 Days', description: 'Understand how Industry 4.0 technologies are reshaping manufacturing and education.' },
  { _id: 'm6', title: 'Cloud Computing Bootcamp for Academics', companyName: 'AWS', type: 'workshop', mode: 'online', duration: '5 Days', description: 'Practical bootcamp on AWS services for academic research and teaching.' },
];

const typeBadge = {
  fdp:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  workshop: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  webinar:  'bg-teal-500/10 text-teal-400 border-teal-500/20',
  training: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const modeBadge = {
  online:  'bg-emerald-500/10 text-emerald-400',
  offline: 'bg-orange-500/10 text-orange-400',
  hybrid:  'bg-indigo-500/10 text-indigo-400',
};

// ── Profile Setup Modal ─────────────────────────────────────────────────────
function ProfileModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    institution: '', department: '', designation: '',
    institutionEmail: '', collegeWebsite: '',
    experience: '', specializations: [], avatar: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const InputClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-emerald-500/50 transition';
  const LabelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5';

  const fileToBase64 = (file) => new Promise((res, rej) => {
    if (file.size > 2 * 1024 * 1024) { rej(new Error('Max 2MB')); return; }
    const reader = new FileReader();
    reader.onload = e => res(e.target.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      setForm(f => ({ ...f, avatar: b64 }));
    } catch { setError('Photo must be under 2MB'); }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!form.specializations.includes(tagInput.trim()))
        setForm(f => ({ ...f, specializations: [...f.specializations, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.institutionEmail.endsWith('.edu.in') && !form.institutionEmail.includes('.ac.in') && !form.institutionEmail.includes('.edu')) {
      setError('Please use a valid institutional email (e.g., name@college.edu or name@college.ac.in)');
      return;
    }
    setSaving(true);
    try {
      await academicianAPI.updateProfile(form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/[0.08]"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Set Up Your Profile</h2>
              <p className="text-xs text-gray-500 mt-0.5">Verify your institution to unlock all features</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition"><FiX size={20} /></button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              <FiAlertTriangle size={13} /> {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white/[0.04] border border-white/10 flex-shrink-0 flex items-center justify-center">
                {form.avatar
                  ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-gray-500 text-xs">Photo</span>
                }
              </div>
              <div>
                <label className="cursor-pointer text-sm text-emerald-400 hover:text-emerald-300 transition font-medium">
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                </label>
                <p className="text-xs text-gray-600 mt-0.5">Max 2MB · JPG, PNG</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LabelClass}>Institution / College *</label>
                <input required value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} className={InputClass} placeholder="e.g. IIT Bombay" />
              </div>
              <div>
                <label className={LabelClass}>Department *</label>
                <input required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className={InputClass} placeholder="e.g. Computer Science" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LabelClass}>Designation *</label>
                <input required value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className={InputClass} placeholder="e.g. Assistant Professor" />
              </div>
              <div>
                <label className={LabelClass}>Years of Experience</label>
                <input type="number" min="0" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className={InputClass} placeholder="e.g. 5" />
              </div>
            </div>

            <div>
              <label className={LabelClass}>
                Institutional Email *
                <span className="ml-1 text-emerald-400/60 normal-case font-normal">(college domain — .ac.in / .edu)</span>
              </label>
              <input
                required
                type="email"
                value={form.institutionEmail}
                onChange={e => setForm({ ...form, institutionEmail: e.target.value })}
                className={InputClass}
                placeholder="yourname@college.ac.in"
              />
            </div>

            <div>
              <label className={LabelClass}>College Website</label>
              <input type="url" value={form.collegeWebsite} onChange={e => setForm({ ...form, collegeWebsite: e.target.value })} className={InputClass} placeholder="https://yourcolleg.ac.in" />
            </div>

            <div>
              <label className={LabelClass}>Specializations <span className="text-gray-600 normal-case font-normal">(Enter to add)</span></label>
              <div className="bg-dark-50 border border-white/10 rounded-xl p-2.5 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-emerald-500/50 min-h-[46px]">
                {form.specializations.map(s => (
                  <span key={s} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    {s} <FiX size={10} className="cursor-pointer" onClick={() => setForm(f => ({ ...f, specializations: f.specializations.filter(x => x !== s) }))} />
                  </span>
                ))}
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600 min-w-[120px]" placeholder="e.g. Machine Learning" />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-glow-sm transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save & Verify Profile'}
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Opportunities() {
  const [programs, setPrograms]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab]     = useState('All');
  const [search, setSearch]           = useState('');
  const [appliedIds, setAppliedIds]   = useState([]);
  const [applying, setApplying]       = useState(null);

  useEffect(() => {
    Promise.all([
      academicianAPI.getOpportunities().catch(() => ({ data: null })),
      academicianAPI.getProfile().catch(() => ({ data: null })),
    ]).then(([oppRes, profileRes]) => {
      const data = oppRes.data?.programs || oppRes.data?.opportunities || oppRes.data || [];
      setPrograms(data.length > 0 ? data : MOCK_PROGRAMS);
      setProfileComplete(profileRes.data?.profileComplete ?? false);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter(p => {
    const matchTab = activeTab === 'All' || p.type?.toLowerCase() === activeTab.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !search || p.title?.toLowerCase().includes(q) || p.companyName?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const handleApply = async (id) => {
    if (!profileComplete) { setShowProfileModal(true); return; }
    setApplying(id);
    try {
      await academicianAPI.applyToOpportunity(id, { type: 'fdp' });
      setAppliedIds(prev => [...prev, id]);
    } catch {
      if (String(id).startsWith('m')) setAppliedIds(prev => [...prev, id]);
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading opportunities..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">FDPs & Learning Opportunities</h1>
        {!profileComplete && (
          <button onClick={() => setShowProfileModal(true)} className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition flex items-center gap-1.5">
            <FiAlertTriangle size={12} /> Complete Profile
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-50 border border-white/[0.06] p-1 rounded-xl overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-3.5 border border-white/[0.06]">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or organizer..."
            className="w-full pl-9 pr-4 py-2 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
          />
        </div>
      </div>

      <p className="text-xs text-gray-600">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-gray-500 border border-white/[0.06]">No programs found for this filter.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, idx) => {
            const isApplied = appliedIds.includes(p._id);
            const tb = typeBadge[p.type?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            const mb = modeBadge[p.mode?.toLowerCase()] || 'bg-gray-500/10 text-gray-400';
            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-white/[0.06] hover:border-emerald-500/20 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-200 text-sm leading-tight">{p.title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{p.companyName || 'N/A'}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize ${tb}`}>{p.type}</span>
                </div>

                {p.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{p.description}</p>}

                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${mb}`}>{p.mode || 'TBD'}</span>
                  {p.duration && (
                    <span className="bg-white/[0.04] text-gray-500 border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FiClock size={9} /> {p.duration}
                    </span>
                  )}
                </div>

                {p.schedule?.registrationDeadline && (
                  <p className="text-xs text-red-400/80 flex items-center gap-1">
                    <FiCalendar size={10} /> Deadline: {new Date(p.schedule.registrationDeadline).toLocaleDateString()}
                  </p>
                )}

                <button
                  onClick={() => handleApply(p._id)}
                  disabled={isApplied || applying === p._id}
                  className={`mt-auto w-full py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    isApplied
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-glow-sm disabled:opacity-60'
                  }`}
                >
                  {isApplied ? <><FiCheckCircle size={13} /> Applied</> : applying === p._id ? 'Applying...' : 'Apply Now'}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Profile Setup Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <ProfileModal
            onClose={() => setShowProfileModal(false)}
            onSaved={() => { setProfileComplete(true); setShowProfileModal(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
