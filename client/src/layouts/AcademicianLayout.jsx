import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiAward, FiSearch, FiMenu, FiLogOut, FiBook } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/academician/dashboard',    icon: FiHome,   label: 'Dashboard' },
  { to: '/academician/opportunities',icon: FiBook,   label: 'FDPs & Workshops' },
  { to: '/academician/research',     icon: FiSearch, label: 'Research & Collaborations' },
];

export default function AcademicianLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AC';

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-dark-surface border-r border-white/[0.06] ${mobile ? 'glass-card' : ''}`}>
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-emerald-400 font-medium">Academician</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                  : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 border border-transparent'
              }`
            }
          >
            <Icon className="text-base flex-shrink-0" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/[0.06]">
        <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/10">
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0"><Sidebar /></aside>
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative w-64 flex-shrink-0">
              <Sidebar mobile />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-dark-surface border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white transition-colors"><FiMenu size={22} /></button>
          <span className="font-bold text-white">Acadin</span>
          <div className="w-6" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
