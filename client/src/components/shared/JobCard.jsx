import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiDollarSign, FiCalendar } from 'react-icons/fi';
import SkillBadge from './SkillBadge';

export default function JobCard({ job, onApply, showApplyButton = true, matchScore }) {
  if (!job) return null;
  const visibleSkills = job.requiredSkills?.slice(0, 4) || [];
  const extraSkills = (job.requiredSkills?.length || 0) - 4;

  const typeBadge = job.type === 'internship'
    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20';

  const modeBadge = {
    remote: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    onsite: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    hybrid: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  }[job.mode] || 'bg-gray-500/10 text-gray-400 border border-gray-500/20';

  return (
    <motion.div
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="glass-card rounded-2xl p-5 hover:glass-card-hover transition-all duration-300 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-glow-sm">
            {job.companyName?.[0] || 'C'}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">{job.title}</h3>
            <p className="text-xs text-gray-500">{job.companyName}</p>
          </div>
        </div>
        {matchScore !== undefined && (
          <span className="text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2.5 py-1 rounded-full whitespace-nowrap shadow-glow-sm">
            {matchScore}% match
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${typeBadge}`}>{job.type}</span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${modeBadge}`}>{job.mode}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1">
        {visibleSkills.map((s, i) => <SkillBadge key={i} skill={s} />)}
        {extraSkills > 0 && (
          <span className="text-xs bg-white/[0.05] text-gray-400 px-2 py-0.5 rounded-full border border-white/[0.06]">+{extraSkills} more</span>
        )}
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500">
        {job.location && (
          <span className="flex items-center gap-1"><FiMapPin className="text-gray-600" /> {job.location}</span>
        )}
        {job.stipend?.amount ? (
          <span className="flex items-center gap-1"><FiDollarSign className="text-gray-600" /> ₹{job.stipend.amount.toLocaleString()}/mo</span>
        ) : job.salary?.min ? (
          <span className="flex items-center gap-1"><FiDollarSign className="text-gray-600" /> ₹{(job.salary.min/100000).toFixed(1)}-{(job.salary.max/100000).toFixed(1)} LPA</span>
        ) : null}
        {job.duration && (
          <span className="flex items-center gap-1"><FiClock className="text-gray-600" /> {job.duration}</span>
        )}
        {job.applicationDeadline && (
          <span className="flex items-center gap-1"><FiCalendar className="text-gray-600" /> {new Date(job.applicationDeadline).toLocaleDateString()}</span>
        )}
      </div>

      {/* Actions */}
      {showApplyButton && (
        <button
          onClick={() => onApply?.(job)}
          className="mt-auto w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-glow-md text-white text-sm font-semibold py-2.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          Apply Now
        </button>
      )}
    </motion.div>
  );
}
