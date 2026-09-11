import React, { useEffect, useState } from 'react';
import { FiBook, FiClock, FiSearch } from 'react-icons/fi';
import { learningAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import SkillBadge from '../../components/shared/SkillBadge';

const TABS = ['All', 'Certification', 'Workshop', 'Training', 'Mentorship'];

const typeBadge = (type) => {
  const map = {
    certification: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    workshop:      'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    training:      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    mentorship:    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  };
  return map[type?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
};

const MODE_OPTIONS = ['Online', 'Offline', 'Hybrid'];

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
    const matchMode = !modeFilter || p.mode?.toLowerCase() === modeFilter.toLowerCase();
    return matchTab && matchSearch && matchMode;
  });

  if (loading) return <LoadingSpinner text="Loading programs..." />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-white">Learning Programs</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-indigo-500 text-white shadow-glow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="w-full pl-9 pr-4 py-2.5 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />
        </div>
        <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setModeFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${!modeFilter ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'}`}
          >
            All
          </button>
          {MODE_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => setModeFilter(modeFilter === m.toLowerCase() ? '' : m.toLowerCase())}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${modeFilter === m.toLowerCase() ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.05]'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <FiBook className="text-4xl mx-auto mb-3 opacity-40" />
          <p>No programs found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div
              key={p._id || i}
              className="glass-card rounded-2xl p-5 flex flex-col gap-3 hover:glass-card-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-white text-sm leading-tight">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{p.companyName || p.organizer}</p>
                </div>
                <span className={`flex-shrink-0 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${typeBadge(p.type)}`}>
                  {p.type}
                </span>
              </div>

              {p.description && (
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{p.description}</p>
              )}

              {p.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map((s, si) => <SkillBadge key={si} skill={s} />)}
                  {p.skills.length > 3 && (
                    <span className="text-xs bg-white/[0.05] text-gray-400 px-2 py-0.5 rounded-full border border-white/[0.06]">
                      +{p.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/[0.06] pt-3 mt-auto">
                <span className="flex items-center gap-1"><FiClock /> {p.duration || '—'}</span>
                <span className={`font-semibold ${p.fee === 0 || !p.fee ? 'text-emerald-400' : 'text-gray-300'}`}>
                  {p.fee === 0 || !p.fee ? 'Free' : `₹${p.fee}`}
                </span>
              </div>

              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm py-2.5 rounded-xl hover:shadow-glow-md transition font-semibold">
                Register Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
