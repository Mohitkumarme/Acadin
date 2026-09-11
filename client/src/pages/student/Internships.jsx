import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiClock, FiDollarSign, FiCalendar, FiCheckCircle, FiX } from 'react-icons/fi';
import { jobAPI } from '../../api/services';
import SkillBadge from '../../components/shared/SkillBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const MODES = ['All', 'Remote', 'Onsite', 'Hybrid'];
const TYPES_FILTER = ['All', 'Internship', 'Fulltime', 'Parttime'];

export default function Internships() {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [appliedIds, setAppliedIds] = useState([]);
  const [applying, setApplying]   = useState(null);
  const [toast, setToast]         = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = (p = 1) => {
    setLoading(true);
    const params = { page: p, limit: 9 };
    if (typeFilter !== 'All')  params.type     = typeFilter.toLowerCase();
    if (modeFilter !== 'All')  params.mode     = modeFilter.toLowerCase();
    if (search.trim())         params.search   = search.trim();

    jobAPI.getAll(params)
      .then(res => {
        const data = res.data;
        setJobs(data?.jobs || data || []);
        setTotalPages(Math.ceil((data?.total || (data?.jobs || data || []).length) / 9) || 1);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(1); setPage(1); }, [typeFilter, modeFilter]);
  useEffect(() => { const t = setTimeout(() => { fetchJobs(1); setPage(1); }, 400); return () => clearTimeout(t); }, [search]);

  const handleApply = async (job) => {
    setApplying(job._id);
    try {
      await jobAPI.apply(job._id, {});
      setAppliedIds(prev => [...prev, job._id]);
      showToast(`✅ Applied to ${job.title} at ${job.companyName}!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to apply';
      if (msg.toLowerCase().includes('already')) {
        setAppliedIds(prev => [...prev, job._id]);
        showToast('You have already applied to this job.');
      } else {
        showToast(`❌ ${msg}`);
      }
    } finally {
      setApplying(null);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const clearFilters = () => { setSearch(''); setModeFilter('All'); setTypeFilter('All'); };

  const typeBadgeColor = (type) => ({
    internship: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    fulltime: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    parttime: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  }[type] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20');

  const modeBadgeColor = (mode) => ({
    remote: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    onsite: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    hybrid: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  }[mode] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20');

  return (
    <div className="space-y-5">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 glass-card border border-white/10 shadow-glow-sm rounded-xl px-5 py-3 text-sm text-gray-200 flex items-center gap-3"
          >
            {toast}
            <button onClick={() => setToast('')}><FiX className="text-gray-500 hover:text-gray-300" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Internships & Jobs</h1>
        <span className="text-sm text-gray-500">{jobs.length} opportunities found</span>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, or skill..."
            className="w-full pl-9 pr-4 py-2.5 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
          />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {TYPES_FILTER.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${typeFilter === t ? 'bg-indigo-500 text-white shadow-glow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {MODES.map(m => (
              <button key={m} onClick={() => setModeFilter(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${modeFilter === m ? 'bg-indigo-500 text-white shadow-glow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'}`}>
                {m}
              </button>
            ))}
          </div>
          {(search || modeFilter !== 'All' || typeFilter !== 'All') && (
            <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              <FiX /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Job Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching opportunities..." />
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FiSearch className="text-4xl mx-auto mb-3 opacity-40" />
          <p>No jobs match your filters.</p>
          <button onClick={clearFilters} className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">Clear filters</button>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {jobs.map(job => {
            const isApplied = appliedIds.includes(job._id);
            const visibleSkills = (job.requiredSkills || []).slice(0, 3);
            const extraSkills   = (job.requiredSkills || []).length - 3;

            return (
              <motion.div
                key={job._id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="glass-card rounded-2xl p-5 flex flex-col gap-3 hover:glass-card-hover transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-glow-sm">
                    {job.companyName?.[0] || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm leading-tight truncate">{job.title}</h3>
                    <p className="text-xs text-gray-500">{job.companyName}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${typeBadgeColor(job.type)}`}>{job.type}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${modeBadgeColor(job.mode)}`}>{job.mode}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {visibleSkills.map((s, i) => <SkillBadge key={i} skill={s} />)}
                  {extraSkills > 0 && <span className="text-xs bg-white/[0.05] text-gray-400 px-2 py-0.5 rounded-full border border-white/[0.06]">+{extraSkills}</span>}
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
                  {job.location && <span className="flex items-center gap-1"><FiMapPin size={10} /> {job.location}</span>}
                  {job.stipend?.amount ? (
                    <span className="flex items-center gap-1"><FiDollarSign size={10} /> ₹{job.stipend.amount.toLocaleString()}/mo</span>
                  ) : job.salary?.min ? (
                    <span className="flex items-center gap-1"><FiDollarSign size={10} /> {job.salary.min}–{job.salary.max} LPA</span>
                  ) : null}
                  {job.duration && <span className="flex items-center gap-1"><FiClock size={10} /> {job.duration}</span>}
                  {job.applicationDeadline && (
                    <span className="flex items-center gap-1 text-amber-400/70"><FiCalendar size={10} /> {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(job)}
                  disabled={isApplied || applying === job._id}
                  className={`mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isApplied
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-glow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60'
                  }`}
                >
                  {isApplied ? <><FiCheckCircle /> Applied</> : applying === job._id ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Applying...
                    </span>
                  ) : 'Apply Now'}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => { setPage(p); fetchJobs(p); }}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === p ? 'bg-indigo-500 text-white shadow-glow-sm' : 'glass-card text-gray-400 hover:text-white hover:border-indigo-500/30'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
