import React, { useState } from 'react';
import { Copy, Check, RotateCw, TrendingUp, AlertTriangle } from 'lucide-react';
import ThinkingSteps from './ThinkingSteps';
import SourceCards from './SourceCards';
import AgentComparison from './AgentComparison';
import NegotiationStepper from './NegotiationStepper';
import AgentMemoryDiff from './AgentMemoryDiff';
import FollowUpSuggestions from './FollowUpSuggestions';

export default function ChatMessage({ 
  message, 
  onSelectSource, 
  onCitationClick, 
  onRetry,
  onToast 
}) {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    const textToCopy = message.consensus || message.content || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onToast) onToast('Copied consensus response to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="message-row user">
        <div className="user-bubble">
          {message.content}
        </div>
      </div>
    );
  }

  // Extract dynamic topic semantics for opposing agent identities
  const topicSemantics = message.mettaNegotiation?.topicSemantics;
  const stanceA = topicSemantics?.stanceLabelA || 'Supports Premise';
  const stanceB = topicSemantics?.stanceLabelB || 'Flags Critical Boundaries';

  // Assistant Response
  return (
    <div className="message-row assistant">
      {/* Opposing Agent Header Avatars (Green for Supports, Red/Orange for Critical/Anti) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="agent-avatar-badge avatar-agent-a" title={`Agent A: ${stanceA}`} style={{ width: '28px', height: '28px', fontSize: '13px' }}>
            <TrendingUp size={15} />
          </div>
          <div className="agent-avatar-badge avatar-agent-b" title={`Agent B: ${stanceB}`} style={{ width: '28px', height: '28px', fontSize: '13px', marginLeft: '-6px' }}>
            <AlertTriangle size={14} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
            Two Agents, One Truth
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--agent-alpha)', fontWeight: '600' }}>Agent A</span> ({stanceA}) 
            <span style={{ margin: '0 6px', color: 'var(--text-tertiary)' }}>⇄</span> 
            <span style={{ color: 'var(--agent-beta)', fontWeight: '600' }}>Agent B</span> ({stanceB})
          </span>
        </div>
      </div>

      {/* 1. Expandable Live Thinking & Collaboration Steps */}
      <ThinkingSteps 
        steps={message.steps} 
        isStreaming={message.isStreaming} 
        duration={message.duration} 
      />

      {/* 2. Perplexity/Claude Style Source Cards */}
      <SourceCards 
        sources={message.sources}
        agent1Sources={message.agent1Sources}
        agent2Sources={message.agent2Sources}
        onSelectSource={onSelectSource}
      />

      {/* 3. Missing UI Piece: Negotiation Stepper ([Round 1] -> [Round 2] -> [Round 3] -> [✓ Consensus]) */}
      {message.mettaNegotiation?.structuredRounds && (
        <NegotiationStepper 
          rounds={message.mettaNegotiation.structuredRounds}
          isStreaming={message.isStreaming}
          onCitationClick={onCitationClick}
        />
      )}

      {/* 4. Multi-View Consensus, MeTTa Transcript & Belief Splitter */}
      <AgentComparison 
        consensus={message.consensus}
        sources={message.sources}
        kbX={message.kbX}
        kbY={message.kbY}
        mettaNegotiation={message.mettaNegotiation}
        onCitationClick={onCitationClick}
      />

      {/* 5. MeTTa Rule-Diff Panel ("Agent Memory Updated") */}
      {message.mettaNegotiation?.memoryDiff && (
        <AgentMemoryDiff 
          memoryDiff={message.mettaNegotiation.memoryDiff}
          topicSemantics={topicSemantics}
        />
      )}

      {/* 6. Contextual Follow-Up Suggestions (ChatGPT Style) */}
      {!message.isStreaming && (message.mettaNegotiation?.followUpSuggestions || topicSemantics?.followUpSuggestions) && (
        <FollowUpSuggestions 
          suggestions={message.mettaNegotiation?.followUpSuggestions || topicSemantics?.followUpSuggestions}
          onSelect={onRetry}
        />
      )}

      {/* 7. Bottom Actions Toolbar */}
      {!message.isStreaming && message.consensus && (
        <div className="message-actions-bar">
          <button className="action-icon-btn" onClick={handleCopy} title="Copy response">
            {copied ? <Check size={14} style={{ color: 'var(--accent-chatgpt)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onRetry && (
            <button className="action-icon-btn" onClick={() => onRetry(message.originalQuery)} title="Re-deliberate">
              <RotateCw size={14} />
              <span>Re-deliberate</span>
            </button>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
            <span>Resolved via MeTTa symbolic dialectic negotiation</span>
          </div>
        </div>
      )}
    </div>
  );
}
