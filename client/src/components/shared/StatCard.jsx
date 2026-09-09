import React from 'react';

const colorMap = {
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    text: 'text-indigo-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    text: 'text-purple-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    text: 'text-green-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    text: 'text-blue-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    text: 'text-yellow-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    text: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    text: 'text-red-600',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'text-teal-600',
    text: 'text-teal-600',
  },
};

export default function StatCard({ title, value, icon: Icon, color = 'indigo', subtitle }) {
  const c = colorMap[color] || colorMap.indigo;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
      <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon className={`text-xl ${c.icon}`} />}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
        <p className={`text-2xl font-bold ${c.text} mt-0.5`}>{value ?? 0}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
