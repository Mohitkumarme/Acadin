import React, { useEffect, useState } from 'react';
import { FiUsers, FiTrendingUp, FiBarChart2, FiAward } from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { institutionAPI } from '../../api/services';
import StatCard from '../../components/shared/StatCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const PIE_COLORS = ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'];

const SAMPLE_TREND = [
  { month: 'Jan', placements: 12 },
  { month: 'Feb', placements: 19 },
  { month: 'Mar', placements: 15 },
  { month: 'Apr', placements: 28 },
  { month: 'May', placements: 35 },
  { month: 'Jun', placements: 42 },
];

const SAMPLE_DEPT = [
  { dept: 'CSE', students: 120, placed: 108, rate: 90 },
  { dept: 'IT',  students: 90,  placed: 81,  rate: 90 },
  { dept: 'ECE', students: 100, placed: 82,  rate: 82 },
  { dept: 'ME',  students: 80,  placed: 56,  rate: 70 },
  { dept: 'CE',  students: 70,  placed: 42,  rate: 60 },
];

export default function InstitutionDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    institutionAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const totalStudents = data?.totalStudents ?? 390;
  const avgSkillScore = data?.avgSkillScore ?? 68;
  const placementRate = data?.placementRate ?? 82;
  const totalSelected = data?.totalSelected ?? 0;

  const skillDist = data?.skillDistribution?.slice(0, 5).map((s, i) => ({
    name: s.skill,
    value: s.count,
  })) || [
    { name: 'Python', value: 95 },
    { name: 'React', value: 72 },
    { name: 'Java', value: 68 },
    { name: 'SQL', value: 85 },
    { name: 'Node.js', value: 54 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Institution Dashboard</h1>
        <p className="text-orange-100 mt-1">Track student placements, skill trends, and analytics.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={totalStudents} icon={FiUsers} color="indigo" />
        <StatCard title="Avg Skill Score" value={`${avgSkillScore}%`} icon={FiBarChart2} color="purple" />
        <StatCard title="Placement Rate" value={`${placementRate}%`} icon={FiTrendingUp} color="green" />
        <StatCard title="Students Placed" value={totalSelected} icon={FiAward} color="orange" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Placement Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Monthly Placement Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={SAMPLE_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="placements" stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Distribution Pie */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Top Skills Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={skillDist} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {skillDist.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Department-wise Placement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Department</th>
                <th className="px-5 py-3 text-left">Students</th>
                <th className="px-5 py-3 text-left">Placed</th>
                <th className="px-5 py-3 text-left">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {SAMPLE_DEPT.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{d.dept}</td>
                  <td className="px-5 py-3 text-gray-600">{d.students}</td>
                  <td className="px-5 py-3 text-gray-600">{d.placed}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${d.rate}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{d.rate}%</span>
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
