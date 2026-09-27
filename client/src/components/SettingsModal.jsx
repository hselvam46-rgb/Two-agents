import React, { useState } from 'react';
import { X, Key, Globe, Sparkles, Check, Info } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, keys, onSaveKeys, onToast }) {
  const [formData, setFormData] = useState({
    geminiKey: keys.geminiKey || '',
    openaiKey: keys.openaiKey || '',
    groqKey: keys.groqKey || '',
    tavilyKey: keys.tavilyKey || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveKeys(formData);
    if (onToast) onToast('Settings saved successfully');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Key size={18} style={{ color: 'var(--accent-chatgpt)' }} />
            <span>API & Engine Configuration</span>
          </div>
          <button className="icon-btn-round" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ 
              padding: '12px 14px', 
              background: 'var(--accent-chatgpt-light)', 
              border: '1px solid var(--accent-chatgpt)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              color: 'var(--text-primary)',
              display: 'flex',
              gap: '10px',
              lineHeight: 1.4
            }}>
              <Info size={18} style={{ color: 'var(--accent-chatgpt)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Zero Setup Required:</strong> DualAgent works out of the box with built-in free web search (DuckDuckGo & Wikipedia) and intelligent dual-agent synthesis!
                <br /><br />
                Optional: Add your own API keys below for enhanced generative LLM synthesis.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Google Gemini API Key</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Optional (gemini-1.5 / 2.0)</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="AIzaSy..."
                value={formData.geminiKey}
                onChange={(e) => setFormData({ ...formData, geminiKey: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>OpenAI API Key</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Optional (gpt-4o / 4o-mini)</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="sk-proj-..."
                value={formData.openaiKey}
                onChange={(e) => setFormData({ ...formData, openaiKey: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Groq API Key</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Optional (Llama 3.3 70B)</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="gsk_..."
                value={formData.groqKey}
                onChange={(e) => setFormData({ ...formData, groqKey: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Tavily Search API Key</span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Optional (Deep Web Search)</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="tvly-..."
                value={formData.tavilyKey}
                onChange={(e) => setFormData({ ...formData, tavilyKey: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={15} />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
