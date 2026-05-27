import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Eye, EyeOff, FileEdit, CheckCircle2, BrainCog, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const leftFeatures = [
  { icon: <BrainCog size={18} />, text: 'AI-powered resume scoring' },
  { icon: <CheckCircle2 size={18} />, text: 'ATS compatibility check' },
  { icon: <Target size={18} />, text: 'Skill gap detection' },
  { icon: <FileEdit size={18} />, text: 'Professional resume builder' },
];

function AuthLeftPanel({ title, sub }) {
  return (
    <div className="auth-left-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, position: 'relative', zIndex: 1 }}>
        <div className="brand-icon" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
          <BrainCircuit size={20} color="white" />
        </div>
        <span style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em' }}>ResumeAI</span>
      </div>
      <div className="auth-left-title">{title}</div>
      <div className="auth-left-sub">{sub}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, position: 'relative', zIndex: 1 }}>
        {leftFeatures.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              {f.icon}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 600, fontSize: '0.9rem' }}>{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthLeftPanel
        title="Welcome back to ResumeAI"
        sub="Sign in to access your AI-powered career tools and resume history."
      />
      <div className="auth-right-panel">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="brand-icon">
              <BrainCircuit size={20} color="white" />
            </div>
            <span className="gradient-text">ResumeAI</span>
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your career journey</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginTop: 8, justifyContent: 'center' }}
            >
              {loading ? (
                <><div className="spinner spinner-white" /> Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch" style={{ marginTop: 24, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome to ResumeAI, ${res.data.user.name.split(' ')[0]}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthLeftPanel
        title="Your AI career coach is waiting"
        sub="Join thousands of job seekers who've transformed their resumes with the power of Gemini AI."
      />
      <div className="auth-right-panel">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="brand-icon">
              <BrainCircuit size={20} color="white" />
            </div>
            <span className="gradient-text">ResumeAI</span>
          </div>

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start your AI-powered career journey today — it's free</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                minLength={2}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginTop: 8, justifyContent: 'center' }}
            >
              {loading ? (
                <><div className="spinner spinner-white" /> Creating account…</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch" style={{ marginTop: 24, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
