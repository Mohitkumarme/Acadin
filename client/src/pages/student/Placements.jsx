import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiCheckCircle, FiBriefcase } from 'react-icons/fi';
import { jobAPI } from '../../api/services';
import JobCard from '../../components/shared/JobCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const MODES = ['remote', 'onsite', 'hybrid'];
const SKILLS_OPTIONS = ['React', 'Python', 'Java', 'Node.js', 'SQL', 'Machine Learning', 'Leadership', 'Data Science'];

export default function Placements() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ skills: [], mode: '' });
  const [page, setPage] = useState(1);
  const [applyJob, setApplyJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);
  const PER_PAGE = 9;

  useEffect(() => {
    jobAPI.getAll({ type: 'fulltime' })
      .then((res) => setJobs(res.data?.jobs || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch = !search || j.title?.toLowerCase().includes(q) || j.companyName?.toLowerCase().includes(q);
    const matchMode = !filters.mode || j.mode === filters.mode;
    const matchSkills = filters.skills.length === 0 || filters.skills.some((s) => j.requiredSkills?.includes(s));
    return matchSearch && matchMode && matchSkills;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleApply = async () => {
    if (!applyJob) return;
    setApplying(true);
    try {
      await jobAPI.apply(applyJob._id, {});
      setAppliedIds((prev) => [...prev, applyJob._id]);
      setApplyJob(null);
    } catch {}
    finally { setApplying(false); }
  };

  const toggleSkill = (skill) => {
    setFilters((f) => ({ ...f, skills: f.skills.includes(skill) ? f.skills.filter((s) => s !== skill) : [...f.skills, skill] }));
    setPage(1);
  };

  if (loading) return <LoadingSpinner text="Loading placement listings..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Full-time Placements</h1>
        <span className="text-sm text-gray-500">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title or company..."
            className="w-full pl-9 pr-4 py-2.5 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><FiFilter size={11} /> Mode:</span>
          <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => { setFilters((f) => ({ ...f, mode: '' })); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${!filters.mode ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'}`}
            >
              All
            </button>
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => { setFilters((f) => ({ ...f, mode: f.mode === m ? '' : m })); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${filters.mode === m ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><FiFilter size={11} /> Skills:</span>
          {SKILLS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSkill(s)}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                filters.skills.includes(s)
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-glow-sm'
                  : 'border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
          {(filters.skills.length > 0 || filters.mode) && (
            <button
              onClick={() => setFilters({ skills: [], mode: '' })}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
            >
              <FiX /> Clear
            </button>
          )}
        </div>
      </div>

      {paged.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <FiBriefcase className="text-4xl mx-auto mb-3 opacity-40" />
          <p>No placements match your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((job) => (
            <div key={job._id} className="relative">
              {appliedIds.includes(job._id) && (
                <div className="absolute inset-0 bg-dark/70 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                  <span className="text-emerald-400 font-semibold flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                    <FiCheckCircle /> Applied
                  </span>
                </div>
              )}
              <JobCard job={job} onApply={(j) => setApplyJob(j)} showApplyButton={!appliedIds.includes(job._id)} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                page === i + 1
                  ? 'bg-indigo-500 text-white shadow-glow-sm'
                  : 'glass-card text-gray-400 hover:text-white hover:border-indigo-500/30'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {applyJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setApplyJob(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative glass-card rounded-2xl shadow-glass-dark max-w-md w-full p-7"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-glow-sm">
                <FiBriefcase className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">Apply for {applyJob?.title}</h2>
              <p className="text-sm text-gray-400 mb-6">
                Company: <span className="font-medium text-gray-200">{applyJob?.companyName}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setApplyJob(null)}
                  className="flex-1 border border-white/10 text-gray-400 py-2.5 rounded-xl text-sm font-medium hover:bg-white/[0.03] hover:text-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:shadow-glow-md disabled:opacity-60 transition"
                >
                  {applying ? 'Applying...' : 'Confirm Apply'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
