import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlusCircle, FiBriefcase, FiUsers, FiCheckCircle,
  FiArrowRight, FiAlertTriangle, FiExternalLink
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { industryAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-2 text-sm border border-white/10">
      <p className="text-gray-300 font-medium">{label}</p>
      <p className="text-indigo-400 font-bold">{payload[0].value}</p>
    </div>
  );
};

export default function IndustryDashboard() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      industryAPI.getDashboard().catch(() => ({ data: null })),
      industryAPI.getProfile().catch(() => ({ data: null })),
    ]).then(([dashRes, profileRes]) => {
      setData(dashRes.data);
      setProfile(profileRes.data?.profile);
      setProfileComplete(profileRes.data?.profileComplete ?? false);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const jobsPosted        = data?.totalJobsPosted    ?? 0;
  const totalApplications = data?.totalApplications  ?? 0;
  const shortlisted       = data?.totalShortlisted   ?? 0;
  const selected          = data?.totalSelected      ?? 0;
  const recentJobs        = data?.recentJobs         || [];

  const funnelData = [
    { name: 'Applied',     count: totalApplications },
    { name: 'Shortlisted', count: shortlisted },
    { name: 'Selected',    count: selected },
  ];

  const stats = [
    { label: 'Jobs Posted',   value: jobsPosted,        color: 'from-purple-500 to-violet-600',  bg: 'bg-purple-500/10', icon: FiBriefcase },
    { label: 'Applications',  value: totalApplications, color: 'from-blue-500 to-indigo-600',    bg: 'bg-blue-500/10',   icon: FiUsers },
    { label: 'Shortlisted',   value: shortlisted,       color: 'from-amber-500 to-yellow-600',  bg: 'bg-amber-500/10',  icon: FiCheckCircle },
    { label: 'Selected',      value: selected,          color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-500/10', icon: FiCheckCircle },
  ];

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closed: 'bg-red-500/10 text-red-400 border-red-500/20',
    draft:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Profile Incomplete Banner */}
      {!profileComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-amber-400 text-xl flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-400">Complete your company profile</p>
              <p className="text-xs text-amber-400/70 mt-0.5">You must fill in company details before posting jobs or internships.</p>
            </div>
          </div>
          <Link
            to="/industry/post-job"
            className="flex-shrink-0 text-xs bg-amber-500 text-dark px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition"
          >
            Set Up Profile
          </Link>
        </motion.div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-700 p-6">
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {profile?.companyName ? `Welcome, ${profile.companyName}` : 'Industry Dashboard'}
            </h1>
            <p className="text-purple-200 mt-1 text-sm">
              Manage job postings, track applications, and find top talent.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/industry/post-job"
              className="bg-white text-purple-700 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center gap-2 text-sm"
            >
              <FiPlusCircle /> Post Job
            </Link>
            <Link
              to="/industry/applicants"
              className="bg-purple-800/60 text-white border border-purple-500/30 px-4 py-2 rounded-xl font-semibold hover:bg-purple-800 transition flex items-center gap-2 text-sm"
            >
              <FiUsers /> Applicants
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="glass-card rounded-2xl p-5 border border-white/[0.06]">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-glow-sm`}>
              <Icon className="text-white text-lg" />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Funnel Chart */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.06]">
          <h2 className="font-semibold text-white mb-4">Application Funnel</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Postings</h2>
            <Link to="/industry/applicants" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition">
              All applicants <FiArrowRight size={11} />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500 text-sm mb-3">No jobs posted yet.</p>
              <Link
                to="/industry/post-job"
                className="inline-flex items-center gap-1.5 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-glow-sm transition"
              >
                <FiPlusCircle size={13} /> Post your first job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentJobs.map((job, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{job.title}</p>
                    <p className="text-xs text-gray-600 capitalize mt-0.5">{job.type}</p>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="text-xs text-gray-500">{job.applicants || 0} applied</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${statusColors[job.status] || statusColors.active}`}>
                      {job.status || 'active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
