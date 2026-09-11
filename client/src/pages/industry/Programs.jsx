import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiBook, FiCalendar, FiGlobe } from 'react-icons/fi';
import { industryAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const InputClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition';
const LabelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5';
const SelectClass = 'w-full bg-dark-50 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition appearance-none';

const typeColors = {
  certification: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  workshop:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  training:      'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'certification', description: '', duration: '',
    mode: 'online', feeAmount: '', startDate: '', endDate: '', skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    industryAPI.getLearningPrograms()
      .then(res => setPrograms(res.data?.programs || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) {
        setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setForm({ ...form, skills: form.skills.filter(x => x !== s) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      payload.fee = form.feeAmount
        ? { amount: Number(form.feeAmount), isFree: Number(form.feeAmount) === 0 }
        : { isFree: true, amount: 0 };
      payload.schedule = { startDate: form.startDate, endDate: form.endDate };
      const res = await industryAPI.postLearningProgram(payload);
      setPrograms([res.data.program || res.data, ...programs]);
      setShowModal(false);
      setForm({ title: '', type: 'certification', description: '', duration: '', mode: 'online', feeAmount: '', startDate: '', endDate: '', skills: [] });
    } catch {}
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner text="Loading programs..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Learning Programs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:shadow-glow-md transition"
        >
          <FiPlus /> Post Program
        </button>
      </div>

      {/* Program Cards */}
      {programs.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border border-white/[0.06]">
          <FiBook className="text-4xl text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No programs posted yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p, i) => {
            const tc = typeColors[p.type] || typeColors.certification;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 flex flex-col border border-white/[0.06] hover:border-indigo-500/20 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-200 leading-tight text-sm flex-1 mr-2">{p.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize flex-shrink-0 ${tc}`}>{p.type}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{p.description}</p>
                {p.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-white/[0.04] text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                    {p.skills.length > 3 && <span className="text-[10px] text-gray-600">+{p.skills.length - 3}</span>}
                  </div>
                )}
                <div className="mt-auto pt-3 border-t border-white/[0.05] flex justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1"><FiGlobe size={10} /> {p.mode}</span>
                  <span className="font-semibold text-gray-300">{p.fee?.isFree ? 'Free' : `₹${p.fee?.amount || 0}`}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
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
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/[0.08]"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-white">Post Learning Program</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-300 transition">
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LabelClass}>Title</label>
                      <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={InputClass} placeholder="e.g. React Bootcamp" />
                    </div>
                    <div>
                      <label className={LabelClass}>Type</label>
                      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={SelectClass}>
                        <option value="certification">Certification</option>
                        <option value="workshop">Workshop</option>
                        <option value="training">Training</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={LabelClass}>Description</label>
                    <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${InputClass} resize-none`} placeholder="What will students learn?" />
                  </div>

                  <div>
                    <label className={LabelClass}>Skills Covered <span className="text-gray-600 normal-case font-normal">(Enter to add)</span></label>
                    <div className="bg-dark-50 border border-white/10 rounded-xl p-2.5 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500/50 min-h-[46px]">
                      {form.skills.map(s => (
                        <span key={s} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          {s} <FiX className="cursor-pointer" size={10} onClick={() => removeSkill(s)} />
                        </span>
                      ))}
                      <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-600 min-w-[120px]" placeholder="e.g. React" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={LabelClass}>Duration</label>
                      <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className={InputClass} placeholder="e.g. 2 Days" />
                    </div>
                    <div>
                      <label className={LabelClass}>Mode</label>
                      <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} className={SelectClass}>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className={LabelClass}>Fee ₹ (0 = Free)</label>
                      <input type="number" value={form.feeAmount} onChange={e => setForm({ ...form, feeAmount: e.target.value })} className={InputClass} placeholder="0" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LabelClass}>Start Date</label>
                      <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className={InputClass} />
                    </div>
                    <div>
                      <label className={LabelClass}>End Date</label>
                      <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className={InputClass} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-glow-md transition disabled:opacity-60"
                  >
                    {saving ? 'Posting...' : 'Post Program'}
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
