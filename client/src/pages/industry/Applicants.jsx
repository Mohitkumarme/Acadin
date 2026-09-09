import React, { useEffect, useState } from 'react';
import { FiSearch, FiUser } from 'react-icons/fi';
import { industryAPI, jobAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    industryAPI.getApplicants()
      .then(res => setApplicants(res.data?.applicants || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (jobId, studentId, status) => {
    try {
      await jobAPI.updateApplicantStatus(jobId, studentId, { status });
      setApplicants(applicants.map(a => 
        a.jobId === jobId && a.student._id === studentId ? { ...a, status } : a
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = applicants.filter(a => 
    !search || a.student?.name?.toLowerCase().includes(search.toLowerCase()) || a.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading applicants..." />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Manage Applicants</h1>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or job title..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No applicants found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Applicant</th>
                <th className="px-5 py-3 text-left">Job Applied For</th>
                <th className="px-5 py-3 text-left">Applied Date</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"><FiUser /></div>
                    {a.student?.name || 'Unknown'}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{a.jobTitle}</td>
                  <td className="px-5 py-3 text-gray-500">{new Date(a.appliedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <select 
                      value={a.status} 
                      onChange={(e) => handleStatusChange(a.jobId, a.student._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border outline-none font-medium capitalize ${
                        a.status === 'selected' ? 'bg-green-50 text-green-700 border-green-200' :
                          a.status === 'shortlisted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          a.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
