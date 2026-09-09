import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FiHome, FiZap, FiBarChart2, FiBriefcase, FiStar,
  FiFileText, FiUser, FiBook, FiMenu, FiX, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/student/dashboard',        icon: FiHome,      label: 'Dashboard' },
  { to: '/student/skill-assessment', icon: FiZap,       label: 'Skill Assessment' },
  { to: '/student/skill-profile',    icon: FiBarChart2, label: 'Skill Profile' },
  { to: '/student/internships',      icon: FiBriefcase, label: 'Internships' },
  { to: '/student/placements',       icon: FiStar,      label: 'Placements' },
  { to: '/student/applications',     icon: FiFileText,  label: 'Applications' },
  { to: '/student/portfolio',        icon: FiUser,      label: 'Portfolio' },
  { to: '/student/learning',         icon: FiBook,      label: 'Learning Programs' },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-white ${mobile ? '' : 'border-r border-gray-100'}`}>
      {/* User info */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-indigo-600 font-medium">Student</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <Icon className="text-base flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex-shrink-0">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600"><FiMenu size={22} /></button>
          <span className="font-bold text-primary">Acadin</span>
          <div className="w-6" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
