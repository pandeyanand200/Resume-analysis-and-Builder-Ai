import React, { useEffect, useRef, useState } from 'react';

export default function ScoreRing({ score, label, size = 120, color = 'url(#scoreGrad)', animate = true }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (displayScore / 100) * circumference;

  useEffect(() => {
    if (!animate) { setDisplayScore(score); return; }
    let start = null;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score, animate]);

  const getColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#6366f1';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const ringColor = getColor();
  const uniqueId = `grad-${label?.replace(/\s/g, '')}`;

  return (
    <div className="score-ring-wrapper">
      <svg
        width={size}
        height={size}
        className="score-ring-svg"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={ringColor} />
            <stop offset="100%" stopColor={ringColor} stopOpacity="0.6" />
          </linearGradient>
          <filter id={`glow-${uniqueId}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-surface-3)"
          strokeWidth={8}
        />
        {/* Foreground arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${uniqueId})`}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.05s ease', filter: `url(#glow-${uniqueId})` }}
        />
        {/* Center text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          style={{
            fill: 'var(--text-primary)',
            fontSize: size * 0.22,
            fontWeight: 800,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {displayScore}
        </text>
      </svg>
      {label && <div className="score-ring-label">{label}</div>}
    </div>
  );
}
