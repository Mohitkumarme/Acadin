import React, { useEffect, useState } from 'react';
import { FiList, FiGrid, FiSearch } from 'react-icons/fi';
import { studentAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const STATUS_COLUMNS = ['applied', 'shortlisted', 'selected', 'rejected'];
const STATUS_STYLES = {
  applied:     { badge: 'bg-blue-100 text-blue-700',    kanban: 'border-blue-300 bg-blue-50' },
  shortlisted: { badge: 'bg-yellow-100 text-yellow-700', kanban: 'border-yellow-300 bg-yellow-50' },
  selected:    { badge: 'bg-green-100 text-green-700',   kanban: 'border-green-300 bg-green-50' },
  rejected:    { badge: 'bg-red-100 text-red-700',       kanban: 'border-red-300 bg-red-50' },
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table'); // 'table' | 'kanban'
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
        <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('table')} className={`p-2 rounded-lg border transition ${view === 'table' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}><FiList /></button>
          <button onClick={() => setView('kanban')} className={`p-2 rounded-lg border transition ${view === 'kanban' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary'}`}><FiGrid /></button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Statuses</option>
          {STATUS_COLUMNS.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">No applications found.</div>
      )}

      {/* Table View */}
      {view === 'table' && filtered.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Company</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Applied Date</th>
                  <th className="px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-800">{a.companyName}</td>
                    <td className="px-5 py-3 text-gray-600">{a.role}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{a.type || '—'}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{a.appliedDate ? new Date(a.appliedDate).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[a.status]?.badge || 'bg-gray-100 text-gray-600'}`}>
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
              <div key={status} className={`rounded-xl border-2 ${STATUS_STYLES[status]?.kanban || 'border-gray-200 bg-gray-50'} p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 capitalize">{status}</h3>
                  <span className="text-xs bg-white border border-gray-200 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center font-medium">
                    {colApps.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colApps.map((a, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                      <p className="text-xs font-semibold text-gray-800">{a.companyName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.role}</p>
                      {a.appliedDate && <p className="text-xs text-gray-400 mt-1">{new Date(a.appliedDate).toLocaleDateString()}</p>}
                    </div>
                  ))}
                  {colApps.length === 0 && <p className="text-xs text-center text-gray-400 py-4">None</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
