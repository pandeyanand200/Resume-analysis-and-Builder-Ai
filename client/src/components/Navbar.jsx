import React from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {  LayoutDashboard, LogOut, FileEdit } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
        <div className="brand-icon">
         < img   src={logo}
        alt="Resume Analysis AI Logo"
        style={{  width: "40px",
    height: "40px",
    objectFit: "contain",
    borderRadius: "8px" }} />
        </div>
        <span className="gradient-text">Resume Analysis AI</span>
      </Link>

      <div className="navbar-nav">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
            <Link
              to="/resume-builder"
              className={`nav-link ${isActive('/resume-builder') ? 'active' : ''}`}
            >
              <FileEdit size={15} />
              Resume Builder
            </Link>
            <div className="nav-divider" />
            <div className="nav-user">
              <div className="user-avatar" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                title="Logout"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}
