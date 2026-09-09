import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiBook, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const roleBadgeColors = {
  student: 'bg-blue-100 text-blue-700',
  industry: 'bg-purple-100 text-purple-700',
  academician: 'bg-green-100 text-green-700',
  institution: 'bg-orange-100 text-orange-700',
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <FiBook className="text-2xl" />
            <span>Acadin</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 font-medium">{user?.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleBadgeColors[user?.role] || 'bg-gray-100 text-gray-700'}`}>
                  {user?.role}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-indigo-50 transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition font-medium">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 py-2">
                <FiUser className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${roleBadgeColors[user?.role] || 'bg-gray-100 text-gray-700'}`}>
                  {user?.role}
                </span>
              </div>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full text-left text-sm text-red-500 py-2 flex items-center gap-2"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-sm text-primary font-medium py-2">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
