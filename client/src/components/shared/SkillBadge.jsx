import React from 'react';

export default function SkillBadge({ skill, size = 'sm' }) {
  if (!skill) return null;
  return (
    <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2.5 py-0.5 rounded-full font-medium border border-indigo-500/15 hover:bg-indigo-500/15 hover:border-indigo-500/25 transition-colors">
      {skill}
    </span>
  );
}
