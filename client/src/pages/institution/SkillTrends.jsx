import React, { useEffect, useState } from 'react';
import { FiBarChart2, FiTrendingUp, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { institutionAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const PIE_COLORS   = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
const BAR_GRADIENT = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#ec4899', '#f97316', '#14b8a6'];

const SAMPLE_TRENDS = [
  { skill: 'Python', demand: 95 }, { skill: 'React', demand: 82 },
  { skill: 'SQL', demand: 78 },   { skill: 'Java', demand: 74 },
  { skill: 'Machine Learning', demand: 68 }, { skill: 'Node.js', demand: 62 },
  { skill: 'Data Science', demand: 58 },     { skill: 'Docker', demand: 45 },
  { skill: 'AWS', demand: 40 },              { skill: 'TypeScript', demand: 38 },
];
const SAMPLE_CATEGORY = [
  { name: 'Programming', value: 40 }, { name: 'Data Science', value: 25 },
  { name: 'Soft Skills', value: 15 }, { name: 'Management', value: 12 },
  { name: 'Design', value: 8 },
];
const SAMPLE_COMPARE = [
  { category: 'Programming', demand: 90, students: 72 },
  { category: 'Data Science', demand: 75, students: 45 },
  { category: 'Soft Skills', demand: 60, students: 55 },
  { category: 'Management', demand: 45, students: 30 },
  { category: 'Design', demand: 35, students: 20 },
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

const CustomBar = (props) => {
  const { x, y, width, height, index } = props;
  const fill = BAR_GRADIENT[index % BAR_GRADIENT.length];
  return <rect x={x} y={y} width={width} height={height} rx={3} fill={fill} fillOpacity={0.85} />;
};

export default function SkillTrends() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = () => {
    institutionAPI.getSkillTrends()
      .then(res => { setData(res.data); setLastUpdated(new Date()); })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner text="Loading skill trends..." />;

  const isLive = data?.trends?.length > 0;
  const trends = isLive
    ? data.trends.slice(0, 10).map(t => ({ skill: t.skill, demand: t.count }))
    : SAMPLE_TRENDS;

  // Max demand for percentage bar
  const maxDemand = trends[0]?.demand || 1;

  const gapData = SAMPLE_COMPARE.map(row => ({ ...row, gap: Math.max(0, row.demand - row.students) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Skill Demand Trends</h1>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-600 flex items-center gap-1.5">
              <FiActivity size={10} /> {isLive ? 'Live from job postings' : 'Sample data'} · {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchData} className="text-xs bg-white/[0.04] border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition">Refresh</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top In-Demand Skills — Colorful Horizontal Bar */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-indigo-400" size={15} /> Top In-Demand Skills
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: '#9ca3af' }} width={90} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="demand" name="Industry Demand" radius={[0, 4, 4, 0]} barSize={12} shape={<CustomBar />} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-purple-400" size={15} /> Skill Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={SAMPLE_CATEGORY} cx="50%" cy="50%" outerRadius={85} innerRadius={40} dataKey="value" nameKey="name">
                {SAMPLE_CATEGORY.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            {SAMPLE_CATEGORY.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top skills ranked list */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
        <h2 className="font-semibold text-white mb-4">📊 Skill Demand Rankings</h2>
        <div className="space-y-3">
          {trends.map((t, i) => {
            const pct = Math.round((t.demand / maxDemand) * 100);
            const color = BAR_GRADIENT[i % BAR_GRADIENT.length];
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-4 text-right flex-shrink-0">{i + 1}</span>
                <span className="text-xs text-gray-300 w-28 flex-shrink-0 truncate capitalize">{t.skill}</span>
                <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="text-xs font-semibold text-gray-400 w-8 text-right flex-shrink-0">{t.demand}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demand vs Students — Grouped Bar */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
        <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
          <FiAlertTriangle className="text-amber-400" size={15} /> Industry Demand vs Student Proficiency
        </h2>
        <p className="text-xs text-gray-600 mb-4">Identify gaps to prioritize skill development</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={SAMPLE_COMPARE} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
            <Bar dataKey="demand"   name="Industry Demand %"     fill="#6366f1" radius={[4, 4, 0, 0]} barSize={18} />
            <Bar dataKey="students" name="Student Proficiency %"  fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Gap Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white">Skill Gap Analysis</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white/[0.02] border-b border-white/[0.06]">
            <tr>
              {['Skill Category', 'Industry Demand', 'Student Proficiency', 'Gap'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {gapData.map((row, i) => {
              const gapVal = row.gap;
              const gapCls = gapVal > 20
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : gapVal > 10
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              return (
                <tr key={i} className="hover:bg-white/[0.02] transition">
                  <td className="px-5 py-3.5 font-medium text-gray-200">{row.category}</td>
                  <td className="px-5 py-3.5 text-gray-500">{row.demand}%</td>
                  <td className="px-5 py-3.5 text-gray-500">{row.students}%</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${gapCls}`}>
                      {gapVal > 0 ? `+${gapVal}% gap` : 'On Track'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
