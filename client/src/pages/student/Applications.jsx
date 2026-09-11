import React, { useEffect, useState } from 'react';
import { FiList, FiGrid, FiSearch } from 'react-icons/fi';
import { studentAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const STATUS_COLUMNS = ['applied', 'shortlisted', 'selected', 'rejected'];

const STATUS_STYLES = {
  applied:     { badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',    kanban: 'border-blue-500/20 bg-blue-500/5' },
  shortlisted: { badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',  kanban: 'border-amber-500/20 bg-amber-500/5' },
  selected:    { badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', kanban: 'border-emerald-500/20 bg-emerald-500/5' },
  rejected:    { badge: 'bg-red-500/10 text-red-400 border border-red-500/20',        kanban: 'border-red-500/20 bg-red-500/5' },
};

const STATUS_HEADER = {
  applied:     'text-blue-400',
  shortlisted: 'text-amber-400',
  selected:    'text-emerald-400',
  rejected:    'text-red-400',
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    studentAPI.getApplications()
      .then((res) => setApps(res.data?.applications || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = apps.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !search || a.companyName?.toLowerCase().includes(q) || a.role?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <LoadingSpinner text="Loading applications..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">My Applications</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-lg border transition ${view === 'table' ? 'bg-indigo-500 text-white border-indigo-500 shadow-glow-sm' : 'border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-gray-200'}`}
          >
            <FiList />
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`p-2 rounded-lg border transition ${view === 'kanban' ? 'bg-indigo-500 text-white border-indigo-500 shadow-glow-sm' : 'border-white/10 text-gray-400 hover:border-indigo-500/40 hover:text-gray-200'}`}
          >
            <FiGrid />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-9 pr-4 py-2.5 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
        >
          <option value="">All Statuses</option>
          {STATUS_COLUMNS.map((s) => (
            <option key={s} value={s} className="capitalize bg-dark-50">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500 text-sm">No applications found.</div>
      )}

      {/* Table View */}
      {view === 'table' && filtered.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.02] text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Applied Date</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((a, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-3 font-medium text-gray-200">{a.companyName}</td>
                    <td className="px-5 py-3 text-gray-400">{a.role}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-white/[0.05] text-gray-400 px-2 py-0.5 rounded-full capitalize border border-white/[0.06]">
                        {a.type || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {a.appliedDate ? new Date(a.appliedDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[a.status]?.badge || 'bg-gray-500/10 text-gray-400'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map((status) => {
            const colApps = filtered.filter((a) => a.status === status);
            return (
              <div key={status} className={`glass-card rounded-2xl border ${STATUS_STYLES[status]?.kanban || 'border-white/[0.06]'} p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold capitalize ${STATUS_HEADER[status] || 'text-gray-400'}`}>{status}</h3>
                  <span className="text-xs bg-white/[0.05] border border-white/[0.08] text-gray-400 w-6 h-6 rounded-full flex items-center justify-center font-medium">
                    {colApps.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colApps.map((a, i) => (
                    <div key={i} className="glass rounded-xl p-3">
                      <p className="text-xs font-semibold text-gray-200">{a.companyName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.role}</p>
                      {a.appliedDate && (
                        <p className="text-xs text-gray-600 mt-1">{new Date(a.appliedDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                  {colApps.length === 0 && (
                    <p className="text-xs text-center text-gray-600 py-4">None</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
