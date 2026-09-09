import React, { useEffect, useState } from 'react';
import { FiSearch, FiUser, FiX } from 'react-icons/fi';
import { institutionAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const statusBadge = (apps) => {
  if (!apps || apps.length === 0) return { label: 'Not Started', cls: 'bg-gray-100 text-gray-600' };
  const selected = apps.find(a => a.status === 'selected');
  if (selected) return { label: 'Placed', cls: 'bg-green-100 text-green-700' };
  return { label: 'In Progress', cls: 'bg-blue-100 text-blue-700' };
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    institutionAPI.getStudents()
      .then(res => setStudents(res.data?.students || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    const name = s.user?.name?.toLowerCase() || '';
    const branch = s.profile?.branch?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchSearch = !search || name.includes(q);
    const matchBranch = !branchFilter || branch.includes(branchFilter.toLowerCase());
    const st = statusBadge(s.profile?.appliedJobs);
    const matchStatus = !statusFilter || st.label.toLowerCase().includes(statusFilter.toLowerCase());
    return matchSearch && matchBranch && matchStatus;
  });

  const avgScore = (scores) => {
    if (!scores || scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length);
  };

  if (loading) return <LoadingSpinner text="Loading students..." />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Student Monitoring</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <input value={branchFilter} onChange={e => setBranchFilter(e.target.value)} placeholder="Filter by branch (e.g. CSE)"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary w-44" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Statuses</option>
          <option value="Placed">Placed</option>
          <option value="In Progress">In Progress</option>
          <option value="Not Started">Not Started</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Branch</th>
                  <th className="px-5 py-3 text-left">CGPA</th>
                  <th className="px-5 py-3 text-left">Skill Score</th>
                  <th className="px-5 py-3 text-left">Applications</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s, i) => {
                  const st = statusBadge(s.profile?.appliedJobs);
                  const score = avgScore(s.profile?.skillScores);
                  return (
                    <tr key={i} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(s)}>
                      <td className="px-5 py-3 font-medium text-gray-800 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {s.user?.name?.[0] || 'S'}
                        </div>
                        {s.user?.name}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{s.profile?.branch || '—'}</td>
                      <td className="px-5 py-3 text-gray-600">{s.profile?.cgpa || '—'}</td>
                      <td className="px-5 py-3">
                        {score > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
                            </div>
                            <span className="text-xs text-gray-600">{score}%</span>
                          </div>
                        ) : <span className="text-gray-400 text-xs">N/A</span>}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{s.profile?.appliedJobs?.length || 0}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
                  {selected.user?.name?.[0] || 'S'}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{selected.user?.name}</h2>
                  <p className="text-xs text-gray-500">{selected.user?.email}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><FiX size={22} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Branch</p><p className="font-medium text-gray-700">{selected.profile?.branch || '—'}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Degree</p><p className="font-medium text-gray-700">{selected.profile?.degree || '—'}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">CGPA</p><p className="font-medium text-gray-700">{selected.profile?.cgpa || '—'}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Year</p><p className="font-medium text-gray-700">{selected.profile?.yearOfStudy || '—'}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Applications</p><p className="font-medium text-gray-700">{selected.profile?.appliedJobs?.length || 0}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400">Skills</p><p className="font-medium text-gray-700">{selected.profile?.skills?.length || 0}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
