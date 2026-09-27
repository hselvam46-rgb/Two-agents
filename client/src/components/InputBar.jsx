import React, { useRef, useEffect } from 'react';
import { ArrowUp, Globe, Users, Square, Scale } from 'lucide-react';

export default function InputBar({ 
  input, 
  setInput, 
  onSend, 
  isStreaming, 
  onStop,
  webSearchActive,
  setWebSearchActive
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="input-dock">
      <div className="input-box-wrapper">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          rows={1}
          placeholder="Ask anything for two agents to research, debate & reach consensus..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
        />

        <div className="input-controls-bottom">
          <div className="input-badges-left">
            <button 
              type="button"
              className={`feature-pill ${webSearchActive ? 'active' : ''}`}
              onClick={() => setWebSearchActive(!webSearchActive)}
              title="Toggle Live Web Retrieval"
            >
              <Globe size={13} />
              <span>Web Search</span>
            </button>

            <div className="feature-pill active" title="MeTTa Multi-Round Dialectic Engine">
              <Scale size={13} style={{ color: 'var(--accent-chatgpt)' }} />
              <span>Negotiation Mode: MeTTa (Rounds: 4)</span>
            </div>
          </div>

          <div>
            {isStreaming ? (
              <button 
                type="button" 
                className="submit-send-btn" 
                onClick={onStop}
                title="Stop generation"
                style={{ backgroundColor: 'var(--accent-chatgpt)' }}
              >
                <Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button 
                type="button" 
                className="submit-send-btn" 
                onClick={onSend}
                disabled={!input.trim()}
                title="Send message"
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="input-footer-disclaimer">
        Agents negotiate using MeTTa symbolic reasoning — not a vote, a resolved argument.
      </div>
    </div>
  );
}
