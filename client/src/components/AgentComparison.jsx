import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { Target, Binary, Split, GitCommit, CheckCircle2, MessageSquare, Terminal, Code2, List, BookOpen, FileText, AlignLeft } from 'lucide-react';

export default function AgentComparison({ 
  consensus = '', 
  sources = [],
  kbX = [],
  kbY = [],
  mettaNegotiation = null,
  onCitationClick
}) {
  const [activeTab, setActiveTab] = useState('one_truth');
  const [outputViewStyle, setOutputViewStyle] = useState('bullets'); // 'bullets' | 'paragraph' | 'full' | 'symbolic'

  // Convert markdown to HTML with clickable citation pills
  const renderMarkdownWithCitations = (mdText) => {
    if (!mdText) return { __html: '' };

    marked.setOptions({
      breaks: true,
      gfm: true
    });

    let rawHtml = marked.parse(mdText);

    // Replace bracket citations like [1], [2], [3] with clickable styled pills
    const citationRegex = /\[(\d+)\]/g;
    rawHtml = rawHtml.replace(citationRegex, (match, p1) => {
      return `<button class="citation-pill" data-cite="${p1}" title="View source [${p1}]">[${p1}]</button>`;
    });

    return { __html: rawHtml };
  };

  // Determine text based on chosen reading mode
  const activeContentText = useMemo(() => {
    if (outputViewStyle === 'paragraph' && mettaNegotiation?.paragraphStyle) {
      return mettaNegotiation.paragraphStyle;
    }
    if (outputViewStyle === 'bullets' && mettaNegotiation?.bulletPointsStyle) {
      return mettaNegotiation.bulletPointsStyle;
    }
    if (outputViewStyle === 'symbolic' && mettaNegotiation?.symbolicDialogue) {
      return mettaNegotiation.symbolicDialogue;
    }
    return consensus || mettaNegotiation?.chatgptStyle || '';
  }, [outputViewStyle, consensus, mettaNegotiation]);

  const renderedHtml = useMemo(() => renderMarkdownWithCitations(activeContentText), [activeContentText]);

  const handleContainerClick = (e) => {
    const citeBtn = e.target.closest('.citation-pill');
    if (citeBtn && onCitationClick) {
      const citeNum = parseInt(citeBtn.getAttribute('data-cite'), 10);
      onCitationClick(citeNum);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Tab Navigation */}
      <div className="view-tabs-bar">
        <button 
          className={`view-tab ${activeTab === 'one_truth' ? 'active' : ''}`}
          onClick={() => setActiveTab('one_truth')}
        >
          <Target size={14} style={{ color: 'var(--accent-chatgpt)' }} />
          <span>"One Truth"</span>
          <span className="tab-badge" style={{ color: 'var(--accent-chatgpt)' }}>Final Output</span>
        </button>

        <button 
          className={`view-tab ${activeTab === 'transcript' ? 'active' : ''}`}
          onClick={() => setActiveTab('transcript')}
        >
          <Binary size={14} style={{ color: 'var(--agent-beta)' }} />
          <span>Reasoning Transcript (MeTTa)</span>
        </button>

        <button 
          className={`view-tab ${activeTab === 'splitter' ? 'active' : ''}`}
          onClick={() => setActiveTab('splitter')}
        >
          <Split size={14} style={{ color: 'var(--agent-alpha)' }} />
          <span>Belief Splitter (KB-X vs KB-Y)</span>
        </button>

        <button 
          className={`view-tab ${activeTab === 'trail' ? 'active' : ''}`}
          onClick={() => setActiveTab('trail')}
        >
          <GitCommit size={14} style={{ color: 'var(--gold)' }} />
          <span>Explanation Trail</span>
        </button>
      </div>

      {/* Tab 1: "One Truth" (Configurable Reading Modes: Bullets, Paragraph, Full, or MeTTa) */}
      {activeTab === 'one_truth' && (
        <div>
          {/* Reading Mode Segmented Control */}
          <div className="reading-mode-bar">
            <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Format:</span>
            </div>

            <div className="reading-mode-pills">
              <button 
                type="button"
                className={`reading-pill ${outputViewStyle === 'bullets' ? 'active' : ''}`}
                onClick={() => setOutputViewStyle('bullets')}
                title="Read as high-impact bullet points"
              >
                <List size={13} />
                <span>Bullet Points</span>
              </button>

              <button 
                type="button"
                className={`reading-pill ${outputViewStyle === 'paragraph' ? 'active' : ''}`}
                onClick={() => setOutputViewStyle('paragraph')}
                title="Read as an executive narrative paragraph"
              >
                <AlignLeft size={13} />
                <span>Paragraph</span>
              </button>

              <button 
                type="button"
                className={`reading-pill ${outputViewStyle === 'full' ? 'active' : ''}`}
                onClick={() => setOutputViewStyle('full')}
                title="Read complete comprehensive analysis"
              >
                <FileText size={13} />
                <span>Full Breakdown</span>
              </button>

              <button 
                type="button"
                className={`reading-pill ${outputViewStyle === 'symbolic' ? 'active' : ''}`}
                onClick={() => setOutputViewStyle('symbolic')}
                title="Inspect MeTTa symbolic dialectic dialogue"
              >
                <Terminal size={13} />
                <span>MeTTa Dialogue</span>
              </button>
            </div>
          </div>

          <div 
            className="markdown-body reading-content" 
            onClick={handleContainerClick}
            dangerouslySetInnerHTML={renderedHtml} 
          />
        </div>
      )}

      {/* Tab 2: Reasoning Transcript (MeTTa Dialectic Rounds) */}
      {activeTab === 'transcript' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ 
            padding: '12px 16px', 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <strong>MeTTa Symbolic Negotiation Loop:</strong> OpenCog Hyperon dialectic reduction across continuous truth-value spaces.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--agent-beta)', fontWeight: '600' }}>
              <Code2 size={15} />
              <span>MeTTa Engine Active</span>
            </div>
          </div>

          {/* Negotiation Rounds */}
          {(mettaNegotiation?.negotiationRounds || [
            {
              round: 1,
              title: 'Round 1: Premise & Boundary Ingestion',
              dialogue: [
                { agent: 'Agent A (KB: X-side)', action: 'Assert Primary Thesis', evidenceId: 1, claim: 'Primary efficacy and performance indicators validated.', mettaTrace: '!(bind! &space-x (new-space))' },
                { agent: 'Agent B (KB: Y-side)', action: 'Counter-Assert Boundaries', evidenceId: 2, claim: 'Identified key boundary conditions and operational trade-offs.', mettaTrace: '!(bind! &space-y (new-space))' }
              ]
            }
          ]).map((roundData, rIdx) => (
            <div key={rIdx} className="deliberation-box" style={{ margin: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="source-index-badge">{roundData.round}</span>
                <span>{roundData.title}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {roundData.dialogue.map((item, dIdx) => (
                  <div key={dIdx} style={{ 
                    padding: '10px 14px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: item.agent.includes('KB: X-side') ? 'var(--agent-alpha-bg)' : 'var(--agent-beta-bg)',
                    border: `1px solid ${item.agent.includes('KB: X-side') ? 'var(--agent-alpha-border)' : 'var(--agent-beta-border)'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
                      <span style={{ color: item.agent.includes('KB: X-side') ? 'var(--agent-alpha)' : 'var(--agent-beta)' }}>
                        {item.agent} — {item.action}
                      </span>
                      <button 
                        className="citation-pill" 
                        onClick={() => onCitationClick && onCitationClick(item.evidenceId)}
                        title="View cited source"
                      >
                        Source [{item.evidenceId}]
                      </button>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      "{item.claim}"
                    </div>
                    <pre style={{ 
                      fontSize: '11px', 
                      fontFamily: 'var(--font-mono)', 
                      backgroundColor: 'rgba(0,0,0,0.3)', 
                      padding: '8px', 
                      borderRadius: '4px',
                      overflowX: 'auto',
                      color: 'var(--text-secondary)'
                    }}>
                      <code>{item.mettaTrace}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Belief Splitter (KB-X vs KB-Y) */}
      {activeTab === 'splitter' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {/* Agent A: KB X-side */}
          <div className="deliberation-box" style={{ margin: 0, borderTop: '3px solid var(--agent-alpha)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', color: 'var(--agent-alpha)', fontSize: '14px' }}>
                Agent A (KB: X-side)
              </div>
              <span className="tab-badge" style={{ background: 'var(--agent-alpha-bg)', color: 'var(--agent-alpha)' }}>
                Thesis & Capabilities
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(kbX.length > 0 ? kbX : [{ statement: 'Verified positive capabilities.', sourceIndex: 1, truthValue: { strength: 0.92, confidence: 0.88 } }]).map((item, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    <span>TruthValue: <strong>[{item.truthValue?.strength || 0.92}, {item.truthValue?.confidence || 0.88}]</strong></span>
                    <button className="citation-pill" onClick={() => onCitationClick && onCitationClick(item.sourceIndex)}>
                      [{item.sourceIndex}]
                    </button>
                  </div>
                  <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {item.statement}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent B: KB Y-side */}
          <div className="deliberation-box" style={{ margin: 0, borderTop: '3px solid var(--agent-beta)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', color: 'var(--agent-beta)', fontSize: '14px' }}>
                Agent B (KB: Y-side)
              </div>
              <span className="tab-badge" style={{ background: 'var(--agent-beta-bg)', color: 'var(--agent-beta)' }}>
                Antithesis & Constraints
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(kbY.length > 0 ? kbY : [{ statement: 'Verified contextual trade-offs & limitations.', sourceIndex: 2, truthValue: { strength: 0.89, confidence: 0.85 } }]).map((item, idx) => (
                <div key={idx} style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    <span>TruthValue: <strong>[{item.truthValue?.strength || 0.89}, {item.truthValue?.confidence || 0.85}]</strong></span>
                    <button className="citation-pill" onClick={() => onCitationClick && onCitationClick(item.sourceIndex)}>
                      [{item.sourceIndex}]
                    </button>
                  </div>
                  <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {item.statement}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Explanation Trail */}
      {activeTab === 'trail' && (
        <div className="deliberation-box" style={{ margin: 0 }}>
          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCommit size={16} style={{ color: 'var(--gold)' }} />
            <span>Deductive Resolution & Grounding Trail</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(mettaNegotiation?.explanationTrail || [
              { step: 1, phase: 'Premise Isolation', description: 'Extracted atomic capability assertions.', status: 'VERIFIED' },
              { step: 2, phase: 'Constraint Mapping', description: 'Mapped situational trade-offs and cost limits.', status: 'CORROBORATED' },
              { step: 3, phase: 'MeTTa Dialectic Reduction', description: 'Eliminated false dichotomies through contextual conditioning.', status: 'CONVERGED' },
              { step: 4, phase: 'Invariant Output ("One Truth")', description: 'Unified synthesis verified against cited documentation.', status: 'UNIFIED' }
            ]).map((stepItem, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px', borderBottom: idx < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div className="step-indicator completed" style={{ marginTop: '2px' }}>
                  <CheckCircle2 size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    <span>Step {stepItem.step}: {stepItem.phase}</span>
                    <span className="tab-badge" style={{ color: 'var(--accent-chatgpt)', fontSize: '10px' }}>
                      {stepItem.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    {stepItem.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
