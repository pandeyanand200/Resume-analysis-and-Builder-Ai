import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const difficultyColors = {
  Easy: 'badge-success',
  Medium: 'badge-warning',
  Hard: 'badge-danger',
};

const categoryColors = {
  Technical: 'badge-primary',
  Behavioral: 'badge-cyan',
  Situational: 'badge-warning',
  General: 'badge-violet',
};

export default function QuestionCard({ question, index, expanded, onToggle }) {
  return (
    <div className="question-card animate-fade-in-up" style={{ animationDelay: `${index * 0.04}s` }}>
      <div className="question-card-header" onClick={onToggle}>
        <div className="question-number">{index}</div>
        <div style={{ flex: 1 }}>
          <div className="question-text">{question.question}</div>
          <div className="question-meta">
            <span className={`badge ${difficultyColors[question.difficulty] || 'badge-primary'}`}>
              {question.difficulty}
            </span>
            <span className={`badge ${categoryColors[question.category] || 'badge-primary'}`}>
              {question.category}
            </span>
          </div>
        </div>
        <div style={{ color: 'var(--text-tertiary)', flexShrink: 0, transition: 'transform 200ms ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <ChevronDown size={18} />
        </div>
      </div>
      {expanded && (
        <div className="question-answer animate-fade-in">
          <div style={{ marginBottom: 10, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            💡 Model Answer
          </div>
          <div style={{ whiteSpace: 'pre-line' }}>{question.modelAnswer}</div>
        </div>
      )}
    </div>
  );
}
