import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function FollowUpSuggestions({ suggestions = [], onSelect }) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="followup-container">
      <div className="followup-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} style={{ color: 'var(--accent-chatgpt)' }} />
          <span className="followup-title">
            Suggested Next Research
          </span>
        </div>
        <span className="followup-subtitle">
          Click to explore next angle
        </span>
      </div>

      <div className="followup-grid">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            className="followup-card"
            onClick={() => onSelect && onSelect(suggestion)}
            title={`Investigate: "${suggestion}"`}
          >
            <Compass size={14} className="followup-icon" />
            <span className="followup-text">{suggestion}</span>
            <ArrowRight size={14} className="followup-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
}
