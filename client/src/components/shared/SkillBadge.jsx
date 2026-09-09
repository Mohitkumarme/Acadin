import React from 'react';

const categoryColors = {
  programming: 'bg-blue-100 text-blue-700',
  soft: 'bg-green-100 text-green-700',
  data: 'bg-purple-100 text-purple-700',
  design: 'bg-pink-100 text-pink-700',
  management: 'bg-orange-100 text-orange-700',
  communication: 'bg-teal-100 text-teal-700',
  default: 'bg-gray-100 text-gray-600',
};

const categoryKeywords = {
  programming: ['javascript', 'python', 'java', 'react', 'node', 'c++', 'sql', 'html', 'css', 'typescript', 'php', 'go', 'rust', 'swift', 'kotlin'],
  data: ['machine learning', 'data science', 'analytics', 'tensorflow', 'pandas', 'numpy', 'tableau', 'power bi', 'ai', 'deep learning'],
  design: ['figma', 'ui', 'ux', 'photoshop', 'illustrator', 'sketch', 'design'],
  management: ['project management', 'agile', 'scrum', 'leadership', 'strategy'],
  soft: ['communication', 'teamwork', 'problem solving', 'critical thinking', 'adaptability', 'time management'],
};

function getCategory(skill) {
  const lower = skill.toLowerCase();
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((k) => lower.includes(k))) return cat;
  }
  return 'default';
}

export default function SkillBadge({ skill, size = 'sm' }) {
  const cat = getCategory(skill);
  const colorClass = categoryColors[cat] || categoryColors.default;
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}`}>
      {skill}
    </span>
  );
}
