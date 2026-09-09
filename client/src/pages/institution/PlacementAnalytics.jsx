import React, { useEffect, useState } from 'react';
import { FiSearch, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { institutionAPI } from '../../api/services';
import StatCard from '../../components/shared/StatCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const SAMPLE_COMPANY = [
  { company: 'TechCorp', applications: 45, selected: 18 },
  { company: 'InfoSys', applications: 38, selected: 14 },
  { company: 'Wipro', applications: 30, selected: 12 },
  { company: 'Accenture', applications: 28, selected: 10 },
  { company: 'Cognizant', applications: 20, selected: 8 },
];

const SAMPLE_MONTHLY = [
  { month: 'Jan', applied: 20, selected: 8 },
  { month: 'Feb', applied: 35, selected: 12 },
  { month: 'Mar', applied: 28, selected: 10 },
  { month: 'Apr', applied: 50, selected: 22 },
  { month: 'May', applied: 62, selected: 28 },
  { month: 'Jun', applied: 45, selected: 18 },
];

export default function PlacementAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    institutionAPI.getPlacementAnalytics()
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  const companyData = data?.companyAnalytics?.length > 0 ? data.companyAnalytics : SAMPLE_COMPANY;
  const monthlyData = data?.monthlyAnalytics?.length > 0 ? data.monthlyAnalytics : SAMPLE_MONTHLY;

  const totalApplications = companyData.reduce((a, b) => a + (b.totalApplications || b.applications || 0), 0);
  const totalSelected = companyData.reduce((a, b) => a + (b.selected || 0), 0);
  const placementRate = totalApplications > 0 ? Math.round((totalSelected / totalApplications) * 100) : 0;

  const filteredCompanies = companyData.filter(c =>
    !search || c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Placement Analytics</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={totalApplications} icon={FiUsers} color="indigo" />
        <StatCard title="Total Placements" value={totalSelected} icon={FiAward} color="green" />
        <StatCard title="Placement Rate" value={`${placementRate}%`} icon={FiTrendingUp} color="purple" />
        <StatCard title="Companies Visited" value={companyData.length} icon={FiUsers} color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Company-wise bar chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Company-wise Recruitment</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={companyData.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="company" tick={{ fontSize: 11 }} width={70} />
              <Tooltip />
              <Legend />
              <Bar dataKey="selected" name="Selected" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Monthly Application Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applied" name="Applied" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="selected" name="Selected" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Company Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-gray-800">Company Details</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary w-48" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Company</th>
                <th className="px-5 py-3 text-left">Applications</th>
                <th className="px-5 py-3 text-left">Shortlisted</th>
                <th className="px-5 py-3 text-left">Selected</th>
                <th className="px-5 py-3 text-left">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCompanies.map((c, i) => {
                const apps = c.totalApplications || c.applications || 0;
                const sel = c.selected || 0;
                const rate = apps > 0 ? Math.round((sel / apps) * 100) : 0;
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{c.company}</td>
                    <td className="px-5 py-3 text-gray-600">{apps}</td>
                    <td className="px-5 py-3 text-gray-600">{c.shortlisted || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{sel}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rate >= 40 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {rate}%
                      </span>
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
