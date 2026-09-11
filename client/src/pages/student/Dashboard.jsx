import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  applied:     'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  shortlisted: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  selected:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  rejected:    'bg-red-500/10 text-red-400 border border-red-500/20',
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

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
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Banner */}
      <motion.div variants={fadeUp} className="relative glass-card rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
        <div className="relative">
          <h1 className="text-xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Here's an overview of your Acadin activity.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/student/skill-assessment" className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all border border-indigo-500/20 hover:border-indigo-500/30">
              <FiZap /> Take Skill Test
            </Link>
            <Link to="/student/internships" className="bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all border border-purple-500/20 hover:border-purple-500/30">
              <FiBriefcase /> Browse Jobs
            </Link>
            <Link to="/student/portfolio" className="bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all border border-cyan-500/20 hover:border-cyan-500/30">
              <FiUser /> Update Portfolio
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={stats.totalApplications ?? 0} icon={FiFileText} color="indigo" />
        <StatCard title="Shortlisted" value={stats.shortlisted ?? 0} icon={FiCheckCircle} color="green" />
        <StatCard title="Skill Score" value={stats.skillScore ? `${stats.skillScore}%` : '—'} icon={FiZap} color="purple" />
        <StatCard title="Profile Complete" value={stats.profileCompleteness ? `${stats.profileCompleteness}%` : '—'} icon={FiUser} color="cyan" />
      </motion.div>

      <motion.div variants={fadeUp} className="grid lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Applications</h2>
            <Link to="/student/applications" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <FiArrowRight />
            </Link>
          </div>
          {applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No applications yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.02] text-xs text-gray-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3 text-left">Company</th>
                    <th className="px-5 py-3 text-left">Role</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {applications.slice(0, 5).map((app, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition">
                      <td className="px-5 py-3 font-medium text-gray-200">{app.companyName}</td>
                      <td className="px-5 py-3 text-gray-400">{app.role}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[app.status] || 'bg-gray-500/10 text-gray-400'}`}>
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
        <div className="glass-card rounded-2xl">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white">Skill Progress</h2>
            <Link to="/student/skill-profile" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Full profile <FiArrowRight />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {skillScores.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-4">
                Take the skill assessment to see your scores.
                <br />
                <Link to="/student/skill-assessment" className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block transition-colors">Start Assessment →</Link>
              </div>
            ) : (
              skillScores.map((s) => (
                <div key={s.category}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span className="font-medium capitalize">{s.category}</span>
                    <span className="text-indigo-400 font-semibold">{s.score}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Recommended jobs */}
      {jobs.length > 0 && (
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recommended For You</h2>
            <Link to="/student/internships" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <FiArrowRight />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.slice(0, 3).map((job, i) => (
              <JobCard key={job._id || i} job={job} matchScore={job.matchScore} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
