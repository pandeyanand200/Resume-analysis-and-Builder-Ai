import React from 'react';

export default function LoadingSpinner({ size = 'sm', text }) {
  return (
    <div className="loading-overlay">
      <div className={`spinner ${size === 'lg' ? 'spinner-lg' : ''}`} />
      {text && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</p>}
    </div>
  );
}
