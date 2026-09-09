import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiClock, FiDollarSign, FiCalendar, FiCheckCircle, FiX } from 'react-icons/fi';
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

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-5 py-3 text-sm text-gray-700 flex items-center gap-3 animate-fade-in">
          {toast}
          <button onClick={() => setToast('')}><FiX className="text-gray-400" /></button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Internships & Jobs</h1>
        <span className="text-sm text-gray-500">{jobs.length} opportunities found</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, or skill..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
            {TYPES_FILTER.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${typeFilter === t ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
            {MODES.map(m => (
              <button key={m} onClick={() => setModeFilter(m)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${modeFilter === m ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                {m}
              </button>
            ))}
          </div>
          {(search || modeFilter !== 'All' || typeFilter !== 'All') && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
              <FiX /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Job Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching opportunities..." />
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FiSearch className="text-4xl mx-auto mb-3 opacity-40" />
          <p>No jobs match your filters.</p>
          <button onClick={clearFilters} className="mt-3 text-primary hover:underline text-sm">Clear filters</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => {
            const isApplied = appliedIds.includes(job._id);
            const visibleSkills = (job.requiredSkills || []).slice(0, 3);
            const extraSkills   = (job.requiredSkills || []).length - 3;
            const typeBadge = job.type === 'internship' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
            const modeBadge = {
              remote: 'bg-green-100 text-green-700',
              onsite: 'bg-orange-100 text-orange-700',
              hybrid: 'bg-teal-100 text-teal-700',
            }[job.mode] || 'bg-gray-100 text-gray-600';

            return (
              <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {job.companyName?.[0] || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight truncate">{job.title}</h3>
                    <p className="text-xs text-gray-500">{job.companyName}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeBadge}`}>{job.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${modeBadge}`}>{job.mode}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {visibleSkills.map((s, i) => <SkillBadge key={i} skill={s} />)}
                  {extraSkills > 0 && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{extraSkills}</span>}
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
                  {job.location && <span className="flex items-center gap-1"><FiMapPin size={10} /> {job.location}</span>}
                  {job.stipend?.amount ? (
                    <span className="flex items-center gap-1"><FiDollarSign size={10} /> ₹{job.stipend.amount}/mo</span>
                  ) : job.salary?.min ? (
                    <span className="flex items-center gap-1"><FiDollarSign size={10} /> {job.salary.min}–{job.salary.max} LPA</span>
                  ) : null}
                  {job.duration && <span className="flex items-center gap-1"><FiClock size={10} /> {job.duration}</span>}
                  {job.applicationDeadline && (
                    <span className="flex items-center gap-1 text-red-400"><FiCalendar size={10} /> {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(job)}
                  disabled={isApplied || applying === job._id}
                  className={`mt-auto w-full py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                    isApplied
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-primary text-white hover:bg-primary-dark disabled:opacity-60'
                  }`}
                >
                  {isApplied ? <><FiCheckCircle /> Applied</> : applying === job._id ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => { setPage(p); fetchJobs(p); }}
              className={`w-8 h-8 rounded-full text-sm font-medium ${page === p ? 'bg-primary text-white' : 'bg-white border text-gray-600 hover:border-primary'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
