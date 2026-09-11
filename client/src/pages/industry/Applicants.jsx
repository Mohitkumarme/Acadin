import React, { useEffect, useState } from 'react';
import { FiSearch, FiUser, FiExternalLink, FiBarChart2 } from 'react-icons/fi';
import { industryAPI, jobAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const statusConfig = {
  applied:     { label: 'Applied',     cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  shortlisted: { label: 'Shortlisted', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  selected:    { label: 'Selected',    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected:    { label: 'Rejected',    cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    industryAPI.getApplicants()
      .then(res => setApplicants(res.data?.applicants || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (jobId, studentId, status) => {
    try {
      await jobAPI.updateApplicantStatus(jobId, studentId, { status });
      setApplicants(applicants.map(a =>
        a.jobId === jobId && a.student._id === studentId ? { ...a, status } : a
      ));
    } catch {}
  };

  const filtered = applicants.filter(a =>
    !search ||
    a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading applicants..." />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-white">Manage Applicants</h1>

      {/* Search bar */}
      <div className="glass-card rounded-2xl p-3.5 border border-white/[0.06] flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or job title..."
            className="w-full pl-9 pr-4 py-2 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />
        </div>
        <div className="flex items-center text-xs text-gray-500 px-2">
          {filtered.length} applicant{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No applicants found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Applicant</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Job</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Match</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Applied</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((a, i) => {
                  const cfg = statusConfig[a.status] || statusConfig.applied;
                  const match = a.matchScore ?? 0;
                  const matchColor = match >= 70 ? 'text-emerald-400' : match >= 40 ? 'text-amber-400' : 'text-red-400';
                  const userId = a.student?._id;
                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-gray-400 flex-shrink-0">
                            <FiUser size={13} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">{a.student?.name || 'Unknown'}</p>
                            {a.student?.institution && (
                              <p className="text-xs text-gray-600">{a.student.institution}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400">{a.jobTitle}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold ${matchColor}`}>
                          {match}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs">
                        {new Date(a.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <select
                            value={a.status}
                            onChange={e => handleStatusChange(a.jobId, a.student._id, e.target.value)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border outline-none font-medium capitalize bg-transparent cursor-pointer transition ${cfg.cls}`}
                          >
                            <option value="applied">Applied</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          {userId && (
                            <a
                              href={`/portfolio/${userId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-500/60 hover:text-indigo-400 transition"
                              title="View Portfolio"
                            >
                              <FiExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
