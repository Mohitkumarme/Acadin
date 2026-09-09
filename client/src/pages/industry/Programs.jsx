import React, { useEffect, useState } from 'react';
import { FiPlus, FiX, FiBook } from 'react-icons/fi';
import { industryAPI } from '../../api/services';
import SkillBadge from '../../components/shared/SkillBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', type: 'certification', description: '', duration: '',
    mode: 'online', feeAmount: '', startDate: '', endDate: '', skills: []
  });
  const [skillInput, setSkillInput] = useState('');

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
    try {
      const payload = { ...form };
      if (form.feeAmount) payload.fee = { amount: Number(form.feeAmount), isFree: Number(form.feeAmount) === 0 };
      else payload.fee = { isFree: true, amount: 0 };
      payload.schedule = { startDate: form.startDate, endDate: form.endDate };

      const res = await industryAPI.postLearningProgram(payload);
      setPrograms([...programs, res.data.program || res.data]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner text="Loading programs..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Learning Programs</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-dark transition">
          <FiPlus /> Post Program
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400">No programs posted yet.</div>
        ) : programs.map((p, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800 leading-tight">{p.title}</h3>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize">{p.type}</span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {p.skills?.slice(0, 3).map((s, idx) => <SkillBadge key={idx} skill={s} />)}
            </div>
            <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between text-xs text-gray-500">
              <span className="capitalize">{p.mode}</span>
              <span className="font-semibold text-gray-700">{p.fee?.isFree ? 'Free' : `₹${p.fee?.amount || 0}`}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">Post Learning Program</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary">
                    <option value="certification">Certification</option>
                    <option value="workshop">Workshop</option>
                    <option value="training">Training</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Taught (Press Enter)</label>
                <div className="border rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary">
                  {form.skills.map(s => (
                    <span key={s} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                      {s} <FiX className="cursor-pointer" onClick={() => removeSkill(s)} />
                    </span>
                  ))}
                  <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} className="flex-1 outline-none text-sm min-w-[150px]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 2 Days" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee (₹ 0 = Free)</label>
                  <input type="number" value={form.feeAmount} onChange={e => setForm({...form, feeAmount: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="0" />
                </div>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition mt-4">
                Submit Program
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
