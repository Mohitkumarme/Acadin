import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiX, FiExternalLink, FiCheckSquare, FiActivity } from 'react-icons/fi';
import { institutionAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const placementBadge = (profile) => {
  const apps = profile?.appliedJobs || [];
  if (apps.some(a => a.status === 'selected'))   return { label: 'Placed',      cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  if (apps.length > 0)                            return { label: 'In Progress', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
  return                                                  { label: 'Not Started', cls: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
};

const profileColor = (pct) => {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'MBA', 'MCA'];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStudents = () => {
    institutionAPI.getStudents()
      .then(res => { setStudents(res.data?.students || res.data || []); setLastUpdated(new Date()); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
    const interval = setInterval(fetchStudents, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = students.filter(s => {
    const name   = s.user?.name?.toLowerCase() || '';
    const branch = s.profile?.branch?.toLowerCase() || '';
    const q      = search.toLowerCase();
    const matchSearch = !search || name.includes(q) || s.user?.email?.toLowerCase().includes(q);
    const matchBranch = !branchFilter || branch.includes(branchFilter.toLowerCase());
    const badge = placementBadge(s.profile);
    const matchStatus = !statusFilter || badge.label === statusFilter;
    return matchSearch && matchBranch && matchStatus;
  });

  const avgScore = (scores) => {
    if (!scores?.length) return 0;
    return Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length);
  };

  // Summary stats
  const total   = students.length;
  const placed  = students.filter(s => s.profile?.appliedJobs?.some(a => a.status === 'selected')).length;
  const avgComp = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.profileComplete ?? 0), 0) / students.length)
    : 0;

  if (loading) return <LoadingSpinner text="Loading students..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Student Monitoring</h1>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-600 flex items-center gap-1"><FiActivity size={10} /> {lastUpdated.toLocaleTimeString()}</span>
          )}
          <button onClick={fetchStudents} className="text-xs bg-white/[0.04] border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition">Refresh</button>
        </div>
      </div>

      {/* Summary Strips */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Students', value: total,    color: 'text-indigo-400' },
          { label: 'Placed',         value: placed,   color: 'text-emerald-400' },
          { label: 'Avg Profile',    value: `${avgComp}%`, color: avgComp >= 70 ? 'text-emerald-400' : avgComp >= 40 ? 'text-amber-400' : 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-2xl p-4 border border-white/[0.06] text-center">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-3.5 border border-white/[0.06] flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-orange-500/40 transition" />
        </div>
        <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}
          className="bg-dark-50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/40 transition">
          <option value="">All Branches</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-dark-50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/40 transition">
          <option value="">All Statuses</option>
          <option value="Placed">Placed</option>
          <option value="In Progress">In Progress</option>
          <option value="Not Started">Not Started</option>
        </select>
        <div className="text-xs text-gray-600 flex items-center px-1">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                <tr>
                  {['Student', 'Branch', 'CGPA', 'Skill Score', 'Profile', 'Applications', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((s, i) => {
                  const badge = placementBadge(s.profile);
                  const score = avgScore(s.profile?.skillScores);
                  const pct   = s.profileComplete ?? 0;
                  const userId = s.user?._id;
                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition cursor-pointer" onClick={() => setSelected(s)}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-orange-400 flex-shrink-0">
                            {s.user?.name?.[0]?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-200 text-xs">{s.user?.name}</p>
                            <p className="text-gray-600 text-[10px] truncate max-w-[120px]">{s.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{s.profile?.branch || '—'}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">{s.profile?.cgpa || '—'}</td>
                      <td className="px-5 py-3.5">
                        {score > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${score}%` }} />
                            </div>
                            <span className="text-xs text-gray-400">{score}%</span>
                          </div>
                        ) : <span className="text-gray-600 text-xs">N/A</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${profileColor(pct)}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{s.profile?.appliedJobs?.length || 0}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${badge.cls}`}>{badge.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card rounded-2xl w-full max-w-lg border border-white/[0.08] max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10 flex items-center justify-center text-xl font-bold text-orange-400">
                      {selected.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-bold text-white">{selected.user?.name}</h2>
                      <p className="text-xs text-gray-500">{selected.user?.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-300 transition"><FiX size={20} /></button>
                </div>

                {/* Profile completeness bar */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-gray-500">Profile Completion</span>
                    <span className="text-xs font-bold text-white">{selected.profileComplete ?? 0}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${profileColor(selected.profileComplete ?? 0)}`} style={{ width: `${selected.profileComplete ?? 0}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  {[
                    { label: 'Branch',       val: selected.profile?.branch },
                    { label: 'Degree',       val: selected.profile?.degree },
                    { label: 'CGPA',         val: selected.profile?.cgpa },
                    { label: 'Year',         val: selected.profile?.yearOfStudy },
                    { label: 'Applications', val: selected.profile?.appliedJobs?.length || 0 },
                    { label: 'Skills',       val: selected.profile?.skills?.length || 0 },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
                      <p className="font-semibold text-gray-200 mt-0.5">{val || '—'}</p>
                    </div>
                  ))}
                </div>

                {selected.profile?.skills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.profile.skills.map((sk, i) => (
                        <span key={i} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg">{sk.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={`/portfolio/${selected.user?._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-semibold hover:bg-indigo-500/20 transition"
                >
                  <FiExternalLink size={13} /> View Public Portfolio
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
