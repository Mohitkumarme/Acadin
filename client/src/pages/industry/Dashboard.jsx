import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiBriefcase, FiUsers, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { industryAPI } from '../../api/services';
import StatCard from '../../components/shared/StatCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function IndustryDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    industryAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  // Backend returns: totalJobsPosted, totalApplications, totalShortlisted, totalSelected
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Industry Dashboard</h1>
          <p className="text-purple-100 mt-1">Manage your job postings, track applications, and find top talent.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/industry/post-job" className="bg-white text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2">
            <FiPlusCircle /> Post Job
          </Link>
          <Link to="/industry/applicants" className="bg-purple-800 text-white border border-purple-500 px-4 py-2 rounded-lg font-medium hover:bg-purple-900 transition flex items-center gap-2">
            <FiUsers /> View Applicants
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Jobs Posted"        value={jobsPosted}        icon={FiBriefcase}   color="purple" />
        <StatCard title="Total Applications" value={totalApplications} icon={FiUsers}        color="blue"   />
        <StatCard title="Shortlisted"        value={shortlisted}       icon={FiCheckCircle} color="yellow" />
        <StatCard title="Selected"           value={selected}          icon={FiCheckCircle} color="green"  />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Application Funnel</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Job Postings</h2>
            <Link to="/industry/applicants" className="text-xs text-primary hover:underline flex items-center gap-1">
              View applicants <FiArrowRight />
            </Link>
          </div>
          {recentJobs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-sm mb-3">No jobs posted yet.</p>
              <Link to="/industry/post-job" className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition inline-flex items-center gap-1">
                <FiPlusCircle /> Post your first job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">Title</th>
                    <th className="px-5 py-3 text-left">Type</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentJobs.map((job, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{job.title}</td>
                      <td className="px-5 py-3 text-gray-600 capitalize">{job.type}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize">{job.status || 'active'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
