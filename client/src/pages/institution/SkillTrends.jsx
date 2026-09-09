import React, { useEffect, useState } from 'react';
import { FiBarChart2, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { institutionAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const PIE_COLORS = ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'];

const SAMPLE_TRENDS = [
  { skill: 'Python', demand: 95 },
  { skill: 'React', demand: 82 },
  { skill: 'SQL', demand: 78 },
  { skill: 'Java', demand: 74 },
  { skill: 'Machine Learning', demand: 68 },
  { skill: 'Node.js', demand: 62 },
  { skill: 'Data Science', demand: 58 },
  { skill: 'Docker', demand: 45 },
  { skill: 'AWS', demand: 40 },
  { skill: 'TypeScript', demand: 38 },
];

const SAMPLE_CATEGORY = [
  { name: 'Programming', value: 40 },
  { name: 'Data Science', value: 25 },
  { name: 'Soft Skills', value: 15 },
  { name: 'Management', value: 12 },
  { name: 'Design', value: 8 },
];

const SAMPLE_COMPARE = [
  { category: 'Programming', demand: 90, students: 72 },
  { category: 'Data Science', demand: 75, students: 45 },
  { category: 'Soft Skills', demand: 60, students: 55 },
  { category: 'Management', demand: 45, students: 30 },
  { category: 'Design', demand: 35, students: 20 },
];

export default function SkillTrends() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    institutionAPI.getSkillTrends()
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading skill trends..." />;

  const trends = data?.trends?.length > 0
    ? data.trends.slice(0, 10).map(t => ({ skill: t.skill, demand: t.count }))
    : SAMPLE_TRENDS;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Skill Demand Trends</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Skills Horizontal Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-primary" /> Top In-Demand Skills
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends} layout="vertical" margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="demand" name="Industry Demand" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-primary" /> Skill Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={SAMPLE_CATEGORY} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                {SAMPLE_CATEGORY.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demand vs Students Grouped Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiAlertTriangle className="text-amber-500" /> Industry Demand vs Student Proficiency
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={SAMPLE_COMPARE} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="demand" name="Industry Demand %" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="students" name="Student Proficiency %" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Gap Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Skill Gap Analysis</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left">Skill</th>
              <th className="px-5 py-3 text-left">Industry Demand</th>
              <th className="px-5 py-3 text-left">Student Proficiency</th>
              <th className="px-5 py-3 text-left">Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {SAMPLE_COMPARE.map((row, i) => {
              const gap = row.demand - row.students;
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{row.category}</td>
                  <td className="px-5 py-3 text-gray-600">{row.demand}%</td>
                  <td className="px-5 py-3 text-gray-600">{row.students}%</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${gap > 20 ? 'bg-red-100 text-red-700' : gap > 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {gap > 0 ? `+${gap}% gap` : 'On Track'}
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
