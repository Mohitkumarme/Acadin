import React from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  indigo:  { gradient: 'from-indigo-500 to-blue-500',   glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]' },
  purple:  { gradient: 'from-purple-500 to-violet-500', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]' },
  green:   { gradient: 'from-emerald-500 to-green-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]' },
  blue:    { gradient: 'from-blue-500 to-cyan-500',     glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
  yellow:  { gradient: 'from-amber-500 to-yellow-500',  glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
  orange:  { gradient: 'from-orange-500 to-amber-500',  glow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]' },
  red:     { gradient: 'from-red-500 to-rose-500',      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' },
  teal:    { gradient: 'from-teal-500 to-cyan-500',     glow: 'shadow-[0_0_20px_rgba(20,184,166,0.15)]' },
  cyan:    { gradient: 'from-cyan-500 to-blue-500',     glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]' },
};

export default function StatCard({ title, value, icon: Icon, color = 'indigo', subtitle }) {
  const c = colorMap[color] || colorMap.indigo;
  return (
    <motion.div
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className={`glass-card rounded-2xl p-5 flex items-center gap-4 hover:glass-card-hover transition-all duration-300 cursor-default ${c.glow}`}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon className="text-white text-xl" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value ?? 0}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
