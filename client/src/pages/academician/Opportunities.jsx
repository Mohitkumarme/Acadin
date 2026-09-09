import React, { useEffect, useState } from 'react';
import { FiSearch, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import { academicianAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const TABS = ['All', 'FDP', 'Workshop', 'Webinar', 'Training'];

// Mock FDPs for when DB is empty
const MOCK_PROGRAMS = [
  { _id: 'm1', title: 'Faculty Development Program on AI & ML', companyName: 'IIT Bombay', type: 'fdp',      mode: 'hybrid',  duration: '5 Days',  description: 'A comprehensive FDP covering machine learning, deep learning, and their applications in academia.', schedule: { registrationDeadline: '2025-12-31' } },
  { _id: 'm2', title: 'Workshop on IoT and Embedded Systems',   companyName: 'TechCorp',   type: 'workshop', mode: 'offline', duration: '2 Days',  description: 'Hands-on workshop on IoT protocols, Raspberry Pi, and industry use cases.' },
  { _id: 'm3', title: 'Webinar: Teaching with AI Tools',        companyName: 'NASSCOM',    type: 'webinar',  mode: 'online',  duration: '3 Hours', description: 'Learn how to integrate AI tools like ChatGPT and Copilot into your teaching workflow.' },
  { _id: 'm4', title: 'Data Science for Educators',             companyName: 'Infosys',    type: 'training', mode: 'online',  duration: '10 Days', description: 'In-depth training on Python, Pandas, and visualization for faculty members.' },
  { _id: 'm5', title: 'Industry 4.0 Awareness Program',        companyName: 'Bosch India', type: 'fdp',      mode: 'hybrid',  duration: '3 Days',  description: 'Understand how Industry 4.0 technologies are reshaping manufacturing and education.' },
  { _id: 'm6', title: 'Cloud Computing Bootcamp for Academics', companyName: 'AWS',        type: 'workshop', mode: 'online',  duration: '5 Days',  description: 'Practical bootcamp on AWS services for academic research and teaching.' },
];

const typeBadgeColor = (type) => {
  const map = {
    fdp:      'bg-blue-100 text-blue-700',
    workshop: 'bg-purple-100 text-purple-700',
    webinar:  'bg-teal-100 text-teal-700',
    training: 'bg-orange-100 text-orange-700',
  };
  return map[type?.toLowerCase()] || 'bg-gray-100 text-gray-600';
};

const modeBadge = (mode) => {
  const map = {
    online:  'bg-green-100 text-green-700',
    offline: 'bg-orange-100 text-orange-700',
    hybrid:  'bg-teal-100 text-teal-700',
  };
  return map[mode?.toLowerCase()] || 'bg-gray-100 text-gray-600';
};

export default function Opportunities() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch]     = useState('');
  const [appliedIds, setAppliedIds] = useState([]);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    academicianAPI.getOpportunities()
      .then(res => {
        // backend returns { programs: [...], opportunities: [...] }
        const data = res.data?.programs || res.data?.opportunities || res.data || [];
        setPrograms(data.length > 0 ? data : MOCK_PROGRAMS);
      })
      .catch(() => setPrograms(MOCK_PROGRAMS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter(p => {
    const matchTab = activeTab === 'All' || p.type?.toLowerCase() === activeTab.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !search || p.title?.toLowerCase().includes(q) || p.companyName?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const handleApply = async (id) => {
    setApplying(id);
    try {
      await academicianAPI.applyToOpportunity(id, { type: 'fdp' });
      setAppliedIds(prev => [...prev, id]);
    } catch (err) {
      // If it's mock data (non-mongo id), just mark as applied locally
      if (String(id).startsWith('m')) {
        setAppliedIds(prev => [...prev, id]);
      }
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading opportunities..." />;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">FDPs & Learning Opportunities</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map(tab => (
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
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or organizer..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} program{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No programs found for this filter.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const isApplied = appliedIds.includes(p._id);
            return (
              <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{p.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{p.companyName || 'N/A'}</p>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeBadgeColor(p.type)}`}>{p.type}</span>
                </div>

                {p.description && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{p.description}</p>}

                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${modeBadge(p.mode)}`}>{p.mode || 'TBD'}</span>
                  {p.duration && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FiClock size={10} /> {p.duration}
                    </span>
                  )}
                </div>

                {p.schedule?.registrationDeadline && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <FiCalendar size={11} /> Deadline: {new Date(p.schedule.registrationDeadline).toLocaleDateString()}
                  </p>
                )}

                <button
                  onClick={() => handleApply(p._id)}
                  disabled={isApplied || applying === p._id}
                  className={`mt-auto w-full py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                    isApplied
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-primary text-white hover:bg-primary-dark disabled:opacity-60'
                  }`}
                >
                  {isApplied ? <><FiCheckCircle /> Applied</> : applying === p._id ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
