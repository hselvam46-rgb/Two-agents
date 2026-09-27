import React, { useState } from 'react';
import { GitCompare, ChevronDown, ChevronUp, Database, Check, AlertCircle, Info } from 'lucide-react';

export default function AgentMemoryDiff({ memoryDiff, topicSemantics }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!memoryDiff) {
    return null;
  }

  const agentA = memoryDiff.agentA || {};
  const agentB = memoryDiff.agentB || {};

  return (
    <div className="memory-diff-panel">
      {/* Panel Header */}
      <div 
        className="memory-diff-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} style={{ color: 'var(--agent-alpha)' }} />
          <span style={{ fontWeight: '600', fontSize: '13.5px', color: 'var(--text-primary)' }}>
            Agent Memory Updated (OpenCog Hyperon Rule-Diff)
          </span>
          <span className="memory-diff-badge">
            Self-Modification Verified
          </span>
        </div>

        <button 
          type="button"
          className="stepper-toggle-btn"
          aria-label={isExpanded ? 'Collapse Memory Diff' : 'Expand Memory Diff'}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="memory-diff-content">
          <div className="memory-diff-grid">
            {/* Agent A Knowledge Space */}
            <div className="memory-diff-column border-agent-a">
              <div className="memory-diff-col-header">
                <span className="badge-agent-a-mini">Agent A Space (&kb-a)</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  {topicSemantics?.stanceLabelA || 'Pro-Thesis'}
                </span>
              </div>

              <div className="diff-code-block">
                {agentA.unchanged && (
                  <div className="diff-line diff-unchanged">
                    <span className="diff-sign"> </span>
                    <span className="diff-code">{agentA.unchanged}</span>
                    <span className="diff-tag">[unchanged]</span>
                  </div>
                )}
                {agentA.added && (
                  <div className="diff-line diff-added">
                    <span className="diff-sign">+</span>
                    <span className="diff-code">{agentA.added}</span>
                    <span className="diff-tag">[added via negotiation]</span>
                  </div>
                )}
              </div>
            </div>

            {/* Agent B Knowledge Space */}
            <div className="memory-diff-column border-agent-b">
              <div className="memory-diff-col-header">
                <span className="badge-agent-b-mini">Agent B Space (&kb-b)</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  {topicSemantics?.stanceLabelB || 'Antithesis & Constraints'}
                </span>
              </div>

              <div className="diff-code-block">
                {agentB.unchanged && (
                  <div className="diff-line diff-unchanged">
                    <span className="diff-sign"> </span>
                    <span className="diff-code">{agentB.unchanged}</span>
                    <span className="diff-tag">[unchanged]</span>
                  </div>
                )}
                {agentB.added && (
                  <div className="diff-line diff-added">
                    <span className="diff-sign">+</span>
                    <span className="diff-code">{agentB.added}</span>
                    <span className="diff-tag">[added via negotiation]</span>
                  </div>
                )}
                {agentB.contested && (
                  <div className="diff-line diff-contested">
                    <span className="diff-sign">!</span>
                    <span className="diff-code">{agentB.contested}</span>
                    <span className="diff-tag">[flagged constraint, retained]</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="memory-diff-footnote">
            <Info size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <span>
              <strong>MeTTa Symbolic Space Invariant:</strong> Agents do not delete opposing beliefs. Instead, continuous atomspaces self-modify by asserting conditioned bounds and referencing shared invariant predicates.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
