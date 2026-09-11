import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip
} from 'recharts';
import { FiAlertTriangle, FiArrowRight, FiCheckCircle, FiZap } from 'react-icons/fi';
import { skillAPI, studentAPI } from '../../api/services';
import SkillBadge from '../../components/shared/SkillBadge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const levelInfo = (score) => {
  if (score >= 80) return { label: 'Expert',     color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
  if (score >= 60) return { label: 'Proficient', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
  if (score >= 40) return { label: 'Developing', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
  return               { label: 'Beginner',   color: 'bg-red-500/10 text-red-400 border border-red-500/20' };
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl px-3 py-2 text-xs text-gray-200 border border-white/10">
        <p className="font-semibold">{payload[0].payload.subject}</p>
        <p className="text-indigo-400">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function SkillProfile() {
  const [result, setResult]   = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      skillAPI.getResult().catch(() => ({ data: null })),
      studentAPI.getSkillProfile().catch(() => ({ data: null })),
    ]).then(([r, p]) => {
      setResult(r.data?.result || r.data || null);
      setProfile(p.data || null);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading skill profile..." />;

  const rawScores = result?.categoryScores || [];
  const scores = rawScores.map(s => ({
    category: s.category,
    score: s.percentage ?? s.score ?? 0,
  }));

  const radarData = scores.map(s => ({
    subject: s.category,
    score: Math.round(s.score),
    fullMark: 100,
  }));

  const strengths    = scores.filter(s => s.score >= 70);
  const improvements = scores.filter(s => s.score < 60);

  if (!result && scores.length === 0) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="glass-card rounded-2xl p-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-glow-md">
            <FiZap className="text-white text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Assessment Taken Yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Complete the skill assessment to see your personalized skill profile and radar chart.
          </p>
          <Link
            to="/student/skill-assessment"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-glow-md transition"
          >
            Take Skill Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Skill Profile</h1>
        <Link
          to="/student/skill-assessment"
          className="text-sm text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-xl hover:bg-indigo-500/10 transition flex items-center gap-2"
        >
          <FiZap /> Retake Assessment
        </Link>
      </div>

      {/* Overall score banner */}
      {result?.overallScore != null && (
        <div className="relative glass-card rounded-2xl p-5 overflow-hidden flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
          <div className="relative">
            <p className="text-sm text-gray-400">Overall Skill Score</p>
            <p className="text-4xl font-black text-white mt-1">
              {Math.round(result.overallScore)}<span className="text-xl text-gray-400">%</span>
            </p>
          </div>
          <div className="relative">
            <span className={`text-sm px-4 py-1.5 rounded-full font-semibold ${levelInfo(result.overallScore).color}`}>
              {levelInfo(result.overallScore).label}
            </span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-4">Skills Radar</h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category cards */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4">Category Breakdown</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {scores.map((s, i) => {
              const { label, color } = levelInfo(s.score);
              const barColor = s.score < 40
                ? 'from-red-500 to-rose-500'
                : s.score < 70
                  ? 'from-amber-500 to-yellow-500'
                  : 'from-emerald-500 to-green-500';
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-300 capitalize">{s.category}</span>
                      {s.score < 40 && <FiAlertTriangle className="text-red-400 text-xs" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
                      <span className="text-xs font-bold text-gray-300">{Math.round(s.score)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        {strengths.length > 0 && (
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/10">
            <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <FiCheckCircle /> Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s, i) => (
                <span key={i} className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium capitalize border border-emerald-500/20">
                  {s.category}
                </span>
              ))}
            </div>
          </div>
        )}
        {improvements.length > 0 && (
          <div className="glass-card rounded-2xl p-5 border border-red-500/10">
            <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
              <FiAlertTriangle /> Areas to Improve
            </h3>
            <div className="flex flex-wrap gap-2">
              {improvements.map((s, i) => (
                <span key={i} className="bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded-full font-medium capitalize border border-red-500/20">
                  {s.category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Listed skills from profile */}
      {profile?.skills?.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-3">Listed Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => <SkillBadge key={i} skill={s} />)}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="relative glass-card rounded-2xl p-5 overflow-hidden flex items-center justify-between flex-wrap gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/5 pointer-events-none" />
        <div className="relative">
          <p className="font-semibold text-white mb-0.5">Ready to apply?</p>
          <p className="text-sm text-gray-400">Browse internships matched to your skill profile.</p>
        </div>
        <Link
          to="/student/internships"
          className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:shadow-glow-md transition flex items-center gap-2"
        >
          Browse Internships <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
