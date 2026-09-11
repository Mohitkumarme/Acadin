import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGithub, FiLinkedin, FiGlobe, FiBook, FiExternalLink,
  FiAlertCircle, FiBarChart2, FiAward, FiZap
} from 'react-icons/fi';
import api from '../../api/axios';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const levelColor = (score) => {
  if (score >= 80) return { bar: 'from-emerald-500 to-green-500', badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', label: 'Expert' };
  if (score >= 60) return { bar: 'from-blue-500 to-indigo-500', badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', label: 'Proficient' };
  if (score >= 40) return { bar: 'from-amber-500 to-yellow-500', badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', label: 'Developing' };
  return { bar: 'from-red-500 to-rose-500', badge: 'bg-red-500/10 text-red-400 border border-red-500/20', label: 'Beginner' };
};

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/student/portfolio/${userId}`)
      .then(res => setData(res.data))
      .catch(() => setError('Portfolio not found or not available.'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-10 text-center max-w-md">
          <FiAlertCircle className="text-4xl text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Portfolio Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition">← Back to Acadin</Link>
        </div>
      </div>
    );
  }

  const initials = data.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <div className="min-h-screen bg-dark text-gray-200">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <FiBook className="text-white text-xs" />
            </div>
            <span className="font-bold text-white text-sm">Acadin</span>
          </Link>
          <Link
            to="/register"
            className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:shadow-glow-sm transition"
          >
            Join Acadin
          </Link>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto px-4 py-10 space-y-6">
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Profile header */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-7">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-glow-sm overflow-hidden flex-shrink-0">
                {data.avatar ? (
                  <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{data.name}</h1>
                {data.headline && <p className="text-indigo-300 text-sm mt-1">{data.headline}</p>}
                {data.about && <p className="text-gray-400 text-sm mt-3 leading-relaxed">{data.about}</p>}

                {/* Social links */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/[0.06]">
                  {data.github && (
                    <a href={data.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition">
                      <FiGithub /> GitHub
                    </a>
                  )}
                  {data.linkedin && (
                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-400 transition">
                      <FiLinkedin /> LinkedIn
                    </a>
                  )}
                  {data.website && (
                    <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition">
                      <FiGlobe /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skill Scores */}
          {data.skillScores?.length > 0 && (
            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><FiBarChart2 /> Skill Scores</h2>
              <div className="space-y-3">
                {data.skillScores.map((s, i) => {
                  const { bar, badge, label } = levelColor(s.score);
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-gray-300 capitalize">{s.category}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>{label}</span>
                          <span className="text-sm font-bold text-gray-200">{Math.round(s.score)}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.score}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${bar}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Skills tags */}
          {data.skills?.length > 0 && (
            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2"><FiZap /> Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s, i) => (
                  <span key={i} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-medium">
                    {typeof s === 'string' ? s : s.name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          {data.projects?.length > 0 && (
            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Projects</h2>
              <div className="space-y-4">
                {data.projects.map((p, i) => (
                  <div key={i} className="flex gap-4 border-l-2 border-indigo-500/30 pl-4">
                    {p.image && (
                      <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{p.title}</p>
                      {p.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.description}</p>}
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1.5 transition">
                          <FiExternalLink size={10} /> View Project
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certifications */}
          {data.certifications?.length > 0 && (
            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><FiAward /> Certifications</h2>
              <div className="space-y-4">
                {data.certifications.map((c, i) => (
                  <div key={i} className="flex gap-4 border-l-2 border-emerald-500/30 pl-4">
                    {c.image && (
                      <img src={c.image} alt={c.name || c.title} className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{c.name || c.title}</p>
                      {c.issuer && <p className="text-xs text-gray-500 mt-0.5">{c.issuer}</p>}
                      {(c.credentialUrl || c.link) && (
                        <a href={c.credentialUrl || c.link} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-1.5 transition">
                          <FiExternalLink size={10} /> Verify Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Achievements */}
          {data.achievements?.length > 0 && (
            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
              <h2 className="font-semibold text-white mb-4">Achievements</h2>
              <div className="space-y-4">
                {data.achievements.map((a, i) => (
                  <div key={i} className="flex gap-4 border-l-2 border-amber-500/30 pl-4">
                    {a.image && (
                      <img src={a.image} alt={a.title} className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{a.title}</p>
                      {a.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.description}</p>}
                      {a.link && (
                        <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-1.5 transition">
                          <FiExternalLink size={10} /> View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA for recruiters */}
          <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 text-center border border-indigo-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
            <div className="relative">
              <p className="text-sm font-semibold text-gray-300 mb-1">Powered by Acadin</p>
              <p className="text-xs text-gray-500 mb-4">Discover more verified student talent on Acadin — skill-matched to your role.</p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm px-6 py-2.5 rounded-xl font-semibold hover:shadow-glow-md transition"
              >
                Find Talent on Acadin
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
