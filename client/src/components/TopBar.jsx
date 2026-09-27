import React from 'react';
import { PanelLeftOpen, Sparkles, Settings, Trash2, CheckCircle2 } from 'lucide-react';

export default function TopBar({ 
  isSidebarOpen, 
  onToggleSidebar, 
  onOpenSettings, 
  onClearChat,
  hasMessages,
  isStreaming = false
}) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {!isSidebarOpen && (
          <button className="icon-btn-round" onClick={onToggleSidebar} title="Open sidebar">
            <PanelLeftOpen size={18} />
          </button>
        )}

        <div className="model-badge-dropdown" title="Two Agents, One Truth — MeTTa Consensus Architecture">
          <Sparkles size={16} style={{ color: 'var(--accent-chatgpt)' }} />
          <span style={{ fontWeight: '600' }}>Two Agents, One Truth</span>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>
            MeTTa Consensus
          </span>
        </div>

        {/* Dynamic Live Status Badge */}
        <div className={`agent-status-pill ${isStreaming ? 'status-negotiating' : (hasMessages ? 'status-consensus' : 'status-ready')}`}>
          {isStreaming ? (
            <>
              <span className="status-dot negotiating-pulse"></span>
              <span>Negotiating...</span>
            </>
          ) : hasMessages ? (
            <>
              <span className="status-dot consensus-dot"></span>
              <span>Consensus Reached</span>
            </>
          ) : (
            <>
              <span className="status-dot ready-dot"></span>
              <span>Ready to Negotiate</span>
            </>
          )}
        </div>
      </div>

      <div className="top-bar-right">
        {hasMessages && (
          <button className="icon-btn-round" onClick={onClearChat} title="Clear conversation">
            <Trash2 size={16} />
          </button>
        )}

        <button className="icon-btn-round" onClick={onOpenSettings} title="Settings">
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
