import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiHome, FiUsers, FiTrendingUp, FiBarChart2, FiMenu, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/institution/dashboard',           icon: FiHome,       label: 'Dashboard' },
  { to: '/institution/students',            icon: FiUsers,      label: 'Students' },
  { to: '/institution/placement-analytics', icon: FiTrendingUp, label: 'Placement Analytics' },
  { to: '/institution/skill-trends',        icon: FiBarChart2,  label: 'Skill Demand Trends' },
];

export default function InstitutionLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'IN';

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">{initials}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-orange-600 font-medium">Institution</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <Icon className="text-base flex-shrink-0" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50">
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0"><Sidebar /></aside>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex-shrink-0"><Sidebar /></div>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600"><FiMenu size={22} /></button>
          <span className="font-bold text-primary">Acadin</span>
          <div className="w-6" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
