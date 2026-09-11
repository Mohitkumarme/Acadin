import React, { useEffect, useState } from 'react';
import { FiSearch, FiTrendingUp, FiUsers, FiAward, FiActivity } from 'react-icons/fi';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { institutionAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const SAMPLE_COMPANY = [
  { company: 'TechCorp', totalApplications: 45, shortlisted: 20, selected: 18 },
  { company: 'InfoSys',  totalApplications: 38, shortlisted: 16, selected: 14 },
  { company: 'Wipro',    totalApplications: 30, shortlisted: 14, selected: 12 },
  { company: 'Accenture',totalApplications: 28, shortlisted: 12, selected: 10 },
  { company: 'Cognizant',totalApplications: 20, shortlisted: 10, selected: 8  },
];
const SAMPLE_MONTHLY = [
  { month: 'Jan', applied: 20, selected: 8 },
  { month: 'Feb', applied: 35, selected: 12 },
  { month: 'Mar', applied: 28, selected: 10 },
  { month: 'Apr', applied: 50, selected: 22 },
  { month: 'May', applied: 62, selected: 28 },
  { month: 'Jun', applied: 45, selected: 18 },
];

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-2 border border-white/10 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function PlacementAnalytics() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = () => {
    institutionAPI.getPlacementAnalytics()
      .then(res => { setData(res.data); setLastUpdated(new Date()); })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  const isLive       = data?.companyAnalytics?.length > 0;
  const companyData  = isLive ? data.companyAnalytics : SAMPLE_COMPANY;
  const monthlyData  = data?.monthlyAnalytics?.length > 0 ? data.monthlyAnalytics : SAMPLE_MONTHLY;

  const totalApplications = companyData.reduce((a, b) => a + (b.totalApplications || b.applications || 0), 0);
  const totalSelected     = companyData.reduce((a, b) => a + (b.selected || 0), 0);
  const placementRate     = totalApplications > 0 ? Math.round((totalSelected / totalApplications) * 100) : 0;

  const filteredCompanies = companyData.filter(c =>
    !search || c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Applications', value: totalApplications, color: 'from-indigo-500 to-blue-500' },
    { label: 'Total Placements',   value: totalSelected,     color: 'from-emerald-500 to-teal-500' },
    { label: 'Placement Rate',     value: `${placementRate}%`, color: 'from-purple-500 to-violet-500' },
    { label: 'Companies Visited',  value: companyData.length,  color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Placement Analytics</h1>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-600 flex items-center gap-1.5">
              <FiActivity size={10} /> {isLive ? 'Live data' : 'Sample data'} · {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchData} className="text-xs bg-white/[0.04] border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition">Refresh</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5 border border-white/[0.06]">
            <div className={`w-2 h-6 rounded-full bg-gradient-to-b ${color} mb-3`} />
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Company-wise bar chart */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiAward className="text-indigo-400" size={15} /> Company-wise Recruitment
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={companyData.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="company" tick={{ fontSize: 11, fill: '#9ca3af' }} width={70} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
              <Bar dataKey="selected" name="Selected" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly trend */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-emerald-400" size={15} /> Monthly Application Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
              <Line type="monotone" dataKey="applied"  name="Applied"  stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }} />
              <Line type="monotone" dataKey="selected" name="Selected" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Company Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between gap-4">
          <h2 className="font-semibold text-white">Company Details</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company..."
              className="pl-9 pr-4 py-2 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/40 transition w-48" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                {['Company', 'Applications', 'Shortlisted', 'Selected', 'Success Rate'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredCompanies.map((c, i) => {
                const apps = c.totalApplications || c.applications || 0;
                const sel  = c.selected || 0;
                const rate = apps > 0 ? Math.round((sel / apps) * 100) : 0;
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-3.5 font-medium text-gray-200">{c.company}</td>
                    <td className="px-5 py-3.5 text-gray-500">{apps}</td>
                    <td className="px-5 py-3.5 text-gray-500">{c.shortlisted || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500">{sel}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        rate >= 40
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>{rate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
