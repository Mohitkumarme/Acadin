import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiBook, FiUser, FiBriefcase, FiAward, FiHome,
  FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import { authAPI } from '../../api/services';

const roles = [
  { value: 'student',     label: 'Student',       icon: FiUser,      desc: 'Find internships & showcase skills', color: 'border-indigo-300 bg-indigo-50 text-indigo-700' },
  { value: 'industry',    label: 'Industry',      icon: FiBriefcase, desc: 'Hire talent & post opportunities',    color: 'border-purple-300 bg-purple-50 text-purple-700' },
  { value: 'academician', label: 'Academician',   icon: FiAward,     desc: 'Access FDPs & collaborations',        color: 'border-green-300 bg-green-50 text-green-700' },
  { value: 'institution', label: 'Institution',   icon: FiHome,      desc: 'Track placements & analytics',        color: 'border-orange-300 bg-orange-50 text-orange-700' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!form.role) return 'Please select your role.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password, role: form.role });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-2xl">
            <FiBook className="text-3xl" /><span>Acadin</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm">Join thousands of students, companies, and educators</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                <FiAlertCircle className="flex-shrink-0" />{error}
              </div>
            )}

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value} type="button"
                    onClick={() => { setForm({ ...form, role: r.value }); setError(''); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-center ${
                      form.role === r.value ? `${r.color} border-opacity-100` : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <r.icon className="text-xl" />
                    <span className="text-sm font-semibold">{r.label}</span>
                    <span className="text-xs text-gray-500 leading-tight">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 6 chars"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} placeholder="Repeat"
                    className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-dark transition disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
