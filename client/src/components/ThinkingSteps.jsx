import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Loader2, Compass, ShieldCheck, Scale, Sparkles } from 'lucide-react';

export default function ThinkingSteps({ steps = [], isStreaming = false, duration = 0 }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!steps || steps.length === 0) return null;

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const isAllComplete = !isStreaming && completedSteps === steps.length;

  const getAgentIcon = (agent) => {
    switch (agent) {
      case 'agent1':
        return <Compass size={13} style={{ color: 'var(--agent-alpha)' }} />;
      case 'agent2':
        return <ShieldCheck size={13} style={{ color: 'var(--agent-beta)' }} />;
      case 'consensus':
        return <Scale size={13} style={{ color: 'var(--agent-consensus)' }} />;
      default:
        return <Sparkles size={13} style={{ color: 'var(--text-tertiary)' }} />;
    }
  };

  const getAgentLabel = (agent) => {
    switch (agent) {
      case 'agent1':
        return <span className="step-agent-tag tag-agent1">Alpha (Explorer)</span>;
      case 'agent2':
        return <span className="step-agent-tag tag-agent2">Beta (Verifier)</span>;
      case 'consensus':
        return <span className="step-agent-tag tag-consensus">Consensus Engine</span>;
      default:
        return <span className="step-agent-tag tag-system">System</span>;
    }
  };

  return (
    <div className={`steps-container ${isStreaming ? 'active-run' : ''}`}>
      <button 
        className="steps-toggle-header" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="steps-header-left">
          {isStreaming ? (
            <Loader2 size={16} className="status-dot active" style={{ color: 'var(--accent-chatgpt)', animation: 'spinSlow 1.5s linear infinite' }} />
          ) : (
            <CheckCircle2 size={16} style={{ color: 'var(--accent-chatgpt)' }} />
          )}
          <span>
            {isStreaming 
              ? `Deliberating across 2 agents... (${completedSteps}/${steps.length} steps complete)` 
              : `Deliberated across 2 agents & verified consensus (${duration > 0 ? (duration / 1000).toFixed(1) + 's' : 'Complete'})`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
            {isOpen ? 'Collapse' : 'Show steps'}
          </span>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="steps-list">
          {steps.map((step, idx) => (
            <div className="step-item" key={step.id || idx}>
              <div className={`step-indicator ${step.status}`}>
                {step.status === 'completed' && <CheckCircle2 size={15} />}
                {step.status === 'in-progress' && <Loader2 size={15} />}
                {step.status === 'pending' && <span style={{ fontSize: '10px' }}>{idx + 1}</span>}
              </div>

              <div className="step-body">
                <div className="step-title-line">
                  {getAgentIcon(step.agent)}
                  <span>{step.title}</span>
                  {getAgentLabel(step.agent)}
                </div>
                {step.detail && <div className="step-detail">{step.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
