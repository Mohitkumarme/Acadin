import React, { useEffect, useState } from 'react';
import { FiBook, FiClock, FiTag, FiSearch, FiFilter } from 'react-icons/fi';
import { learningAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import SkillBadge from '../../components/shared/SkillBadge';

const TABS = ['All', 'Certification', 'Workshop', 'Training', 'Mentorship'];

const typeBadge = (type) => {
  const map = {
    certification: 'bg-blue-100 text-blue-700',
    workshop:      'bg-purple-100 text-purple-700',
    training:      'bg-green-100 text-green-700',
    mentorship:    'bg-orange-100 text-orange-700',
  };
  return map[type?.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

export default function Learning() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  useEffect(() => {
    learningAPI.getAll({ targetAudience: 'student' })
      .then((res) => setPrograms(res.data?.programs || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter((p) => {
    const matchTab = activeTab === 'All' || p.type?.toLowerCase() === activeTab.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !search || p.title?.toLowerCase().includes(q) || p.companyName?.toLowerCase().includes(q);
    const matchMode = !modeFilter || p.mode?.toLowerCase() === modeFilter;
    return matchTab && matchSearch && matchMode;
  });

  if (loading) return <LoadingSpinner text="Loading programs..." />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Learning Programs</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search programs..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-primary">
          <option value="">All Modes</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No programs found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div key={p._id || i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{p.companyName || p.organizer}</p>
                </div>
                <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeBadge(p.type)}`}>{p.type}</span>
              </div>

              {p.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{p.description}</p>}

              {p.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map((s, si) => <SkillBadge key={si} skill={s} />)}
                  {p.skills.length > 3 && <span className="text-xs text-gray-400">+{p.skills.length - 3}</span>}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                <span className="flex items-center gap-1"><FiClock /> {p.duration || '—'}</span>
                <span className={`font-semibold ${p.fee === 0 || !p.fee ? 'text-green-600' : 'text-gray-700'}`}>
                  {p.fee === 0 || !p.fee ? 'Free' : `₹${p.fee}`}
                </span>
              </div>

              <button className="w-full bg-primary text-white text-sm py-2 rounded-lg hover:bg-primary-dark transition font-medium">
                Register Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
