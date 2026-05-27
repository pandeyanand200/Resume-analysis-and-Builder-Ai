import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Clock, ChevronRight, Award, BarChart3, FileEdit, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UploadZone from '../components/UploadZone';
import ScoreRing from '../components/ScoreRing';
import api from '../services/api';
import toast from 'react-hot-toast';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/resume/history');
      setResumes(res.data.resumes);
    } catch (err) {
      toast.error('Failed to load resume history');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileSelect = async (file) => {
    setUploading(true);
    const toastId = toast.loading('Uploading and analyzing your resume with AI…', { duration: 60000 });

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.dismiss(toastId);
      toast.success('Resume analyzed successfully! 🎉');
      navigate(`/analyze/${res.data.resume.id}`);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const avgScore = resumes.length > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.analysisResult?.score || 0), 0) / resumes.length)
    : 0;

  const bestScore = resumes.length > 0
    ? Math.max(...resumes.map(r => r.analysisResult?.score || 0))
    : 0;

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="dashboard">

          {/* Header */}
          <div className="dashboard-header animate-fade-in-up">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 className="dashboard-greeting">
                  Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                </h1>
                <p className="dashboard-subtext">
                  Upload a resume to get AI-powered analysis and interview prep
                </p>
              </div>
              <Link to="/resume-builder" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <FileEdit size={16} />
                Build Resume
              </Link>
            </div>
          </div>

          {/* Quick action cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            {/* Stats */}
            {resumes.length > 0 ? [
              { icon: <FileText size={20} />, label: 'Resumes Analyzed', value: resumes.length, color: '#4F46E5', bg: 'rgba(79,70,229,0.1)' },
              { icon: <BarChart3 size={20} />, label: 'Average Score', value: `${avgScore}/100`, color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)' },
              { icon: <Award size={20} />, label: 'Best Score', value: `${bestScore}/100`, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="stat-icon-wrap" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            )) : (
              <div className="stat-card" style={{ gridColumn: '1 / -1', justifyContent: 'center', padding: '20px 24px', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <TrendingUp size={20} />
                </div>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  Upload your first resume to see your stats
                </span>
              </div>
            )}
          </div>

          {/* Upload Zone */}
          <UploadZone onFileSelect={handleFileSelect} loading={uploading} />

          {/* Resume Builder CTA */}
          <div className="card" style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 20, background: 'var(--primary-subtle)', border: '1.5px solid var(--border-accent)', flexWrap: 'wrap' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-primary-sm)' }}>
              <FileEdit size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4, color: 'var(--text-primary)' }}>Don't have a resume yet?</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Use our Resume Builder to create a professional resume from scratch with live preview and PDF export.
              </div>
            </div>
            <Link to="/resume-builder" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Plus size={16} />
              Build Resume
            </Link>
          </div>

          {/* History */}
          <div style={{ marginTop: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '-0.02em' }}>
                <Clock size={17} style={{ color: 'var(--primary)' }} />
                Recent Analyses
              </h2>
              {resumes.length > 0 && (
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loadingHistory ? (
              <div className="loading-overlay" style={{ padding: 48 }}>
                <div className="spinner spinner-lg" />
                <p>Loading history…</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="card empty-state">
                <div className="empty-state-icon">📄</div>
                <h3 style={{ marginBottom: 8, fontSize: '1.0625rem', fontWeight: 800 }}>No resumes yet</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Upload your first resume above to get AI-powered analysis
                </p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="resume-history-item"
                    onClick={() => navigate(`/analyze/${resume._id}`)}
                  >
                    <div className="resume-file-icon">
                      <FileText size={20} />
                    </div>
                    <div className="resume-history-info">
                      <div className="resume-history-name">{resume.fileName}</div>
                      <div className="resume-history-date">
                        {formatDate(resume.createdAt)}
                        {resume.analysisResult?.experienceLevel && (
                          <span style={{ marginLeft: 8 }}>
                            <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                              {resume.analysisResult.experienceLevel}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="score-pill">
                      <ScoreRing score={resume.analysisResult?.score || 0} size={52} animate={false} />
                      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
