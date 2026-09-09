import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiCheckCircle, FiClock, FiArrowRight, FiBook, FiUsers } from 'react-icons/fi';
import { academicianAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/shared/StatCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const statusColors = {
  applied:  'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AcademicianDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    academicianAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setData({ stats: {}, recentApplications: [], upcomingPrograms: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const stats = data?.stats || {};
  const recentApps = data?.recentApplications || [];
  const upcoming = data?.upcomingPrograms || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 🎓</h1>
        <p className="text-green-100 text-sm mt-1">Explore FDPs, research collaborations, and industry workshops.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link to="/academician/opportunities" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition">
            <FiBook /> Explore FDPs
          </Link>
          <Link to="/academician/research" className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition">
            <FiUsers /> Research Opportunities
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Applied FDPs" value={stats.totalApplied ?? 0} icon={FiBook} color="green" />
        <StatCard title="Approved" value={stats.approved ?? 0} icon={FiCheckCircle} color="indigo" />
        <StatCard title="Pending" value={stats.pending ?? 0} icon={FiClock} color="yellow" />
        <StatCard title="Research Projects" value={stats.researchProjects ?? 0} icon={FiAward} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Applications</h2>
            <Link to="/academician/opportunities" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>
          {recentApps.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No applications yet. <Link to="/academician/opportunities" className="text-primary hover:underline">Browse FDPs →</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.map((app, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{app.title}</p>
                    <p className="text-xs text-gray-500">{app.organizer}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[app.status] || 'bg-gray-100 text-gray-600'}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Programs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Upcoming Programs</h2>
            <Link to="/academician/opportunities" className="text-xs text-primary hover:underline flex items-center gap-1">
              See all <FiArrowRight />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No upcoming programs.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcoming.map((p, i) => (
                <div key={i} className="px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.companyName} · {p.mode}</p>
                    </div>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full capitalize">{p.type}</span>
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
