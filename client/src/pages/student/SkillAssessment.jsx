import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiZap, FiArrowRight, FiArrowLeft, FiCheckCircle,
  FiAlertCircle, FiCode, FiDatabase, FiBarChart2,
  FiCpu, FiServer, FiLayout, FiPackage, FiShield
} from 'react-icons/fi';
import { skillAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

/* ── Domain catalogue ──────────────────────────────────────────────────────── */
const DOMAIN_CATALOGUE = [
  { key: 'Web Development',   label: 'Web Developer',    icon: FiCode,      gradient: 'from-blue-500 to-cyan-500',      desc: 'HTML, CSS, JS, React, Node.js, REST APIs' },
  { key: 'DSA / Algorithms',  label: 'DSA / Algorithms', icon: FiCpu,       gradient: 'from-indigo-500 to-purple-500',  desc: 'Data structures, sorting, graph algorithms, DP' },
  { key: 'Data Science',      label: 'Data Science',     icon: FiBarChart2, gradient: 'from-emerald-500 to-teal-500',   desc: 'Python, Pandas, statistics, SQL, ML basics' },
  { key: 'Machine Learning',  label: 'Machine Learning', icon: FiZap,       gradient: 'from-amber-500 to-orange-500',   desc: 'Neural networks, deep learning, model evaluation' },
  { key: 'Backend / Node.js', label: 'Backend Dev',      icon: FiServer,    gradient: 'from-purple-500 to-pink-500',    desc: 'APIs, databases, auth, microservices, DevOps' },
  { key: 'UI/UX Design',      label: 'UI/UX Design',     icon: FiLayout,    gradient: 'from-pink-500 to-rose-500',      desc: 'Figma, wireframes, usability, design systems' },
];

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const levelInfo = (score) => {
  if (score >= 80) return { label: 'Expert',     color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
  if (score >= 60) return { label: 'Proficient', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
  if (score >= 40) return { label: 'Developing', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
  return               { label: 'Beginner',   color: 'bg-red-500/10 text-red-400 border border-red-500/20' };
};

/* ── Step 0: Domain Picker ──────────────────────────────────────────────────── */
function DomainPicker({ onSelect }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-glow-md">
          <FiZap className="text-white text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Skill Assessment</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Select your domain to get a personalized set of up to 20 questions tailored to your track.
        </p>
      </div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {DOMAIN_CATALOGUE.map((d) => (
          <motion.button
            key={d.key}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            onClick={() => onSelect(d)}
            className="group glass-card rounded-2xl p-6 text-left hover:glass-card-hover transition-all duration-300 border border-white/[0.06] hover:border-indigo-500/20"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${d.gradient} flex items-center justify-center mb-4 shadow-glow-sm group-hover:shadow-glow-md transition-shadow`}>
              <d.icon className="text-white text-xl" />
            </div>
            <h3 className="font-semibold text-white mb-1">{d.label}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{d.desc}</p>
            <div className="flex items-center gap-1 mt-4 text-indigo-400 text-xs font-medium group-hover:text-indigo-300 transition-colors">
              Start Assessment <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Step 1: Instructions ───────────────────────────────────────────────────── */
function Instructions({ domain, questionCount, onStart, onBack }) {
  return (
    <div className="max-w-xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-6 transition-colors">
        <FiArrowLeft /> Change Domain
      </button>
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${domain.gradient} flex items-center justify-center mx-auto mb-5 shadow-glow-md`}>
          <domain.icon className="text-white text-xl" />
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{domain.label} Assessment</h2>
        <p className="text-gray-400 text-sm mb-7">{domain.desc}</p>

        <div className="grid grid-cols-2 gap-3 mb-7 text-left">
          {[
            { label: 'Domain',     value: domain.label },
            { label: 'Questions',  value: `${questionCount} (randomized)` },
            { label: 'Format',     value: 'MCQ · Rating · True/False' },
            { label: 'Difficulty', value: 'Mixed (Easy → Hard)' },
          ].map((item) => (
            <div key={item.label} className="bg-white/[0.03] rounded-xl p-3.5 border border-white/[0.06]">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{item.label}</p>
              <p className="text-sm font-semibold text-gray-200 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4 mb-7 text-left">
          <p className="text-xs font-semibold text-indigo-400 mb-1.5">📋 Instructions</p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Answer all questions honestly for accurate results.</li>
            <li>• Questions are randomly selected and shuffled each attempt.</li>
            <li>• You can submit only when all questions are answered.</li>
            <li>• Rating questions: 1 = Beginner · 5 = Expert</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-glow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
        >
          Start Assessment <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

/* ── Step 2: Questions ──────────────────────────────────────────────────────── */
function QuestionForm({ questions, domain, answers, setAnswers, onSubmit, submitting, error }) {
  const answered = Object.keys(answers).length;
  const total = questions.length;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  const handleAnswer = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Sticky progress bar */}
      <div className="glass-card rounded-2xl p-4 sticky top-4 z-20 border border-white/[0.06]">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400 font-medium">{answered} / {total} answered</span>
          <span className="text-indigo-400 font-bold">{progress}%</span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-600 mt-1.5">{domain.label} · {total} questions</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const qId = q._id;
          const isAnswered = answers[qId] !== undefined;
          return (
            <motion.div
              key={qId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`glass-card rounded-2xl p-5 border transition-all ${isAnswered ? 'border-indigo-500/20' : 'border-white/[0.06]'}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isAnswered ? 'bg-indigo-500 text-white' : 'bg-white/[0.05] text-gray-500 border border-white/10'}`}>
                  {isAnswered ? <FiCheckCircle size={13} /> : idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200 leading-relaxed">{q.question || q.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600 capitalize">{q.difficulty}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-indigo-500/70 capitalize">{q.type}</span>
                  </div>
                </div>
              </div>

              {/* MCQ */}
              {q.type === 'mcq' && (
                <div className="space-y-2 pl-10">
                  {q.options?.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${answers[qId] === opt ? 'border-indigo-500 bg-indigo-500' : 'border-white/20 group-hover:border-indigo-500/50'}`}>
                        {answers[qId] === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <input type="radio" name={`q_${qId}`} value={opt} checked={answers[qId] === opt} onChange={() => handleAnswer(qId, opt)} className="sr-only" />
                      <span className={`text-sm transition-colors ${answers[qId] === opt ? 'text-indigo-300 font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Rating 1–5 */}
              {q.type === 'rating' && (
                <div className="pl-10 flex gap-2 items-center flex-wrap">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleAnswer(qId, n)}
                      className={`w-11 h-11 rounded-xl border-2 text-sm font-bold transition-all ${
                        answers[qId] === n
                          ? 'border-indigo-500 bg-indigo-500 text-white shadow-glow-sm'
                          : 'border-white/10 text-gray-500 hover:border-indigo-500/50 hover:text-gray-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="text-xs text-gray-600 ml-1">1 = Beginner · 5 = Expert</span>
                </div>
              )}

              {/* Boolean */}
              {q.type === 'boolean' && (
                <div className="pl-10 flex gap-3">
                  {['Yes', 'No'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAnswer(qId, opt)}
                      className={`px-7 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        answers[qId] === opt
                          ? 'border-indigo-500 bg-indigo-500 text-white shadow-glow-sm'
                          : 'border-white/10 text-gray-400 hover:border-indigo-500/50 hover:text-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting || answered < total}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-glow-md transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Submitting...</>
        ) : (
          <><FiCheckCircle /> Submit Assessment</>
        )}
      </button>
      {answered < total && (
        <p className="text-center text-xs text-amber-400/70">
          {total - answered} question{total - answered !== 1 ? 's' : ''} remaining before you can submit.
        </p>
      )}
    </div>
  );
}

/* ── Step 3: Results ────────────────────────────────────────────────────────── */
function Results({ result, domain, onRetake }) {
  const scores = result?.categoryScores || [];
  const overall = result?.overallScore || 0;
  const recommendations = result?.recommendations || [];
  const { label, color } = levelInfo(overall);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Overall score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative glass-card rounded-2xl p-8 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.gradient} flex items-center justify-center mx-auto mb-4`}>
            <domain.icon className="text-white text-xl" />
          </div>
          <p className="text-gray-400 text-sm mb-1">{domain.label} · Overall Score</p>
          <p className="text-7xl font-black text-white mb-2">
            {Math.round(overall)}<span className="text-3xl text-gray-400">%</span>
          </p>
          <span className={`text-sm px-4 py-1.5 rounded-full font-semibold ${color}`}>{label}</span>
          {result?.attemptNumber && (
            <p className="text-xs text-gray-600 mt-3">Attempt #{result.attemptNumber}</p>
          )}
        </div>
      </motion.div>

      {/* Category breakdown */}
      {scores.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {scores.map((s, i) => {
              const pct = s.percentage ?? s.score ?? 0;
              const lv = levelInfo(pct);
              const barColor = pct < 40 ? 'from-red-500 to-rose-500' : pct < 70 ? 'from-amber-500 to-yellow-500' : 'from-emerald-500 to-green-500';
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-300 capitalize">{s.category}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lv.color}`}>{lv.label}</span>
                      <span className="text-sm font-bold text-gray-200">{Math.round(pct)}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/10">
          <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <FiAlertCircle /> Areas to Improve
          </h3>
          <ul className="space-y-1.5">
            {recommendations.map((r, i) => (
              <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                <span className="text-amber-500/60 mt-0.5">•</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 border border-white/10 text-gray-400 py-3 rounded-xl text-sm font-medium hover:bg-white/[0.03] hover:text-gray-200 transition flex items-center justify-center gap-2"
        >
          <FiArrowLeft /> Retake
        </button>
        <Link
          to="/student/skill-profile"
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl text-sm font-semibold hover:shadow-glow-md transition flex items-center justify-center gap-2"
        >
          View Full Profile <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────────── */
export default function SkillAssessment() {
  const [step, setStep] = useState(0); // 0=domain, 1=instructions, 2=questions, 3=results
  const [domain, setDomain] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const STEPS = ['Domain', 'Instructions', 'Questions', 'Results'];

  const handleDomainSelect = async (d) => {
    setDomain(d);
    setError('');
    setLoading(true);
    try {
      const res = await skillAPI.getQuestions({ category: d.key, limit: 30 });
      const allQ = res.data?.questions || res.data || [];
      // Shuffle and take max 20
      const shuffled = shuffleArray(allQ).slice(0, 20);
      if (shuffled.length === 0) {
        setError('No questions available for this domain yet. Please try another domain.');
        setLoading(false);
        return;
      }
      setQuestions(shuffled);
      setStep(1);
    } catch {
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const answersArr = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer: String(answer),
      }));
      const res = await skillAPI.submitAssessment({ answers: answersArr });
      setResult(res.data.result || res.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setStep(0);
    setDomain(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setError('');
  };

  if (loading) return <LoadingSpinner text={`Loading ${domain?.label || ''} questions...`} />;

  return (
    <div className="py-4">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > i ? 'bg-emerald-500 text-white'
                : step === i ? 'bg-indigo-500 text-white shadow-glow-sm'
                : 'bg-white/[0.05] text-gray-600 border border-white/10'
              }`}>
                {step > i ? <FiCheckCircle size={13} /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block transition-colors ${step === i ? 'text-indigo-400' : 'text-gray-600'}`}>{s}</span>
            </div>
            {i < 3 && <div className={`flex-1 h-px max-w-[50px] transition-all ${step > i ? 'bg-emerald-500' : 'bg-white/[0.06]'}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="domain" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <DomainPicker onSelect={handleDomainSelect} />
            {error && (
              <div className="max-w-md mx-auto mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                <FiAlertCircle /> {error}
              </div>
            )}
          </motion.div>
        )}
        {step === 1 && domain && (
          <motion.div key="instructions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Instructions
              domain={domain}
              questionCount={questions.length}
              onStart={() => setStep(2)}
              onBack={() => { setStep(0); setDomain(null); setQuestions([]); }}
            />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="questions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <QuestionForm
              questions={questions}
              domain={domain}
              answers={answers}
              setAnswers={setAnswers}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={error}
            />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Results result={result} domain={domain} onRetake={handleRetake} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
