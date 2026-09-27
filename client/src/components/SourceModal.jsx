import React from 'react';
import { X, ExternalLink, Globe, Compass, ShieldCheck } from 'lucide-react';

export default function SourceModal({ source, isOpen, onClose }) {
  if (!isOpen || !source) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ fontSize: '15px' }}>
            <img 
              src={source.favicon || `https://www.google.com/s2/favicons?domain=${source.domain}&sz=64`} 
              alt="" 
              style={{ width: '18px', height: '18px', borderRadius: '4px' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '380px' }}>
              {source.domain}
            </span>
            <span className="source-index-badge" style={{ marginLeft: '6px' }}>
              {source.index || '#'}
            </span>
          </div>
          <button className="icon-btn-round" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {source.title}
          </h3>

          <div style={{
            padding: '14px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            <p>"{source.snippet || 'No excerpt available.'}"</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <span>Domain: <strong>{source.domain}</strong></span>
            {source.score && <span>Relevance Score: {Math.round(source.score * 100)}%</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <a 
            href={source.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary" 
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Visit Website</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
