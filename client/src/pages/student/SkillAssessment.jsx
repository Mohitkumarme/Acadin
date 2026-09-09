import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiArrowLeft, FiZap, FiAlertCircle } from 'react-icons/fi';
import { skillAPI } from '../../api/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

// ─── Step 1: Instructions ───────────────────────────────────────────────
function Instructions({ categories, onStart }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <FiZap className="text-primary text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill Assessment</h1>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          This assessment evaluates your skills across multiple categories. Answer honestly for the most accurate results.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          {[
            { label: 'Categories', value: categories.length || '—' },
            { label: 'Format', value: 'MCQ + Rating' },
            { label: 'Duration', value: '20–30 minutes' },
            { label: 'Questions', value: '30' },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium uppercase">{item.label}</p>
              <p className="text-base font-semibold text-gray-800 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
        {categories.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-indigo-700 mb-2">Categories Covered:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c, i) => (
                <span key={i} className="text-xs bg-white border border-indigo-200 text-indigo-600 px-3 py-1 rounded-full">
                  {typeof c === 'string' ? c : c.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={onStart}
          className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition flex items-center gap-2 mx-auto"
        >
          Start Assessment <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Question Form ───────────────────────────────────────────────
function QuestionForm({ questions, answers, setAnswers, onSubmit, submitting }) {
  const answered = Object.keys(answers).length;
  const total = questions.length;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  // Always use q._id (MongoDB ObjectId) as the answer key
  const handleAnswer = (qId, value) => setAnswers((prev) => ({ ...prev, [qId]: value }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-4 z-10">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">{answered} of {total} answered</span>
          <span className="font-semibold text-primary">{progress}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const qId = q._id; // always use MongoDB _id
          return (
            <div key={qId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 text-primary text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">{q.question || q.text}</p>
                  <span className="text-xs text-gray-400 mt-0.5 inline-block capitalize">{q.category} · {q.difficulty}</span>
                </div>
              </div>

              {/* MCQ */}
              {q.type === 'mcq' && (
                <div className="space-y-2 pl-10">
                  {q.options?.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={`q_${qId}`}
                        value={opt}
                        checked={answers[qId] === opt}
                        onChange={() => handleAnswer(qId, opt)}
                        className="accent-indigo-600 w-4 h-4"
                      />
                      <span className={`text-sm ${answers[qId] === opt ? 'text-primary font-medium' : 'text-gray-700'} group-hover:text-gray-900`}>{opt}</span>
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
                      className={`w-10 h-10 rounded-lg border-2 text-sm font-semibold transition ${
                        answers[qId] === n
                          ? 'bg-primary border-primary text-white'
                          : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="text-xs text-gray-400 ml-1">1=Beginner · 5=Expert</span>
                </div>
              )}

              {/* Boolean Yes/No */}
              {q.type === 'boolean' && (
                <div className="pl-10 flex gap-3">
                  {['Yes', 'No'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAnswer(qId, opt)}
                      className={`px-6 py-2 rounded-lg border-2 text-sm font-medium transition ${
                        answers[qId] === opt
                          ? 'bg-primary border-primary text-white'
                          : 'border-gray-200 text-gray-600 hover:border-primary'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting || answered < total}
        className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? 'Submitting...' : 'Submit Assessment'}
        {!submitting && <FiCheckCircle />}
      </button>
      {answered < total && (
        <p className="text-center text-xs text-amber-600">
          Please answer all {total} questions before submitting. ({total - answered} remaining)
        </p>
      )}
    </div>
  );
}

// ─── Step 3: Results ──────────────────────────────────────────────────────
function Results({ result, onRetake }) {
  // Backend returns { categoryScores, overallScore, recommendations }
  const scores = result?.categoryScores || [];
  const overall = result?.overallScore || 0;
  const recommendations = result?.recommendations || [];

  const levelLabel = (score) => {
    if (score >= 80) return { label: 'Expert',     color: 'text-green-600 bg-green-100' };
    if (score >= 60) return { label: 'Proficient', color: 'text-blue-600 bg-blue-100' };
    if (score >= 40) return { label: 'Developing', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Beginner', color: 'text-red-600 bg-red-100' };
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Overall score */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white text-center">
        <p className="text-sm font-medium text-indigo-200 mb-1">Overall Skill Score</p>
        <p className="text-6xl font-black mb-2">{Math.round(overall)}<span className="text-3xl">%</span></p>
        <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
          {levelLabel(overall).label}
        </span>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {scores.map((s, i) => {
            const pct = s.percentage ?? s.score ?? 0;
            const lv = levelLabel(pct);
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-gray-700 capitalize">{s.category}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lv.color}`}>{lv.label}</span>
                    <span className="text-sm font-bold text-gray-800">{Math.round(pct)}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct < 40 ? 'bg-red-400' : pct < 70 ? 'bg-yellow-400' : 'bg-green-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <FiAlertCircle /> Improvement Areas
          </h3>
          <ul className="space-y-1">
            {recommendations.map((r, i) => (
              <li key={i} className="text-sm text-amber-700">• {r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <FiArrowLeft /> Retake Assessment
        </button>
        <a
          href="/student/skill-profile"
          className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2"
        >
          View Full Profile <FiArrowRight />
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function SkillAssessment() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([skillAPI.getCategories(), skillAPI.getQuestions()])
      .then(([catRes, qRes]) => {
        // categories is an array of strings from backend
        setCategories(catRes.data?.categories || catRes.data || []);
        setQuestions(qRes.data?.questions || qRes.data || []);
      })
      .catch(() => setError('Failed to load assessment. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      // Build answers array using MongoDB _id as questionId
      const answersArr = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer: String(answer),
      }));
      const res = await skillAPI.submitAssessment({ answers: answersArr });
      // Backend returns { message, result: { categoryScores, overallScore, recommendations } }
      setResult(res.data.result || res.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setStep(1);
    setAnswers({});
    setResult(null);
    setError('');
  };

  if (loading) return <LoadingSpinner text="Loading assessment..." />;

  if (error && step !== 2) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6">
          <FiAlertCircle className="text-3xl mx-auto mb-2" />
          <p className="text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {['Instructions', 'Questions', 'Results'].map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? <FiCheckCircle /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-primary' : 'text-gray-400'}`}>{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px max-w-[60px] ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {error && step === 2 && (
        <div className="max-w-3xl mx-auto mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <FiAlertCircle /> {error}
        </div>
      )}

      {step === 1 && <Instructions categories={categories} onStart={() => setStep(2)} />}
      {step === 2 && (
        <QuestionForm
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
      {step === 3 && <Results result={result} onRetake={handleRetake} />}
    </div>
  );
}
