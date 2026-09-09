import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiBook, FiZap, FiBarChart2, FiBriefcase, FiUser,
  FiAward, FiTrendingUp, FiCheckCircle, FiArrowRight
} from 'react-icons/fi';

const stats = [
  { value: '500+', label: 'Partner Companies' },
  { value: '10,000+', label: 'Students Registered' },
  { value: '95%', label: 'Placement Rate' },
  { value: '200+', label: 'Institutions' },
];

const features = [
  { icon: FiZap,       title: 'Skill Assessment',      desc: 'AI-powered assessments to evaluate your strengths and identify growth areas.', color: 'text-indigo-600 bg-indigo-50' },
  { icon: FiBarChart2, title: 'Smart Matching',         desc: 'Algorithmic matching between student skill profiles and industry requirements.', color: 'text-purple-600 bg-purple-50' },
  { icon: FiBriefcase, title: 'Internship Portal',      desc: 'Curated internship opportunities from top companies with one-click apply.', color: 'text-blue-600 bg-blue-50' },
  { icon: FiUser,      title: 'Digital Portfolio',      desc: 'Showcase projects, certifications, and achievements to industry recruiters.', color: 'text-green-600 bg-green-50' },
  { icon: FiTrendingUp,title: 'Analytics Dashboard',    desc: 'Real-time analytics for institutions to track placement and skill trends.', color: 'text-orange-600 bg-orange-50' },
  { icon: FiBook,      title: 'Industry Learning',      desc: 'Workshops, FDPs, and training programs from industry experts.', color: 'text-teal-600 bg-teal-50' },
];

const steps = [
  { step: '01', title: 'Assess', desc: 'Complete a comprehensive skill assessment across technical and soft skill categories.' },
  { step: '02', title: 'Match',  desc: 'Our algorithm matches your profile to the best-fit opportunities in industry.' },
  { step: '03', title: 'Apply',  desc: 'Apply with confidence — companies already know your skill match percentage.' },
];

const roles = [
  { title: 'Student', icon: FiUser,      desc: 'Assess skills, find internships, build your portfolio.', href: '/register', color: 'from-indigo-500 to-blue-600' },
  { title: 'Industry', icon: FiBriefcase,desc: 'Post jobs, discover top talent, run learning programs.', href: '/register', color: 'from-purple-500 to-indigo-600' },
  { title: 'Academician', icon: FiAward, desc: 'Access FDPs, workshops, and research collaborations.', href: '/register', color: 'from-green-500 to-teal-600' },
  { title: 'Institution', icon: FiBarChart2, desc: 'Track placements, analyze skill gaps, benchmark talent.', href: '/register', color: 'from-orange-500 to-red-600' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <FiBook className="text-2xl" /><span>Acadin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-primary px-4 py-2 font-medium transition">Login</Link>
            <Link to="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition font-medium">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <FiZap /> Bridging Academia & Industry
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Bridge the Gap Between<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Academia & Industry
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Acadin connects students, industry professionals, academicians, and institutions
            through intelligent skill matching, internship portals, and collaboration tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-primary-dark transition flex items-center gap-2">
              Get Started Free <FiArrowRight />
            </Link>
            <a href="#features" className="text-gray-600 px-8 py-3.5 rounded-xl font-semibold text-base border border-gray-200 hover:border-primary hover:text-primary transition">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-primary">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">A unified platform that serves every stakeholder in the education-to-employment journey.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="text-xl" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Three simple steps to your dream opportunity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full border-t-2 border-dashed border-indigo-200" />
                )}
                <div className="relative inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for Every Role</h2>
            <p className="text-gray-500">Choose your role and unlock a tailored experience.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r) => (
              <Link key={r.title} to={r.href} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <r.icon className="text-white text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs text-primary font-medium">
                  Join as {r.title} <FiArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FiBook /><span>Acadin</span>
          </div>
          <p className="text-sm">© 2025 Acadin. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
