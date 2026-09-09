import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText, FiCheckCircle, FiZap, FiUser,
  FiArrowRight, FiBriefcase, FiBook
} from 'react-icons/fi';
import { studentAPI, jobAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/shared/StatCard';
import JobCard from '../../components/shared/JobCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const statusColors = {
  applied:     'bg-blue-100 text-blue-700',
  shortlisted: 'bg-yellow-100 text-yellow-700',
  selected:    'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([studentAPI.getDashboard(), jobAPI.getRecommended()])
      .then(([dashRes, jobRes]) => {
        setData(dashRes.data);
        setJobs(jobRes.data?.jobs || jobRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const stats = data?.stats || {};
  const applications = data?.recentApplications || [];
  const skillScores = data?.skillScores || [];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <h1 className="text-xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-indigo-200 text-sm mt-1">Here's an overview of your Acadin activity.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link to="/student/skill-assessment" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition">
            <FiZap /> Take Skill Test
          </Link>
          <Link to="/student/internships" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition">
            <FiBriefcase /> Browse Jobs
          </Link>
          <Link to="/student/portfolio" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition">
            <FiUser /> Update Portfolio
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={stats.totalApplications ?? 0} icon={FiFileText} color="indigo" />
        <StatCard title="Shortlisted" value={stats.shortlisted ?? 0} icon={FiCheckCircle} color="green" />
        <StatCard title="Skill Score" value={stats.skillScore ? `${stats.skillScore}%` : '—'} icon={FiZap} color="purple" />
        <StatCard title="Profile Complete" value={stats.profileCompleteness ? `${stats.profileCompleteness}%` : '—'} icon={FiUser} color="blue" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Applications</h2>
            <Link to="/student/applications" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>
          {applications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No applications yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3 text-left">Company</th>
                    <th className="px-5 py-3 text-left">Role</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.slice(0, 5).map((app, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 font-medium text-gray-800">{app.companyName}</td>
                      <td className="px-5 py-3 text-gray-600">{app.role}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Skill progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Skill Progress</h2>
            <Link to="/student/skill-profile" className="text-xs text-primary hover:underline flex items-center gap-1">
              Full profile <FiArrowRight />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {skillScores.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-4">
                Take the skill assessment to see your scores.
                <br />
                <Link to="/student/skill-assessment" className="text-primary hover:underline mt-2 inline-block">Start Assessment →</Link>
              </div>
            ) : (
              skillScores.map((s) => (
                <div key={s.category}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium capitalize">{s.category}</span>
                    <span>{s.score}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommended jobs */}
      {jobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recommended For You</h2>
            <Link to="/student/internships" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.slice(0, 3).map((job, i) => (
              <JobCard key={job._id || i} job={job} matchScore={job.matchScore} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
