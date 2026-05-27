import { Link } from 'react-router-dom';
import {
  BrainCircuit, FileSearch, Target, MessageSquare,
  CheckCircle2, TrendingUp, ShieldCheck, Zap, ArrowRight, Star, FileEdit, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';

const features = [
  {
    icon: '🔍',
    title: 'Smart Resume Analysis',
    desc: 'AI scoring across 15+ dimensions — content, formatting, impact, and more.',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.1)',
  },
  {
    icon: '🛡️',
    title: 'ATS Compatibility Check',
    desc: 'Know exactly how Applicant Tracking Systems score your resume before it reaches a recruiter.',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.1)',
  },
  {
    icon: '🎯',
    title: 'Skill Gap Detection',
    desc: 'Identify missing skills and certifications that top candidates in your field possess.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.1)',
  },
  {
    icon: '💬',
    title: 'Interview Coach',
    desc: 'Get 12 personalized AI-generated interview questions with model answers for your target role.',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
  },
  {
    icon: '📈',
    title: 'Improvement Roadmap',
    desc: 'Prioritized actionable suggestions to dramatically improve your resume quality.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    desc: 'Comprehensive analysis in under 30 seconds. No waiting, no manual review needed.',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.1)',
  },
];

const howItWorks = [
  { step: '01', title: 'Upload Your Resume', desc: 'Drag and drop your PDF resume into our secure AI-powered uploader.' },
  { step: '02', title: 'AI Analyzes It', desc: 'Gemini AI performs a deep multi-dimensional analysis of your career story.' },
  { step: '03', title: 'Get Your Score', desc: 'Receive detailed scores, skill gaps, strengths, and ATS compatibility rating.' },
  { step: '04', title: 'Practice Interviews', desc: 'Generate tailored interview questions with expert model answers.' },
];

export default function LandingPage() {
  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow animate-fade-in-down">
            <div className="dot" />
            Powered by Google Gemini AI
          </div>

          <h1 className="hero-title">
            Land Your Dream Job with an{' '}
            <span className="gradient-text">AI-Powered</span>{' '}
            Resume Coach
          </h1>

          <p className="hero-subtitle">
            Upload your resume and get instant AI analysis, ATS score, skill gap detection,
            and personalized interview prep — all in under 30 seconds.
          </p>

          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg animate-fade-in-up delay-3">
              Analyze My Resume Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/resume-builder" className="btn btn-secondary btn-lg animate-fade-in-up delay-4">
              <FileEdit size={17} />
              Build a Resume
            </Link>
          </div>

          <div className="hero-stats animate-fade-in-up delay-5">
            {[
              { value: '95%', label: 'Analysis Accuracy' },
              { value: '12+', label: 'Interview Questions' },
              { value: '30s', label: 'Analysis Time' },
              { value: '100%', label: 'Free to Start' },
            ].map((stat) => (
              <div key={stat.label} className="hero-stat">
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section className="features-section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Star size={10} fill="currentColor" /> Features
            </div>
            <h2 className="section-title">
              Everything You Need to{' '}
              <span className="gradient-text">Get Hired</span>
            </h2>
            <p className="section-subtitle">
              Our AI doesn't just scan — it understands your career story and gives you
              the competitive edge you need.
            </p>
          </div>

          {/* Featured bento card */}
          <div style={{ maxWidth: 1100, margin: '0 auto 20px' }}>
            <div className="bento-card featured" style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div className="bento-icon" style={{ background: 'rgba(255,255,255,0.2)', width: 48, height: 48, marginBottom: 0 }}>
                    <FileEdit size={24} color="white" />
                  </div>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>NEW</span>
                </div>
                <div className="bento-title" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>
                  Resume Builder
                </div>
                <div className="bento-desc" style={{ marginTop: 10, fontSize: '1rem' }}>
                  Build a stunning professional resume from scratch with our live editor. 3 templates, real-time preview, and one-click PDF export.
                </div>
                <Link to="/resume-builder" className="btn" style={{ marginTop: 20, background: 'white', color: 'var(--primary)', fontWeight: 800 }}>
                  Start Building <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{ flex: 1, minWidth: 220, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 20, width: 220 }}>
                  {['Personal Info', 'Work Experience', 'Education', 'Skills', 'Summary'].map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                      <CheckCircle2 size={14} color="rgba(255,255,255,0.8)" />
                      <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: 600 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bento-grid">
            {features.map((f, i) => (
              <div key={f.title} className="bento-card animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="bento-icon" style={{ background: f.bg, color: f.color }}>
                  <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                </div>
                <div className="bento-title">{f.title}</div>
                <div className="bento-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-base)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Process</div>
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
            <p className="section-subtitle">Four simple steps to transform your job search</p>
          </div>

          <div className="steps-grid">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="step-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="step-number">{item.step}</span>
                <div className="step-title">{item.title}</div>
                <div className="step-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px', boxShadow: 'var(--shadow-primary)'
          }}>
            <Sparkles size={36} color="white" />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16, fontWeight: 900, letterSpacing: '-0.04em' }}>
            Ready to <span className="gradient-text">Supercharge</span> Your Job Search?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '1.0625rem', fontWeight: 500 }}>
            Join thousands of job seekers who've transformed their career prospects with AI.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-tertiary)',
        fontSize: '0.875rem',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <BrainCircuit size={16} style={{ color: 'var(--primary)' }} />
          <strong style={{ color: 'var(--text-primary)', fontWeight: 800 }}>ResumeAI</strong>
        </div>
        © {new Date().getFullYear()} ResumeAI — Powered by Google Gemini
      </footer>
    </div>
  );
}
