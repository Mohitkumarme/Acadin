import React from 'react';
import { FiMapPin, FiClock, FiDollarSign, FiCalendar, FiBriefcase } from 'react-icons/fi';
import SkillBadge from './SkillBadge';

export default function JobCard({ job, onApply, showApplyButton = true, matchScore }) {
  if (!job) return null;
  const visibleSkills = job.requiredSkills?.slice(0, 4) || [];
  const extraSkills = (job.requiredSkills?.length || 0) - 4;

  const typeBadge = job.type === 'internship'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-purple-100 text-purple-700';

  const modeBadge = {
    remote: 'bg-green-100 text-green-700',
    onsite: 'bg-orange-100 text-orange-700',
    hybrid: 'bg-teal-100 text-teal-700',
  }[job.mode] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {job.companyName?.[0] || 'C'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm leading-tight">{job.title}</h3>
            <p className="text-xs text-gray-500">{job.companyName}</p>
          </div>
        </div>
        {matchScore !== undefined && (
          <span className="text-xs font-semibold bg-indigo-600 text-white px-2 py-1 rounded-full whitespace-nowrap">
            {matchScore}% match
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeBadge}`}>{job.type}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${modeBadge}`}>{job.mode}</span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1">
        {visibleSkills.map((s, i) => <SkillBadge key={i} skill={s} />)}
        {extraSkills > 0 && (
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{extraSkills} more</span>
        )}
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500">
        {job.location && (
          <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
        )}
        {job.stipend?.amount ? (
          <span className="flex items-center gap-1"><FiDollarSign /> {job.stipend.amount}/mo</span>
        ) : job.salary?.min ? (
          <span className="flex items-center gap-1"><FiDollarSign /> {job.salary.min}-{job.salary.max} LPA</span>
        ) : null}
        {job.duration && (
          <span className="flex items-center gap-1"><FiClock /> {job.duration}</span>
        )}
        {job.applicationDeadline && (
          <span className="flex items-center gap-1"><FiCalendar /> {new Date(job.applicationDeadline).toLocaleDateString()}</span>
        )}
      </div>

      {/* Actions */}
      {showApplyButton && (
        <button
          onClick={() => onApply?.(job)}
          className="mt-auto w-full bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2 rounded-lg transition"
        >
          Apply Now
        </button>
      )}
    </div>
  );
}
