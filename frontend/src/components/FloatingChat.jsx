import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

export default function FloatingChat() {
  const { messages, isLoading, sendChat, clearChat } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevMsgCount = useRef(messages.length);
  const location = useLocation();

  // Don't show floating chat on the /chat page — user is already there
  const isOnChatPage = location.pathname === '/chat';

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened, clear badge
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Show badge when new AI message arrives while closed
  useEffect(() => {
    if (!isOpen && messages.length > prevMsgCount.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === 'model') setHasNewMessage(true);
    }
    prevMsgCount.current = messages.length;
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    await sendChat(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isOnChatPage) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        className={`float-chat-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {hasNewMessage && !isOpen && <span className="float-chat-badge" aria-label="New message" />}
      </button>

      {/* Chat Window */}
      <div
        className={`float-chat-window ${isOpen ? 'visible' : ''}`}
        role="dialog"
        aria-label="ElectionIQ chat assistant"
        aria-modal="false"
      >
        {/* Header */}
        <div className="float-chat-header">
          <div className="float-chat-header-info">
            <div className="float-chat-avatar" aria-hidden="true">IQ</div>
            <div>
              <div className="float-chat-name">ElectionIQ Assistant</div>
              <div className="float-chat-status">
                <span className="status-dot" aria-hidden="true" /> Online
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Open full chat link */}
            <Link
              to="/chat"
              onClick={() => setIsOpen(false)}
              title="Open full chat"
              style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </Link>
            <button className="float-chat-clear" onClick={clearChat} title="Clear chat" aria-label="Clear chat history">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="float-chat-messages custom-scrollbar" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const text = msg.parts?.[0]?.text || '';
            return (
              <div key={idx} className={`float-msg ${isUser ? 'user' : 'assistant'}`}>
                {!isUser && <div className="float-msg-avatar" aria-hidden="true">IQ</div>}
                <div className="float-msg-bubble">{text}</div>
              </div>
            );
          })}
          {isLoading && (
            <div className="float-msg assistant" aria-label="ElectionIQ is typing">
              <div className="float-msg-avatar" aria-hidden="true">IQ</div>
              <div className="float-msg-bubble loading">
                <span className="animate-typing" />
                <span className="animate-typing animate-delay-200" />
                <span className="animate-typing animate-delay-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="float-chat-input-row">
          <textarea
            ref={inputRef}
            className="float-chat-input"
            placeholder="Ask about voting..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <button
            className="float-chat-send"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
