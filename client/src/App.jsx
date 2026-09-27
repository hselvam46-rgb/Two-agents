import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ChatMessage from './components/ChatMessage';
import InputBar from './components/InputBar';
import SettingsModal from './components/SettingsModal';
import SourceModal from './components/SourceModal';
import { TrendingUp, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  {
    title: 'Is coffee good for you?',
    desc: 'Agent A (Alertness & Antioxidants) vs Agent B (Anxiety & Sleep Debt)'
  },
  {
    title: 'Is remote work more productive?',
    desc: 'Agent A (Deep Asynchronous Focus) vs Agent B (Collaboration & Mentorship Friction)'
  },
  {
    title: 'Is nuclear energy safe?',
    desc: 'Agent A (Lowest Deaths/TWh Baseload) vs Agent B (Catastrophic Tail-Risk & Waste)'
  },
  {
    title: 'Should AI development be paused?',
    desc: 'Agent A (Precautionary Alignment Risk) vs Agent B (Geopolitical Game Theory & Cures)'
  }
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('dualagent_theme') || 'dark');
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Settings & API Keys
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [keys, setKeys] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dualagent_keys') || '{}');
    } catch (e) {
      return {};
    }
  });

  // Source preview modal
  const [selectedSource, setSelectedSource] = useState(null);

  // Conversations history
  const [conversations, setConversations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dualagent_conversations') || '[]');
    } catch (e) {
      return [];
    }
  });

  const [currentId, setCurrentId] = useState(() => {
    return localStorage.getItem('dualagent_current_id') || null;
  });

  // Active chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [webSearchActive, setWebSearchActive] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dualagent_theme', theme);
  }, [theme]);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('dualagent_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Load active conversation only on initial mount
  useEffect(() => {
    if (currentId) {
      const active = conversations.find(c => c.id === currentId);
      if (active && active.messages) {
        setMessages(active.messages);
      }
    }
  }, []);

  // Explicit conversation selection handler
  const handleSelectConversation = (id) => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
    setCurrentId(id);
    localStorage.setItem('dualagent_current_id', id);
    const target = conversations.find(c => c.id === id);
    if (target && target.messages) {
      setMessages(target.messages);
    } else {
      setMessages([]);
    }
  };

  // Auto-scroll on new message / streaming updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  // Toast auto-clear
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSaveKeys = (newKeys) => {
    setKeys(newKeys);
    localStorage.setItem('dualagent_keys', JSON.stringify(newKeys));
  };

  // Start a new research session
  const handleNewChat = () => {
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
    setCurrentId(null);
    setMessages([]);
    setInput('');
  };

  // Delete a conversation
  const handleDeleteConversation = (idToDelete) => {
    const updated = conversations.filter(c => c.id !== idToDelete);
    setConversations(updated);
    if (currentId === idToDelete) {
      if (updated.length > 0) {
        setCurrentId(updated[0].id);
      } else {
        handleNewChat();
      }
    }
    showToast('Conversation deleted');
  };

  // Clear current conversation
  const handleClearCurrent = () => {
    if (!currentId) {
      setMessages([]);
      return;
    }
    setConversations(prev => prev.map(c => c.id === currentId ? { ...c, messages: [] } : c));
    setMessages([]);
    showToast('Chat history cleared');
  };

  // Handle citation pill clicks (e.g., [1], [2])
  const handleCitationClick = (citationNum) => {
    // Find the latest assistant message with sources
    const latestAsst = [...messages].reverse().find(m => m.role === 'assistant' && m.sources?.length);
    if (latestAsst && latestAsst.sources) {
      const match = latestAsst.sources.find(s => (s.index || s.id) == citationNum) || latestAsst.sources[citationNum - 1];
      if (match) {
        setSelectedSource(match);
        return;
      }
    }
    showToast(`Source [${citationNum}] citation details`);
  };

  // Send message and stream dual-agent deliberation
  const handleSendMessage = async (queryToSend) => {
    const query = (queryToSend || input).trim();
    if (!query || isStreaming) return;

    setInput('');

    // Setup active conversation session
    let sessionId = currentId;
    if (!sessionId) {
      sessionId = `session-${Date.now()}`;
      setCurrentId(sessionId);
      localStorage.setItem('dualagent_current_id', sessionId);
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    const initialAssistantMsg = {
      id: `asst-${Date.now()}`,
      role: 'assistant',
      originalQuery: query,
      isStreaming: true,
      startTime: Date.now(),
      steps: [],
      sources: [],
      agent1Sources: [],
      agent2Sources: [],
      kbX: [],
      kbY: [],
      mettaNegotiation: null,
      consensus: '',
      duration: 0
    };

    const newMessages = [...messages, userMsg, initialAssistantMsg];
    setMessages(newMessages);
    setIsStreaming(true);

    // Create AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const apiBase = window.location.port === '3001' ? '' : 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          keys
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      let isCompletedSuccessfully = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done || isCompletedSuccessfully) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || '';

        for (const rawEvent of events) {
          if (!rawEvent.trim() || rawEvent.startsWith(':')) continue;

          let eventType = 'message';
          let dataStr = '';

          const lines = rawEvent.split(/\r?\n/);
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr = line.slice(6).trim();
            }
          }

          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr);

            setMessages(prev => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (lastIdx < 0 || updated[lastIdx].role !== 'assistant') return updated;

              const curr = { ...updated[lastIdx] };

              if (eventType === 'step') {
                const existingIdx = curr.steps.findIndex(s => s.id === data.id);
                if (existingIdx >= 0) {
                  curr.steps[existingIdx] = { ...curr.steps[existingIdx], ...data };
                } else {
                  curr.steps = [...curr.steps, data];
                }
              } else if (eventType === 'agent1_sources') {
                curr.agent1Sources = data.sources || [];
                curr.sources = [...curr.agent1Sources];
              } else if (eventType === 'agent2_sources') {
                curr.agent2Sources = data.sources || [];
                const seenUrls = new Set((curr.sources || []).map(s => s.url));
                const merged = [...(curr.sources || [])];
                (data.sources || []).forEach(src => {
                  if (!seenUrls.has(src.url)) {
                    seenUrls.add(src.url);
                    merged.push(src);
                  }
                });
                curr.sources = merged.map((s, idx) => ({ ...s, index: idx + 1 }));
              } else if (eventType === 'belief_split') {
                curr.kbX = data.kbX || [];
                curr.kbY = data.kbY || [];
              } else if (eventType === 'metta_negotiation') {
                curr.mettaNegotiation = data || null;
              } else if (eventType === 'consensus_chunk') {
                curr.consensus = (curr.consensus || '') + (data.chunk || '');
              } else if (eventType === 'complete') {
                isCompletedSuccessfully = true;
                curr.consensus = data.consensus || curr.consensus;
                curr.sources = data.sources || curr.sources;
                curr.agent1Sources = data.agent1Sources || curr.agent1Sources;
                curr.agent2Sources = data.agent2Sources || curr.agent2Sources;
                curr.kbX = data.kbX || curr.kbX;
                curr.kbY = data.kbY || curr.kbY;
                curr.mettaNegotiation = data.mettaNegotiation || curr.mettaNegotiation;
                curr.duration = Date.now() - curr.startTime;
                curr.isStreaming = false;
              } else if (eventType === 'error') {
                curr.consensus = `**Research Encountered an Issue:** ${data.message || 'Error occurred.'}`;
                curr.isStreaming = false;
              }

              updated[lastIdx] = curr;
              return updated;
            });
          } catch (e) {
            console.error('Failed to parse SSE event:', e, dataStr);
          }
        }
        if (isCompletedSuccessfully) break;
      }
    } catch (err) {
      if (err.name !== 'AbortError' && !isCompletedSuccessfully) {
        console.error('Fetch error:', err);
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].role === 'assistant' && !updated[lastIdx].consensus) {
            updated[lastIdx] = {
              ...updated[lastIdx],
              consensus: `**Connection Error:** Unable to reach DualAgent backend service on http://localhost:3001. Please ensure the server is active.\n\n*Error details: ${err.message}*`,
              isStreaming: false
            };
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);

      // Persist finalized messages to conversation store
      setMessages(latestMessages => {
        setConversations(prev => {
          const exists = prev.some(c => c.id === sessionId);
          if (exists) {
            return prev.map(c => c.id === sessionId ? { ...c, messages: latestMessages } : c);
          } else {
            return [{
              id: sessionId,
              title: query.slice(0, 36) + (query.length > 36 ? '...' : ''),
              messages: latestMessages,
              createdAt: Date.now()
            }, ...prev];
          }
        });
        return latestMessages;
      });
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      showToast('Research stopped by user');
    }
  };

  return (
    <div className="app-container">
      {/* 1. Left Sidebar (ChatGPT-inspired) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        conversations={conversations}
        currentId={currentId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Content Area */}
      <main className="main-content">
        <TopBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onClearChat={handleClearCurrent}
          hasMessages={messages.length > 0}
          isStreaming={isStreaming}
        />

        {/* Messages Scroll Area */}
        <div className="messages-container">
          {messages.length === 0 ? (
            /* Empty State Hero (Two Agents, One Truth) */
            <div className="chat-empty-state">
              <div className="empty-state-icon-group">
                <div className="agent-avatar-badge avatar-agent-a" title="Agent A (Supports Premise)">
                  <TrendingUp size={24} />
                </div>
                <div className="agent-avatar-badge avatar-agent-b" title="Agent B (Flags Critical Boundaries)">
                  <AlertTriangle size={24} />
                </div>
              </div>

              <h1 className="empty-state-title">
                Two Agents, One Truth
              </h1>
              <p className="empty-state-subtitle">
                Two agents. Two conflicting beliefs. Watch them negotiate live using MeTTa reasoning until they reach one answer both can defend.
              </p>

              <div className="suggestions-grid">
                {SUGGESTIONS.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="suggestion-card" 
                    onClick={() => handleSendMessage(item.title)}
                  >
                    <div className="suggestion-card-title">
                      <span>{item.title}</span>
                      <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                    <div className="suggestion-card-desc">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-inner">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onSelectSource={(src) => setSelectedSource(src)}
                  onCitationClick={handleCitationClick}
                  onRetry={(q) => handleSendMessage(q)}
                  onToast={showToast}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Input Dock */}
        <InputBar
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          isStreaming={isStreaming}
          onStop={handleStop}
          webSearchActive={webSearchActive}
          setWebSearchActive={setWebSearchActive}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        keys={keys}
        onSaveKeys={handleSaveKeys}
        onToast={showToast}
      />

      {/* Source Preview Modal */}
      <SourceModal
        source={selectedSource}
        isOpen={Boolean(selectedSource)}
        onClose={() => setSelectedSource(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <Sparkles size={15} style={{ color: 'var(--accent-chatgpt)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
