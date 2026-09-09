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
  if (score >= 80) return { label: 'Expert',     color: 'bg-green-100 text-green-700' };
  if (score >= 60) return { label: 'Proficient', color: 'bg-blue-100 text-blue-700' };
  if (score >= 40) return { label: 'Developing', color: 'bg-yellow-100 text-yellow-700' };
  return                  { label: 'Beginner',   color: 'bg-red-100 text-red-700' };
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
      // r.data = { result: { categoryScores, overallScore } } or null
      setResult(r.data?.result || r.data || null);
      setProfile(p.data || null);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading skill profile..." />;

  // Pull scores from result – backend shape: { categoryScores: [{category, percentage}] }
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <FiZap className="text-5xl text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Assessment Taken Yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Complete the skill assessment to see your personalized skill profile and radar chart.
          </p>
          <Link
            to="/student/skill-assessment"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition"
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
        <h1 className="text-xl font-bold text-gray-900">Skill Profile</h1>
        <Link
          to="/student/skill-assessment"
          className="text-sm text-primary border border-primary px-4 py-2 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2"
        >
          <FiZap /> Retake Assessment
        </Link>
      </div>

      {/* Overall score banner */}
      {result?.overallScore != null && (
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-200">Overall Skill Score</p>
            <p className="text-4xl font-black mt-1">{Math.round(result.overallScore)}<span className="text-xl">%</span></p>
          </div>
          <div className="text-right">
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
              {levelInfo(result.overallScore).label}
            </span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        {radarData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Skills Radar</h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Category Breakdown</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {scores.map((s, i) => {
              const { label, color } = levelInfo(s.score);
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{s.category}</span>
                      {s.score < 40 && <FiAlertTriangle className="text-red-400 text-xs" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
                      <span className="text-xs font-bold text-gray-700">{Math.round(s.score)}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${s.score < 40 ? 'bg-red-400' : s.score < 70 ? 'bg-yellow-400' : 'bg-green-500'}`}
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
          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <FiCheckCircle /> Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {strengths.map((s, i) => (
                <span key={i} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium capitalize">
                  {s.category}
                </span>
              ))}
            </div>
          </div>
        )}
        {improvements.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <FiAlertTriangle /> Areas to Improve
            </h3>
            <div className="flex flex-wrap gap-2">
              {improvements.map((s, i) => (
                <span key={i} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-medium capitalize">
                  {s.category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Listed skills from profile */}
      {profile?.skills?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Listed Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => <SkillBadge key={i} skill={s} />)}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-5 text-white flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="font-semibold mb-1">Ready to apply?</p>
          <p className="text-sm text-indigo-200">Browse internships matched to your skill profile.</p>
        </div>
        <Link
          to="/student/internships"
          className="bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2"
        >
          Browse Internships <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
