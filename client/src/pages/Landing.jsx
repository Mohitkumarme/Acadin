import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import {
  FiBook, FiZap, FiBarChart2, FiBriefcase, FiUser,
  FiAward, FiTrendingUp, FiArrowRight, FiGlobe, FiCheck, FiCheckCircle
} from 'react-icons/fi';

/* ─── Animated Counter ───────────────────────────────────── */
function AnimatedNumber({ value, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const count = { v: 0 };
    const controls = animate(count.v, numericValue, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    });
    return () => controls.stop();
  }, [isInView, numericValue]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ─── Globe Canvas ───────────────────────────────────────── */
function Globe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let rotation = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const size = Math.min(canvas.parentElement.clientWidth, 520);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawGlobe = () => {
      const w = parseInt(canvas.style.width);
      const h = parseInt(canvas.style.height);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.38;

      ctx.clearRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.6);
      glow.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      glow.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      grad.addColorStop(0.7, 'rgba(99, 102, 241, 0.06)');
      grad.addColorStop(1, 'rgba(99, 102, 241, 0.02)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = -3; i <= 3; i++) {
        const lat = (i / 3) * (Math.PI / 2) * 0.9;
        const latR = r * Math.cos(lat);
        const latY = cy + r * Math.sin(lat);
        ctx.beginPath();
        ctx.ellipse(cx, latY, latR, latR * 0.15, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 + Math.abs(i) * 0.02})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      for (let i = 0; i < 8; i++) {
        const lng = (i / 8) * Math.PI + rotation;
        const lngX = Math.sin(lng);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * Math.abs(lngX), r, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.05 + Math.abs(lngX) * 0.1})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.restore();
      }

      const nodes = [
        { lat: 0.4, lng: 0.8 }, { lat: -0.3, lng: 1.5 }, { lat: 0.6, lng: 2.5 },
        { lat: -0.5, lng: 3.5 }, { lat: 0.2, lng: 4.2 }, { lat: -0.1, lng: 5.3 },
        { lat: 0.5, lng: 0.3 }, { lat: -0.4, lng: 2.0 }, { lat: 0.1, lng: 3.0 },
        { lat: 0.7, lng: 4.8 },
      ];

      const visibleNodes = [];
      nodes.forEach((node) => {
        const theta = node.lng + rotation;
        const phi = node.lat;
        const x = cx + r * Math.cos(phi) * Math.sin(theta);
        const y = cy + r * Math.sin(phi);
        const z = Math.cos(phi) * Math.cos(theta);
        if (z > -0.1) {
          const alpha = Math.max(0, Math.min(1, z + 0.3));
          visibleNodes.push({ x, y, alpha });
          const dotGlow = ctx.createRadialGradient(x, y, 0, x, y, 8);
          dotGlow.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.8})`);
          dotGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = dotGlow;
          ctx.fillRect(x - 8, y - 8, 16, 16);
          ctx.beginPath();
          ctx.arc(x, y, 2.5 * alpha, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.fill();
        }
      });

      for (let i = 0; i < visibleNodes.length; i++) {
        for (let j = i + 1; j < visibleNodes.length; j++) {
          const a = visibleNodes[i];
          const b = visibleNodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < r * 0.8) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2 - dist * 0.15;
            ctx.quadraticCurveTo(midX, midY, b.x, b.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${Math.min(a.alpha, b.alpha) * 0.2})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      rotation += 0.003;
      animationId = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

/* ─── Animation Variants ─────────────────────────────────── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
const scaleUp = { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

/* ─── Static Data ────────────────────────────────────────── */
const stats = [
  { value: '500',   suffix: '+', label: 'Partner Companies' },
  { value: '10000', suffix: '+', label: 'Students Registered' },
  { value: '95',    suffix: '%', label: 'Placement Rate' },
  { value: '200',   suffix: '+', label: 'Institutions' },
];

const features = [
  { icon: FiZap,        title: 'AI Skill Assessment',   desc: 'Adaptive tests that map your strengths, flag gaps, and benchmark you against real industry expectations.', gradient: 'from-indigo-500 to-purple-500' },
  { icon: FiBarChart2,  title: 'Smart Matching',         desc: 'Your skill DNA matched against thousands of live roles — ranked by fit, not just keyword overlap.', gradient: 'from-purple-500 to-pink-500' },
  { icon: FiBriefcase,  title: 'Internship Portal',      desc: 'Curated listings from 500+ companies with one-click apply and real-time status tracking.', gradient: 'from-cyan-500 to-blue-500' },
  { icon: FiUser,       title: 'Digital Portfolio',      desc: 'A shareable profile that showcases projects, certs, and scores — built to actually get noticed.', gradient: 'from-emerald-500 to-teal-500' },
  { icon: FiTrendingUp, title: 'Analytics Dashboard',    desc: 'Placement funnels, skill gap reports, and cohort benchmarks — live data for institutions.', gradient: 'from-amber-500 to-orange-500' },
  { icon: FiBook,       title: 'Industry Learning Hub',  desc: 'Bootcamps, mentorships, and FDPs — run by practitioners who actually work in the field.', gradient: 'from-pink-500 to-rose-500' },
];

const steps = [
  { step: '01', title: 'Assess',  desc: 'Complete adaptive assessments across technical and soft skills. Know exactly where you stand.', icon: FiZap },
  { step: '02', title: 'Match',   desc: 'Our engine surfaces the best-fit opportunities from thousands of active listings.', icon: FiGlobe },
  { step: '03', title: 'Apply',   desc: 'Companies see your skill-match score before they read your resume. Stand out from day one.', icon: FiCheck },
];

const roles = [
  { title: 'Student',     icon: FiUser,       desc: 'Assess skills, find internships, build your portfolio, and land your dream job.', href: '/register', gradient: 'from-indigo-500 via-blue-500 to-cyan-500' },
  { title: 'Industry',    icon: FiBriefcase,  desc: 'Post roles, discover skill-matched talent, and run upskilling programs at scale.', href: '/register', gradient: 'from-purple-500 via-violet-500 to-indigo-500' },
  { title: 'Academician', icon: FiAward,      desc: 'Access FDPs, research collaborations, workshops, and guest lecture invitations.', href: '/register', gradient: 'from-emerald-500 via-green-500 to-teal-500' },
  { title: 'Institution', icon: FiBarChart2,  desc: 'Track placements, analyze skill gaps, and benchmark your talent pipeline.', href: '/register', gradient: 'from-amber-500 via-orange-500 to-red-500' },
];

/* ─── Landing Component ──────────────────────────────────── */
export default function Landing() {
  return (
    <div className="min-h-screen bg-dark text-gray-200 overflow-hidden">

      {/* ── Navbar ─────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
              <FiBook className="text-white text-sm" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Acadin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white px-4 py-2 font-medium transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-glow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.07] rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.06] rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 bg-dot-grid opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left: copy */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="text-center lg:text-left">
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-sm font-medium text-indigo-300 mb-8">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Bridging Academia &amp; Industry
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] mb-6 tracking-tight"
              >
                Bridge the Gap<br className="hidden sm:block" />
                Between{' '}
                <span className="text-shimmer">Academia &amp; Industry</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Acadin connects students, companies, academicians, and institutions through
                intelligent skill matching, internship portals, and real-time collaboration.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-[0_0_24px_rgba(124,58,237,0.4)] hover:shadow-[0_0_32px_rgba(124,58,237,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started Free
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white px-8 py-4 rounded-2xl font-semibold border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all"
                >
                  See Features
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-white/[0.05] hidden lg:block">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">Trusted by leading teams</p>
                <div className="flex flex-wrap items-center gap-8 opacity-40 hover:opacity-80 transition-opacity duration-500">
                  <span className="flex items-center gap-2 text-gray-300 font-semibold"><FiCheckCircle className="text-gray-500" /> TechFlow</span>
                  <span className="flex items-center gap-2 text-gray-300 font-semibold"><FiGlobe className="text-gray-500" /> NovaCorp</span>
                  <span className="flex items-center gap-2 text-gray-300 font-semibold"><FiTrendingUp className="text-gray-500" /> GlobalEdu</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[50px]" />
              </div>
              <div className="w-[400px] h-[400px] sm:w-[480px] sm:h-[480px] lg:w-[520px] lg:h-[520px]">
                <Globe />
              </div>

              {/* Floating centre card */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] shadow-glass-dark rounded-2xl px-5 py-4 flex flex-col items-center gap-2 z-10"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <FiZap className="text-indigo-400 text-xl animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-medium">AI Skill Match</p>
                  <p className="text-lg font-bold text-white">98.5%</p>
                </div>
              </motion.div>

              {/* Placement rate badge */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-4 lg:right-0 bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-glass-dark rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <FiTrendingUp className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Placement Rate</p>
                  <p className="text-sm font-bold text-emerald-400">95.2%</p>
                </div>
              </motion.div>

              {/* Active jobs badge */}
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 left-0 lg:left-4 bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-glass-dark rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <FiBriefcase className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Active Jobs</p>
                  <p className="text-sm font-bold text-cyan-400">1,240+</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section className="relative py-20 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <p className="text-4xl sm:text-5xl font-extrabold text-gradient tracking-tight">
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-sm text-gray-500 mt-2 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section id="features" className="relative py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mb-3">
              Platform Features
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to <span className="text-gradient">succeed</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              One platform for every stakeholder in the education-to-employment pipeline.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={scaleUp}
                whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group glass-card rounded-2xl p-7 hover:glass-card-hover transition-all duration-300 cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:shadow-glow-sm transition-shadow`}>
                  <f.icon className="text-white text-lg" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section className="relative py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mb-3">
              How It Works
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three steps to your <span className="text-gradient">dream opportunity</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-md mx-auto">
              Simple process, powerful results. Get matched and hired faster than ever.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-3 gap-10"
          >
            {steps.map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[58%] w-[84%] border-t border-dashed border-indigo-500/15" />
                )}
                <div className="relative inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center mx-auto mb-5 group-hover:shadow-glow-md transition-shadow">
                  <s.icon className="text-white text-2xl" />
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-dark-50 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Roles ──────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mb-3">
              For Everyone
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for every <span className="text-gradient">role</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500">
              Choose your role and unlock an experience built specifically for you.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {roles.map((r) => (
              <motion.div key={r.title} variants={scaleUp}>
                <Link
                  to={r.href}
                  className="group block glass-card rounded-2xl p-7 text-center hover:glass-card-hover transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ y: -4, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mx-auto mb-5 shadow-glow-sm group-hover:shadow-glow-md transition-shadow`}
                  >
                    <r.icon className="text-white text-xl" />
                  </motion.div>
                  <h3 className="font-semibold text-white mb-2 text-lg">{r.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{r.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold group-hover:text-indigo-300 transition-colors">
                    Join as {r.title}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative glass-card rounded-3xl p-12 sm:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-purple-500/4 to-cyan-500/8 pointer-events-none" />
            <div className="relative">
              <p className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mb-4">Get Started Today</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to transform your <span className="text-gradient">career journey</span>?
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto mb-8">
                Join thousands of students, companies, and institutions already using Acadin
                to close the gap between education and employment.
              </p>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold hover:shadow-glow-lg hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                Start for Free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FiBook className="text-white text-xs" />
            </div>
            <span className="font-bold text-white tracking-tight">Acadin</span>
          </div>
          <p className="text-sm text-gray-600">© 2025 Acadin. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
