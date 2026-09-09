import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiX, FiCheckCircle } from 'react-icons/fi';
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
      <h1 className="text-xl font-bold text-gray-900">Full-time Placements</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title or company..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><FiFilter /> Mode:</span>
          {MODES.map((m) => (
            <button key={m} onClick={() => { setFilters((f) => ({ ...f, mode: f.mode === m ? '' : m })); setPage(1); }}
              className={`text-xs px-3 py-1 rounded-full border capitalize transition ${filters.mode === m ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
              {m}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><FiFilter /> Skills:</span>
          {SKILLS_OPTIONS.map((s) => (
            <button key={s} onClick={() => toggleSkill(s)}
              className={`text-xs px-3 py-1 rounded-full border transition ${filters.skills.includes(s) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-primary'}`}>
              {s}
            </button>
          ))}
          {(filters.skills.length > 0 || filters.mode) && (
            <button onClick={() => setFilters({ skills: [], mode: '' })} className="text-xs text-red-500 flex items-center gap-1 ml-2"><FiX /> Clear</button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} placement{filtered.length !== 1 ? 's' : ''} found</p>

      {paged.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No placements match your filters.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((job) => (
            <div key={job._id} className="relative">
              {appliedIds.includes(job._id) && (
                <div className="absolute inset-0 bg-green-50/80 rounded-xl z-10 flex items-center justify-center">
                  <span className="text-green-600 font-semibold flex items-center gap-2"><FiCheckCircle /> Applied</span>
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
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {applyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setApplyJob(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Apply for {applyJob?.title}</h2>
            <p className="text-sm text-gray-500 mb-5">Company: <span className="font-medium">{applyJob?.companyName}</span></p>
            <div className="flex gap-3">
              <button onClick={() => setApplyJob(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleApply} disabled={applying} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-60">
                {applying ? 'Applying...' : 'Confirm Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
