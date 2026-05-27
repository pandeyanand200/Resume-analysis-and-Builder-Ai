import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Technical', 'Behavioral', 'Situational', 'General'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function InterviewPage() {
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [currentInterviewId, setCurrentInterviewId] = useState(null);

  useEffect(() => {
    api.get(`/interview/${resumeId}`)
      .then(res => {
        if (res.data.interviews?.length > 0) {
          const latest = res.data.interviews[0];
          setQuestions(latest.questions);
          setJobRole(latest.jobRole);
          setCurrentInterviewId(latest._id);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [resumeId]);

  const generateQuestions = async () => {
    if (!jobRole.trim()) {
      toast.error('Please enter a target job role');
      return;
    }
    setLoading(true);
    setQuestions([]);
    setExpandedIndex(null);
    const toastId = toast.loading('AI is generating personalized interview questions…', { duration: 60000 });
    try {
      const res = await api.post('/interview/generate', { resumeId, jobRole });
      setQuestions(res.data.interview.questions);
      setCurrentInterviewId(res.data.interview.id);
      toast.dismiss(toastId);
      toast.success(`${res.data.interview.questions.length} interview questions generated! 🎯`);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const catOk = categoryFilter === 'All' || q.category === categoryFilter;
    const difOk = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    return catOk && difOk;
  });

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="interview-page">

          {/* Header */}
          <div className="interview-header animate-fade-in-up">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/analyze/${resumeId}`)}
              style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={14} /> Analysis
            </button>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={22} color="white" />
              </div>
              Interview Coach
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 500 }}>
              Generate AI-tailored interview questions based on your resume and target role
            </p>

            {/* Job role input */}
            <div className="card" style={{ background: 'var(--primary-subtle)', borderColor: 'var(--border-accent)' }}>
              <div style={{ fontWeight: 800, marginBottom: 12, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                Target Job Role
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input
                  id="job-role-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Software Engineer, Product Manager, Data Scientist…"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateQuestions()}
                  style={{ flex: 1, minWidth: 240 }}
                  disabled={loading}
                />
                <button
                  id="generate-questions-btn"
                  className="btn btn-primary"
                  onClick={generateQuestions}
                  disabled={loading || !jobRole.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                >
                  {loading ? (
                    <><div className="spinner spinner-white" /> Generating…</>
                  ) : (
                    <><Sparkles size={15} />
                      {questions.length > 0 ? 'Regenerate' : 'Generate Questions'}
                    </>
                  )}
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 10, fontWeight: 500 }}>
                💡 Be specific (e.g. "React Frontend Developer" instead of just "Developer")
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <LoadingSpinner size="lg" text="Gemini AI is crafting personalized questions for you…" />
          )}

          {/* Questions */}
          {!loading && questions.length > 0 && (
            <div className="animate-fade-in">
              {/* Stats bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Easy', 'Medium', 'Hard'].map(diff => {
                    const count = questions.filter(q => q.difficulty === diff).length;
                    const badge = { Easy: 'badge-success', Medium: 'badge-warning', Hard: 'badge-danger' };
                    return count > 0 ? (
                      <span key={diff} className={`badge ${badge[diff]}`}>{count} {diff}</span>
                    ) : null;
                  })}
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {filteredQuestions.length} of {questions.length} questions
                </span>
              </div>

              {/* Filters */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Filter by Category
                </div>
                <div className="interview-filters">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 8, marginTop: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Filter by Difficulty
                </div>
                <div className="interview-filters">
                  {DIFFICULTIES.map(diff => (
                    <button
                      key={diff}
                      className={`filter-btn ${difficultyFilter === diff ? 'active' : ''}`}
                      onClick={() => setDifficultyFilter(diff)}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards */}
              {filteredQuestions.length === 0 ? (
                <div className="card empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No questions match the selected filters</p>
                </div>
              ) : (
                filteredQuestions.map((q, i) => (
                  <QuestionCard
                    key={i}
                    question={q}
                    index={i + 1}
                    expanded={expandedIndex === i}
                    onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  />
                ))
              )}

              {/* Tips */}
              <div className="card" style={{ marginTop: 24, background: 'var(--primary-subtle)', borderColor: 'var(--border-accent)' }}>
                <div style={{ fontWeight: 800, marginBottom: 14, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                  💡 Interview Tips
                </div>
                {[
                  'Use the STAR method for behavioral questions: Situation, Task, Action, Result',
                  'Practice answering out loud, not just in your head',
                  'Research the company thoroughly before your interview',
                  'Prepare 2-3 thoughtful questions to ask the interviewer',
                  'Click each question card to reveal the model answer for guidance',
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--bg-base)' : 'none' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && questions.length === 0 && !loadingHistory && (
            <div className="card empty-state" style={{ marginTop: 12 }}>
              <div className="empty-state-icon">🎯</div>
              <h3 style={{ marginBottom: 8, fontWeight: 800 }}>Ready to Practice?</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Enter your target job role above and click "Generate Questions" to get started.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
