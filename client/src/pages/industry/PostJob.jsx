import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiX, FiCheckCircle } from 'react-icons/fi';
import { jobAPI } from '../../api/services';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'MBA', 'MCA'];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', type: 'internship', description: '', location: '', mode: 'onsite',
    duration: '', stipendAmount: '', salaryMin: '', salaryMax: '', openings: 1,
    applicationDeadline: '', requiredSkills: [], eligibilityMinCGPA: '', eligibilityBranches: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.requiredSkills.includes(skillInput.trim())) {
        setForm({ ...form, requiredSkills: [...form.requiredSkills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm({ ...form, requiredSkills: form.requiredSkills.filter(s => s !== skill) });
  const toggleBranch = (b) => {
    const branches = form.eligibilityBranches.includes(b)
      ? form.eligibilityBranches.filter(x => x !== b)
      : [...form.eligibilityBranches, b];
    setForm({ ...form, eligibilityBranches: branches });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.type === 'internship') payload.stipend = { amount: Number(form.stipendAmount) };
      else payload.salary = { min: Number(form.salaryMin), max: Number(form.salaryMax) };
      payload.eligibility = { minCGPA: Number(form.eligibilityMinCGPA), branches: form.eligibilityBranches };
      
      await jobAPI.postJob(payload);
      setSuccess(true);
      setTimeout(() => navigate('/industry/dashboard'), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FiCheckCircle className="text-6xl text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Job Posted Successfully!</h2>
        <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Opportunity</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Frontend Developer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary">
              <option value="internship">Internship</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Describe the role..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Press Enter to add)</label>
          <div className="border rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary">
            {form.requiredSkills.map(s => (
              <span key={s} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                {s} <FiX className="cursor-pointer" onClick={() => removeSkill(s)} />
              </span>
            ))}
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} className="flex-1 outline-none text-sm min-w-[150px]" placeholder="e.g. React, Python" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary">
              <option value="onsite">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Bangalore" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {form.type === 'internship' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 6 Months" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stipend (/month)</label>
                <input type="number" value={form.stipendAmount} onChange={e => setForm({...form, stipendAmount: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 20000" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (LPA)</label>
                <input type="number" value={form.salaryMin} onChange={e => setForm({...form, salaryMin: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 6" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (LPA)</label>
                <input type="number" value={form.salaryMax} onChange={e => setForm({...form, salaryMax: e.target.value})} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 12" />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility - Eligible Branches</label>
          <div className="grid grid-cols-4 gap-2">
            {BRANCHES.map(b => (
              <label key={b} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.eligibilityBranches.includes(b)} onChange={() => toggleBranch(b)} className="accent-primary" /> {b}
              </label>
            ))}
          </div>
        </div>

        <button disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-60">
          {loading ? 'Posting...' : 'Post Opportunity'}
        </button>
      </form>
    </div>
  );
}
