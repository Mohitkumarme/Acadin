import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiArrowRight } from 'react-icons/fi';
import { academicianAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const TYPES = ['All', 'Research', 'Guest Lecture', 'Consultancy', 'Innovation Challenge'];

const typeBadge = (type) => {
  const map = {
    research:            'bg-blue-100 text-blue-700',
    'guest-lecture':     'bg-purple-100 text-purple-700',
    consultancy:         'bg-orange-100 text-orange-700',
    'innovation-challenge': 'bg-red-100 text-red-700',
    mentorship:          'bg-green-100 text-green-700',
  };
  return map[type?.toLowerCase()] || 'bg-gray-100 text-gray-600';
};

export default function Research() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    academicianAPI.getResearch()
      .then(res => setItems(res.data?.collaborations || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(item => {
    const matchTab = activeTab === 'All' || item.type?.toLowerCase().includes(activeTab.toLowerCase().replace(' ', '-'));
    const q = search.toLowerCase();
    const matchSearch = !search || item.title?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  if (loading) return <LoadingSpinner text="Loading research opportunities..." />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Research & Collaborations</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TYPES.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search collaborations..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No collaborations found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <div key={item._id || i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-800 text-sm leading-tight">{item.title}</h3>
                <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeBadge(item.type)}`}>
                  {item.type?.replace('-', ' ')}
                </span>
              </div>

              {item.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{item.description}</p>}

              {item.requiredExpertise?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.requiredExpertise.slice(0, 3).map((exp, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{exp}</span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-auto">
                {item.duration && <span>Duration: {item.duration}</span>}
                {item.compensation && <span>· {item.compensation}</span>}
              </div>

              {item.applicationDeadline && (
                <p className="text-xs text-red-500">Deadline: {new Date(item.applicationDeadline).toLocaleDateString()}</p>
              )}

              <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition flex items-center justify-center gap-1">
                Apply <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
