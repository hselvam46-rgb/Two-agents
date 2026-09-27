import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronDown, ChevronUp, ExternalLink, Sparkles, Scale, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function NegotiationStepper({ 
  rounds = [], 
  isStreaming = false, 
  onCitationClick 
}) {
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!rounds || rounds.length === 0) {
    return null;
  }

  const currentRound = rounds[activeRoundIndex] || rounds[0];

  return (
    <div className="negotiation-stepper-container">
      {/* Header with collapse toggle */}
      <div className="stepper-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={16} style={{ color: 'var(--accent-chatgpt)' }} />
          <span style={{ fontWeight: '600', fontSize: '13.5px', color: 'var(--text-primary)' }}>
            MeTTa Dialectic Negotiation Process
          </span>
          <span className="stepper-status-badge">
            {isStreaming ? 'Negotiating Live...' : 'Consensus Reached'}
          </span>
        </div>

        <button 
          type="button"
          className="stepper-toggle-btn"
          aria-label={isExpanded ? 'Collapse Stepper' : 'Expand Stepper'}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="stepper-body">
          {/* Horizontal Stepper Steps */}
          <div className="stepper-track">
            {rounds.map((r, idx) => {
              const isSelected = activeRoundIndex === idx;
              const isFinal = idx === rounds.length - 1;

              return (
                <React.Fragment key={r.roundNum || idx}>
                  <button
                    type="button"
                    className={`stepper-pill ${isSelected ? 'selected' : ''} ${r.color === 'green' ? 'agent-a' : 'agent-b'} ${isFinal ? 'consensus-pill' : ''}`}
                    onClick={() => setActiveRoundIndex(idx)}
                    title={`Click to view Round ${r.roundNum}`}
                  >
                    {isFinal ? (
                      <CheckCircle2 size={13} style={{ color: 'var(--accent-chatgpt)', marginRight: '4px' }} />
                    ) : (
                      <span className="stepper-round-num">R{r.roundNum}</span>
                    )}
                    <span className="stepper-pill-label">
                      {isFinal ? 'Consensus' : `Round ${r.roundNum}`}
                    </span>
                  </button>

                  {idx < rounds.length - 1 && (
                    <div className="stepper-arrow">
                      <ChevronRight size={14} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active Round Details Card */}
          <div className={`stepper-detail-card ${currentRound.color === 'green' ? 'border-agent-a' : 'border-agent-b'}`}>
            <div className="stepper-card-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`stepper-agent-badge ${currentRound.color === 'green' ? 'badge-agent-a' : 'badge-agent-b'}`}>
                  {currentRound.speaker}
                </span>
                <span className="stepper-speaker-label">
                  {currentRound.speakerLabel}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {currentRound.confidence && (
                  <span className="stepper-confidence-tag">
                    Confidence: {Math.round(currentRound.confidence * 100)}%
                  </span>
                )}
                {currentRound.sourceIndex && (
                  <button 
                    type="button"
                    className="citation-pill"
                    onClick={() => onCitationClick && onCitationClick(currentRound.sourceIndex)}
                    title={`Inspect cited evidence from ${currentRound.sourceDomain}`}
                  >
                    Source [{currentRound.sourceIndex}] · {currentRound.sourceDomain}
                  </button>
                )}
              </div>
            </div>

            {/* Action title */}
            <div className="stepper-action-label">
              {currentRound.action}
            </div>

            {/* Statement / Claim */}
            <div className="stepper-claim-text">
              "{currentRound.claim}"
            </div>

            {/* Premise Challenge Box */}
            {currentRound.challenge && (
              <div className="stepper-challenge-box">
                <AlertTriangle size={14} style={{ color: 'var(--agent-beta)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: '600', color: 'var(--agent-beta)' }}>Counter-Challenge: </span>
                  <span>{currentRound.challenge}</span>
                </div>
              </div>
            )}

            {/* Conceded Variable Box */}
            {currentRound.newFact && (
              <div className="stepper-variable-box">
                <Sparkles size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: '600', color: 'var(--gold)' }}>Introduced Critical Variable: </span>
                  <code>{currentRound.newFact}</code>
                </div>
              </div>
            )}

            {/* Shared Invariant Fact */}
            {currentRound.sharedFact && (
              <div className="stepper-shared-box">
                <CheckCircle2 size={14} style={{ color: 'var(--accent-chatgpt)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: '600', color: 'var(--accent-chatgpt)' }}>Shared Invariant Realization: </span>
                  <span>"{currentRound.sharedFact}"</span>
                </div>
              </div>
            )}

            {/* MeTTa Trace */}
            {currentRound.mettaTrace && (
              <div className="stepper-metta-trace">
                <span className="stepper-metta-tag">MeTTa Trace:</span>
                <code>{currentRound.mettaTrace}</code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
