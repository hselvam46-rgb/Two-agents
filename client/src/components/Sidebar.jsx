import React from 'react';
import { Plus, MessageSquare, Trash2, Settings, Sun, Moon, PanelLeftClose, Compass } from 'lucide-react';

export default function Sidebar({ 
  isOpen, 
  onToggle, 
  conversations = [], 
  currentId, 
  onSelectConversation, 
  onNewChat, 
  onDeleteConversation,
  theme,
  onToggleTheme,
  onOpenSettings
}) {
  return (
    <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat} title="New Research Session">
          <Plus size={16} />
          <span>New research</span>
        </button>

        <button className="icon-btn-round" onClick={onToggle} title="Close sidebar" style={{ marginLeft: '6px' }}>
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="sidebar-section-title">
        Research History
      </div>

      <div className="sidebar-history-list">
        {conversations.length === 0 ? (
          <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            No prior sessions
          </div>
        ) : (
          conversations.map((conv) => (
            <div 
              key={conv.id} 
              className={`history-item ${conv.id === currentId ? 'active' : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <MessageSquare size={14} style={{ marginRight: '8px', opacity: 0.7, flexShrink: 0 }} />
              <span className="history-item-title">{conv.title || 'Untitled Research'}</span>
              
              <button 
                className="history-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                title="Delete session"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-nav-item" onClick={onToggleTheme} title="Switch theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>

        <button className="sidebar-nav-item" onClick={onOpenSettings} title="Configure API Keys">
          <Settings size={16} />
          <span>API & Engine Settings</span>
        </button>

        <div style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={12} style={{ color: 'var(--accent-chatgpt)' }} />
          <span>DualAgent v2.0 Consensus</span>
        </div>
      </div>
    </aside>
  );
}
