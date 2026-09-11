import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiTrendingUp, FiBarChart2, FiAward, FiArrowRight, FiActivity
} from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { institutionAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
const FALLBACK_DEPT = [
  { dept: 'CSE', students: 120, placed: 108, rate: 90 },
  { dept: 'IT',  students: 90,  placed: 81,  rate: 90 },
  { dept: 'ECE', students: 100, placed: 82,  rate: 82 },
  { dept: 'ME',  students: 80,  placed: 56,  rate: 70 },
  { dept: 'CE',  students: 70,  placed: 42,  rate: 60 },
];
const FALLBACK_TREND = [
  { month: 'Jan', placements: 12 }, { month: 'Feb', placements: 19 },
  { month: 'Mar', placements: 15 }, { month: 'Apr', placements: 28 },
  { month: 'May', placements: 35 }, { month: 'Jun', placements: 42 },
];

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-2 border border-white/10 text-sm">
      <p className="text-gray-400">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function InstitutionDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = () => {
    institutionAPI.getDashboard()
      .then(res => { setData(res.data); setLastUpdated(new Date()); })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const totalStudents  = data?.totalStudents     ?? 0;
  const avgSkillScore  = data?.avgSkillScore     ?? 0;
  const placementRate  = data?.placementRate     ?? 0;
  const totalSelected  = data?.totalSelected     ?? 0;
  const avgProfile     = data?.avgProfileComplete ?? 0;
  const deptData       = data?.departmentPlacement?.length > 0 ? data.departmentPlacement : FALLBACK_DEPT;

  const skillDist = data?.skillDistribution?.slice(0, 5).map(s => ({ name: s.skill, value: s.count })) || [
    { name: 'Python', value: 95 }, { name: 'React', value: 72 },
    { name: 'Java', value: 68 },   { name: 'SQL', value: 85 },   { name: 'Node.js', value: 54 },
  ];

  const stats = [
    { label: 'Total Students',    value: totalStudents,       icon: FiUsers,      color: 'from-indigo-500 to-blue-500' },
    { label: 'Avg Skill Score',   value: `${avgSkillScore}%`, icon: FiBarChart2,  color: 'from-purple-500 to-violet-500' },
    { label: 'Placement Rate',    value: `${placementRate}%`, icon: FiTrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: 'Students Placed',   value: totalSelected,       icon: FiAward,      color: 'from-amber-500 to-orange-500' },
  ];

  const rateColor = (rate) => rate >= 70 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 p-6">
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Institution Dashboard</h1>
            <p className="text-orange-100 text-sm mt-1">Track student placements, skill trends, and analytics in real time.</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <p className="text-xs text-orange-200 flex items-center gap-1.5">
                <FiActivity size={11} /> Live · {lastUpdated.toLocaleTimeString()}
              </p>
            )}
            <button onClick={fetchData} className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition font-medium">
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5 border border-white/[0.06]">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-glow-sm`}>
              <Icon className="text-white text-lg" />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Profile Completeness Banner */}
      <div className="glass-card rounded-2xl p-4 border border-white/[0.06] flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Avg Student Profile Completion</span>
            <span className="text-sm font-bold text-white">{avgProfile}%</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${avgProfile >= 70 ? 'bg-emerald-500' : avgProfile >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${avgProfile}%` }}
            />
          </div>
        </div>
        <Link to="/institution/students" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition flex-shrink-0">
          View Students <FiArrowRight size={11} />
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Placement Trend */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><FiTrendingUp className="text-orange-400" size={16} /> Monthly Placement Trend</h2>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={FALLBACK_TREND} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <Line type="monotone" dataKey="placements" name="Placements" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Distribution Pie */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><FiBarChart2 className="text-indigo-400" size={16} /> Top Skills Distribution</h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={skillDist} cx="50%" cy="50%" outerRadius={85} innerRadius={40} dataKey="value" nameKey="name">
                {skillDist.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {skillDist.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department-wise Placement — REAL DATA */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="font-semibold text-white">Department-wise Placement</h2>
          <span className="text-xs text-gray-500">{deptData === FALLBACK_DEPT ? 'Sample data — add students to see real data' : 'Live data'}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                {['Department', 'Students', 'Placed', 'Placement Rate'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {deptData.map((d, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition">
                  <td className="px-5 py-3.5 font-medium text-gray-200">{d.dept}</td>
                  <td className="px-5 py-3.5 text-gray-500">{d.students}</td>
                  <td className="px-5 py-3.5 text-gray-500">{d.placed}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 max-w-[80px] h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${rateColor(d.rate)}`} style={{ width: `${d.rate}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-300">{d.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
