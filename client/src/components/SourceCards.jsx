import React, { useState } from 'react';
import { ExternalLink, Globe, Compass, ShieldCheck } from 'lucide-react';

export default function SourceCards({ sources = [], agent1Sources = [], agent2Sources = [], onSelectSource }) {
  const [filter, setFilter] = useState('all');

  if (!sources || sources.length === 0) return null;

  const a1Urls = new Set((agent1Sources || []).map(s => s.url));
  const a2Urls = new Set((agent2Sources || []).map(s => s.url));

  const filteredSources = sources.filter(src => {
    if (filter === 'alpha') return a1Urls.has(src.url);
    if (filter === 'beta') return a2Urls.has(src.url);
    return true;
  });

  return (
    <div className="sources-section">
      <div className="sources-section-header">
        <div className="sources-section-title">
          <Globe size={15} style={{ color: 'var(--accent-chatgpt)' }} />
          <span>Verified Web Sources ({sources.length})</span>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className={`feature-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            style={{ fontSize: '11px', padding: '2px 8px' }}
          >
            All ({sources.length})
          </button>
          <button 
            className={`feature-pill ${filter === 'alpha' ? 'active' : ''}`}
            onClick={() => setFilter('alpha')}
            style={{ fontSize: '11px', padding: '2px 8px' }}
          >
            <Compass size={11} style={{ color: 'var(--agent-alpha)' }} />
            Alpha ({agent1Sources.length})
          </button>
          <button 
            className={`feature-pill ${filter === 'beta' ? 'active' : ''}`}
            onClick={() => setFilter('beta')}
            style={{ fontSize: '11px', padding: '2px 8px' }}
          >
            <ShieldCheck size={11} style={{ color: 'var(--agent-beta)' }} />
            Beta ({agent2Sources.length})
          </button>
        </div>
      </div>

      <div className="sources-grid">
        {filteredSources.map((source, idx) => {
          const isAlpha = a1Urls.has(source.url);
          const isBeta = a2Urls.has(source.url);

          return (
            <div 
              key={source.id || source.url || idx}
              className="source-card"
              onClick={() => onSelectSource ? onSelectSource(source) : window.open(source.url, '_blank')}
              title={source.snippet || source.title}
            >
              <div className="source-card-top">
                <div className="source-domain-group">
                  <img 
                    src={source.favicon || `https://www.google.com/s2/favicons?domain=${source.domain}&sz=64`} 
                    alt="" 
                    className="source-favicon" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span>{source.domain}</span>
                </div>
                <div className="source-index-badge">
                  {source.index || idx + 1}
                </div>
              </div>

              <div className="source-card-title">
                {source.title}
              </div>

              <div className="source-agent-tag">
                {isAlpha && (
                  <span style={{ color: 'var(--agent-alpha)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Compass size={10} /> Explorer
                  </span>
                )}
                {isBeta && (
                  <span style={{ color: 'var(--agent-beta)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={10} /> Verifier
                  </span>
                )}
                <ExternalLink size={10} style={{ marginLeft: 'auto', opacity: 0.6 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
