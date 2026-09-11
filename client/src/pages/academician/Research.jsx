import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiArrowRight, FiCalendar, FiClock, FiUsers, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { academicianAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const TYPES = ['All', 'Research', 'Guest Lecture', 'Consultancy', 'Innovation Challenge', 'Mentorship', 'Live Project', 'Workshop'];

const typeBadge = {
  research:               'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'guest-lecture':        'bg-purple-500/10 text-purple-400 border-purple-500/20',
  consultancy:            'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'innovation-challenge': 'bg-red-500/10 text-red-400 border-red-500/20',
  mentorship:             'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'live-project':         'bg-teal-500/10 text-teal-400 border-teal-500/20',
  workshop:               'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const typeGrad = {
  research:               'from-blue-500 to-indigo-500',
  'guest-lecture':        'from-purple-500 to-violet-500',
  consultancy:            'from-amber-500 to-orange-500',
  'innovation-challenge': 'from-red-500 to-rose-500',
  mentorship:             'from-emerald-500 to-teal-500',
  'live-project':         'from-teal-500 to-cyan-500',
  workshop:               'from-indigo-500 to-blue-500',
};

export default function Research() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch]     = useState('');
  const [appliedIds, setAppliedIds] = useState([]);
  const [applying, setApplying] = useState(null);
  const [error, setError]       = useState('');

  useEffect(() => {
    Promise.all([
      academicianAPI.getResearch().catch(() => ({ data: null })),
      academicianAPI.getProfile().catch(() => ({ data: null })),
    ]).then(([researchRes, profileRes]) => {
      setItems(researchRes.data?.collaborations || researchRes.data || []);
      setProfileComplete(profileRes.data?.profileComplete ?? false);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(item => {
    const tabKey = activeTab.toLowerCase().replace(/ /g, '-');
    const matchTab = activeTab === 'All' || item.type?.toLowerCase() === tabKey;
    const q = search.toLowerCase();
    const matchSearch = !search || item.title?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const handleApply = async (id) => {
    if (!profileComplete) {
      setError('Please complete your profile with an institutional email before applying.');
      return;
    }
    setApplying(id);
    setError('');
    try {
      await academicianAPI.applyToCollaboration(id);
      setAppliedIds(prev => [...prev, id]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply. Try again.');
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading research opportunities..." />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-white">Research & Collaborations</h1>
        <div className="text-xs text-gray-600">{filtered.length} opportunit{filtered.length !== 1 ? 'ies' : 'y'}</div>
      </div>

      {!profileComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-400">Complete your profile with an institutional email to apply to collaborations.</p>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <FiAlertTriangle size={13} /> {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400"><FiSearch size={13} /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-50 border border-white/[0.06] p-1 rounded-xl overflow-x-auto">
        {TYPES.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === tab
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="glass-card rounded-2xl p-3.5 border border-white/[0.06]">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full pl-9 pr-4 py-2 bg-dark-50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border border-white/[0.06]">
          <FiUsers className="text-4xl text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {items.length === 0
              ? 'No research collaborations are available yet. Check back when industry partners post opportunities.'
              : 'No matches found for this filter.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const isApplied = appliedIds.includes(item._id);
            const tb = typeBadge[item.type?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            const grad = typeGrad[item.type?.toLowerCase()] || 'from-indigo-500 to-purple-500';
            return (
              <motion.div
                key={item._id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-white/[0.06] hover:border-indigo-500/20 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-200 text-sm leading-snug">{item.title}</h3>
                    {item.postedBy?.name && (
                      <p className="text-xs text-gray-600 mt-0.5">by {item.postedBy.name}</p>
                    )}
                  </div>
                  <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize ${tb}`}>
                    {item.type?.replace('-', ' ')}
                  </span>
                </div>

                {/* Gradient bar */}
                <div className={`h-0.5 w-full rounded-full bg-gradient-to-r ${grad} opacity-40`} />

                {item.description && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{item.description}</p>
                )}

                {/* Required Expertise tags */}
                {item.requiredExpertise?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.requiredExpertise.slice(0, 3).map((exp, idx) => (
                      <span key={idx} className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">{exp}</span>
                    ))}
                    {item.requiredExpertise.length > 3 && (
                      <span className="text-[10px] text-gray-600">+{item.requiredExpertise.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Meta */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-auto">
                  {item.duration && (
                    <span className="flex items-center gap-1"><FiClock size={9} /> {item.duration}</span>
                  )}
                  {item.compensation && (
                    <span>· {item.compensation}</span>
                  )}
                  {item.targetAudience && (
                    <span className="capitalize">· For {item.targetAudience}</span>
                  )}
                </div>

                {item.applicationDeadline && (
                  <p className="text-xs text-red-400/80 flex items-center gap-1">
                    <FiCalendar size={10} /> Deadline: {new Date(item.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}

                <button
                  onClick={() => handleApply(item._id)}
                  disabled={isApplied || applying === item._id}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    isApplied
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-glow-sm disabled:opacity-60'
                  }`}
                >
                  {isApplied
                    ? <><FiCheckCircle size={13} /> Applied</>
                    : applying === item._id
                      ? 'Applying...'
                      : <>Apply Now <FiArrowRight size={12} /></>
                  }
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
