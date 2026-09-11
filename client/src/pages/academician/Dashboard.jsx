import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiAward, FiCheckCircle, FiClock, FiArrowRight,
  FiBook, FiUsers, FiAlertTriangle
} from 'react-icons/fi';
import { academicianAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const statusConfig = {
  applied:     { label: 'Applied',     cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  approved:    { label: 'Approved',    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  selected:    { label: 'Selected',    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  pending:     { label: 'Pending',     cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  rejected:    { label: 'Rejected',    cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function AcademicianDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      academicianAPI.getDashboard().catch(() => ({ data: null })),
      academicianAPI.getProfile().catch(() => ({ data: null })),
    ]).then(([dashRes, profileRes]) => {
      setData(dashRes.data);
      setProfileComplete(profileRes.data?.profileComplete ?? false);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const stats = data?.stats || {};
  const recentApps = data?.recentApplications || [];
  const upcoming = data?.upcomingPrograms || [];

  const statCards = [
    { label: 'Applied FDPs',      value: stats.totalApplied ?? 0,      icon: FiBook,        color: 'from-emerald-500 to-teal-500' },
    { label: 'Approved',          value: stats.approved ?? 0,           icon: FiCheckCircle, color: 'from-blue-500 to-indigo-500' },
    { label: 'Pending',           value: stats.pending ?? 0,            icon: FiClock,       color: 'from-amber-500 to-yellow-500' },
    { label: 'Research Projects', value: stats.researchProjects ?? 0,   icon: FiAward,       color: 'from-purple-500 to-violet-500' },
  ];

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
              <p className="text-sm font-semibold text-amber-400">Complete your profile</p>
              <p className="text-xs text-amber-400/70 mt-0.5">Add your institution, department, and college email to unlock full access.</p>
            </div>
          </div>
          <Link
            to="/academician/opportunities"
            className="flex-shrink-0 text-xs bg-amber-500 text-dark px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition"
          >
            Set Up Profile
          </Link>
        </motion.div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-700 p-6">
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        <div className="relative flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {user?.name?.split(' ')[0]}! 🎓
            </h1>
            <p className="text-emerald-100 text-sm mt-1">
              Explore FDPs, research collaborations, and industry workshops.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/academician/opportunities" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition">
              <FiBook /> Explore FDPs
            </Link>
            <Link to="/academician/research" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 font-semibold transition">
              <FiUsers /> Research Opportunities
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
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
        {/* Recent Applications */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Applications</h2>
            <Link to="/academician/opportunities" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition">
              View all <FiArrowRight size={11} />
            </Link>
          </div>
          {recentApps.length === 0 ? (
            <div className="p-8 text-center text-sm">
              <p className="text-gray-500 mb-2">No applications yet.</p>
              <Link to="/academician/opportunities" className="text-emerald-400 hover:text-emerald-300 transition">Browse FDPs →</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentApps.map((app, i) => {
                const cfg = statusConfig[app.status] || statusConfig.applied;
                return (
                  <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition">
                    <div>
                      <p className="text-sm font-medium text-gray-200">{app.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 capitalize">{app.type}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${cfg.cls}`}>{app.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Programs */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white">Upcoming Programs</h2>
            <Link to="/academician/opportunities" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition">
              See all <FiArrowRight size={11} />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No upcoming programs.</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {upcoming.map((p, i) => (
                <div key={i} className="px-5 py-3.5 hover:bg-white/[0.02] transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-200">{p.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 capitalize">{p.companyName} · {p.mode}</p>
                    </div>
                    <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-semibold capitalize flex-shrink-0">{p.type}</span>
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
