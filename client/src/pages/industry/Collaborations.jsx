import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiX, FiUsers, FiMessageSquare, FiCpu, FiBook,
  FiAlertCircle, FiCheckCircle, FiClock, FiCalendar
} from 'react-icons/fi';
import { industryAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const InputClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition';
const LabelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5';
const SelectClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition appearance-none';

const COLLAB_TYPES = [
  { value: 'mentorship',           label: 'Mentorship',           icon: FiUsers },
  { value: 'research',             label: 'Research Partnership',  icon: FiCpu },
  { value: 'live-project',         label: 'Live Project',          icon: FiAlertCircle },
  { value: 'guest-lecture',        label: 'Guest Lecture',         icon: FiMessageSquare },
  { value: 'workshop',             label: 'Workshop',              icon: FiBook },
  { value: 'innovation-challenge', label: 'Innovation Challenge',   icon: FiCheckCircle },
  { value: 'consultancy',          label: 'Consultancy',           icon: FiCpu },
];

const typeIcons = Object.fromEntries(COLLAB_TYPES.map(t => [t.value, t.icon]));
const typeLabels = Object.fromEntries(COLLAB_TYPES.map(t => [t.value, t.label]));

const typeColors = {
  mentorship:            'from-blue-500 to-indigo-500',
  research:              'from-purple-500 to-violet-500',
  'live-project':        'from-emerald-500 to-teal-500',
  'guest-lecture':       'from-amber-500 to-yellow-500',
  workshop:              'from-pink-500 to-rose-500',
  'innovation-challenge':'from-cyan-500 to-sky-500',
  consultancy:           'from-orange-500 to-red-500',
};

const AUDIENCE_OPTIONS = [
  { value: 'student',     label: 'Students' },
  { value: 'academician', label: 'Academicians' },
  { value: 'both',        label: 'Both' },
];

export default function Collaborations() {
  const [collabs, setCollabs]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [form, setForm] = useState({
    title: '', type: 'mentorship', description: '',
    targetAudience: 'both', requiredExpertise: [], duration: '',
    compensation: '', applicationDeadline: '',
  });
  const [expertiseInput, setExpertiseInput] = useState('');

  useEffect(() => {
    industryAPI.getCollaborations()
      .then(res => setCollabs(res.data?.collaborations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addExpertise = (e) => {
    if (e.key === 'Enter' && expertiseInput.trim()) {
      e.preventDefault();
      if (!form.requiredExpertise.includes(expertiseInput.trim())) {
        setForm({ ...form, requiredExpertise: [...form.requiredExpertise, expertiseInput.trim()] });
      }
      setExpertiseInput('');
    }
  };
  const removeExpertise = (s) =>
    setForm({ ...form, requiredExpertise: form.requiredExpertise.filter(x => x !== s) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await industryAPI.postCollaboration(form);
      setCollabs([res.data.collaboration, ...collabs]);
      setShowModal(false);
      setForm({ title: '', type: 'mentorship', description: '', targetAudience: 'both', requiredExpertise: [], duration: '', compensation: '', applicationDeadline: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (collab) => {
    const newStatus = collab.status === 'open' ? 'closed' : 'open';
    try {
      await industryAPI.updateCollaboration(collab._id, { status: newStatus });
      setCollabs(collabs.map(c => c._id === collab._id ? { ...c, status: newStatus } : c));
    } catch {}
  };

  if (loading) return <LoadingSpinner text="Loading collaborations..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Collaborations</h1>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:shadow-glow-md transition"
        >
          <FiPlus /> Post Collaboration
        </button>
      </div>

      {/* Type cards (informational) */}
      <div className="grid sm:grid-cols-3 gap-3">
        {COLLAB_TYPES.slice(0, 3).map((t) => {
          const Icon = t.icon;
          const grad = typeColors[t.value];
          return (
            <div key={t.value} className="glass-card rounded-2xl p-4 border border-white/[0.06] hover:border-indigo-500/20 transition cursor-pointer group" onClick={() => { setForm(f => ({ ...f, type: t.value })); setShowModal(true); }}>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-3 shadow-glow-sm`}>
                <Icon className="text-white text-sm" />
              </div>
              <h3 className="text-sm font-semibold text-gray-200 mb-1">{t.label}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.value === 'mentorship' && 'Guide students on real-world industry experience.'}
                {t.value === 'research' && 'Partner with institutions on research projects.'}
                {t.value === 'live-project' && 'Offer real projects for students to build and ship.'}
              </p>
              <p className="text-xs text-indigo-400 mt-3 group-hover:text-indigo-300 transition">Post this →</p>
            </div>
          );
        })}
      </div>

      {/* Posted Collaborations */}
      {collabs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Your Posted Collaborations</h2>
          <div className="space-y-3">
            {collabs.map((c) => {
              const Icon = typeIcons[c.type] || FiUsers;
              const grad = typeColors[c.type] || 'from-indigo-500 to-purple-500';
              const isOpen = c.status === 'open';
              return (
                <motion.div
                  key={c._id}
                  layout
                  className={`glass-card rounded-2xl p-5 border transition ${isOpen ? 'border-white/[0.06]' : 'border-white/[0.03] opacity-60'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 shadow-glow-sm`}>
                        <Icon className="text-white text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-200 text-sm">{c.title}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                            isOpen
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                          }`}>
                            {isOpen ? 'Open' : 'Closed'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 capitalize mt-0.5">{typeLabels[c.type]} · {c.targetAudience}</p>
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{c.description}</p>
                        {c.requiredExpertise?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {c.requiredExpertise.map((e, i) => (
                              <span key={i} className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">{e}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {c.applicationDeadline && (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <FiCalendar size={10} /> {new Date(c.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                      <button
                        onClick={() => toggleStatus(c)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                          isOpen
                            ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                            : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {isOpen ? 'Close' : 'Reopen'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {collabs.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/[0.06]">
          <FiUsers className="text-4xl text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No collaborations posted yet.</p>
        </div>
      )}

      {/* Post Collaboration Modal */}
      <AnimatePresence>
        {showModal && (
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
                  <h2 className="text-lg font-bold text-white">Post Collaboration</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-300 transition"><FiX size={20} /></button>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={LabelClass}>Title *</label>
                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={InputClass} placeholder="e.g. ML Mentorship Program" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LabelClass}>Type</label>
                      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={SelectClass}>
                        {COLLAB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={LabelClass}>Target Audience</label>
                      <select value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} className={SelectClass}>
                        {AUDIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={LabelClass}>Description</label>
                    <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${InputClass} resize-none`} placeholder="Describe the collaboration, expectations, and outcomes..." />
                  </div>

                  <div>
                    <label className={LabelClass}>Required Expertise <span className="text-gray-600 normal-case font-normal">(Enter to add)</span></label>
                    <div className="bg-dark-50 border border-white/10 rounded-xl p-2.5 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500/50 min-h-[46px]">
                      {form.requiredExpertise.map(s => (
                        <span key={s} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          {s} <FiX className="cursor-pointer" size={10} onClick={() => removeExpertise(s)} />
                        </span>
                      ))}
                      <input value={expertiseInput} onChange={e => setExpertiseInput(e.target.value)} onKeyDown={addExpertise} className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600 min-w-[120px]" placeholder="e.g. Python, Deep Learning" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LabelClass}>Duration</label>
                      <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className={InputClass} placeholder="e.g. 3 Months" />
                    </div>
                    <div>
                      <label className={LabelClass}>Application Deadline</label>
                      <input type="date" value={form.applicationDeadline} onChange={e => setForm({ ...form, applicationDeadline: e.target.value })} className={InputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={LabelClass}>Compensation / Stipend</label>
                    <input value={form.compensation} onChange={e => setForm({ ...form, compensation: e.target.value })} className={InputClass} placeholder="e.g. ₹5,000/month or Unpaid" />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-glow-md transition disabled:opacity-60"
                  >
                    {saving ? 'Posting...' : 'Post Collaboration'}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
