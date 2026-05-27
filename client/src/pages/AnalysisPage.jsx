import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle,
  Lightbulb, Tag, Briefcase, MessageSquare, User
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ScoreRing from '../components/ScoreRing';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import toast from 'react-hot-toast';

function ProgressBar({ label, value }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth(value), 100);
  }, [value]);

  const getColor = (v) => v >= 80 ? '#10B981' : v >= 60 ? '#4F46E5' : v >= 40 ? '#F59E0B' : '#EF4444';
  const color = getColor(value);

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-label">
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value}/100</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/resume/${id}`)
      .then(res => setResume(res.data.resume))
      .catch(() => toast.error('Failed to load analysis'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div><Navbar />
      <div className="page-wrapper">
        <LoadingSpinner size="lg" text="Loading your analysis…" />
      </div>
    </div>
  );

  if (!resume) return (
    <div><Navbar />
      <div className="page-wrapper">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-state-icon">🔍</div>
          <h2 style={{ marginBottom: 16 }}>Analysis not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const a = resume.analysisResult;

  const sections = [
    {
      icon: <CheckCircle2 size={17} style={{ color: '#10B981' }} />,
      title: 'Strengths',
      items: a.strengths,
      badge: 'badge-success',
      itemColor: '#10B981',
      ItemIcon: CheckCircle2,
    },
    {
      icon: <XCircle size={17} style={{ color: '#EF4444' }} />,
      title: 'Areas to Improve',
      items: a.weaknesses,
      badge: 'badge-danger',
      itemColor: '#EF4444',
      ItemIcon: XCircle,
    },
    {
      icon: <AlertTriangle size={17} style={{ color: '#F59E0B' }} />,
      title: 'Skill Gaps',
      items: a.skillGaps,
      badge: 'badge-warning',
      itemColor: '#F59E0B',
      ItemIcon: AlertTriangle,
    },
    {
      icon: <Lightbulb size={17} style={{ color: '#4F46E5' }} />,
      title: 'AI Suggestions',
      items: a.suggestions,
      badge: 'badge-primary',
      itemColor: '#4F46E5',
      numbered: true,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="analysis-page">

          {/* Header */}
          <div className="analysis-header animate-fade-in-up">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/dashboard')}
              style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={14} /> Dashboard
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, marginBottom: 6, letterSpacing: '-0.04em' }}>
                  Resume Analysis
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                  📄 {resume.fileName}
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/interview/${id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
              >
                <MessageSquare size={16} />
                Interview Prep
              </button>
            </div>

            {/* AI Summary */}
            {a.summary && (
              <div className="card" style={{ marginTop: 24, background: 'var(--primary-subtle)', borderColor: 'var(--border-accent)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={17} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.875rem', color: 'var(--primary)' }}>
                      AI Summary
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.75, fontWeight: 500 }}>
                      {a.summary}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Score cards */}
          <div className="analysis-scores animate-fade-in-up delay-1">
            <div className="score-card">
              <ScoreRing score={a.score || 0} size={110} label="Overall Score" />
            </div>
            <div className="score-card">
              <ScoreRing score={a.atsScore || 0} size={110} label="ATS Score" />
            </div>
            <div className="score-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 28px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.75rem' }}>
                Score Breakdown
              </div>
              <ProgressBar label="Overall Quality" value={a.score || 0} />
              <ProgressBar label="ATS Compatibility" value={a.atsScore || 0} />
            </div>
            {a.experienceLevel && (
              <div className="score-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 900, fontSize: '1.125rem', letterSpacing: '-0.02em' }}>{a.experienceLevel}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 3, fontWeight: 600 }}>Experience Level</div>
                </div>
              </div>
            )}
          </div>

          {/* Top skills */}
          {a.topSkills?.length > 0 && (
            <div className="analysis-section-card animate-fade-in-up delay-2" style={{ marginBottom: 20 }}>
              <div className="analysis-section-title">
                <Tag size={17} style={{ color: '#0EA5E9' }} />
                Top Skills Detected
              </div>
              <div className="keywords-cloud">
                {a.topSkills.map(skill => (
                  <span key={skill} className="badge badge-cyan" style={{ padding: '6px 14px' }}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Main analysis grid */}
          <div className="analysis-grid animate-fade-in-up delay-3">
            {sections.map((section) => (
              <div key={section.title} className="analysis-section-card">
                <div className="analysis-section-title">
                  {section.icon}
                  <span>{section.title}</span>
                  <span className={`badge ${section.badge}`} style={{ marginLeft: 'auto' }}>
                    {section.items?.length || 0}
                  </span>
                </div>
                {section.items?.map((item, i) => (
                  <div key={i} className="analysis-item">
                    {section.numbered ? (
                      <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0, minWidth: 18 }}>
                        {i + 1}.
                      </span>
                    ) : (
                      <section.ItemIcon size={14} style={{ color: section.itemColor, flexShrink: 0, marginTop: 2 }} />
                    )}
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ATS Keywords */}
          {a.keywords?.length > 0 && (
            <div className="analysis-section-card animate-fade-in-up delay-4" style={{ marginTop: 20 }}>
              <div className="analysis-section-title">
                <Tag size={17} style={{ color: 'var(--primary)' }} />
                ATS Keywords Found
              </div>
              <div className="keywords-cloud">
                {a.keywords.map(kw => (
                  <span key={kw} className="badge badge-primary" style={{ padding: '6px 14px' }}>{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ textAlign: 'center', padding: '48px 0 20px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontWeight: 500 }}>
              Ready to practice for your interview?
            </p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(`/interview/${id}`)}
            >
              <MessageSquare size={18} />
              Generate Interview Questions
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
