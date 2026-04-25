import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm ElectionIQ 👋 Ask me anything about voting, registration, or the election process.",
  id: 'init'
};

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: 'user', content: text, id: Date.now() };
    const history = messages
      .filter(m => m.id !== 'init')
      .map(({ role, content }) => ({
        role: role === 'assistant' ? 'model' : 'user',
        parts: [{ text: content }]
      }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(text, history);
      const replyText = response?.response ||
        response?.history?.slice(-1)[0]?.parts?.[0]?.text ||
        "I'm here to help! Ask me anything about the election process.";

      const botMsg = { role: 'assistant', content: replyText, id: Date.now() + 1 };
      setMessages(prev => [...prev, botMsg]);
      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting to the server. Please try again.",
        id: Date.now() + 1,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => setMessages([INITIAL_MESSAGE]);

  return (
    <>
      {/* Floating Button */}
      <button
        className={`float-chat-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
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
        {hasNewMessage && !isOpen && <span className="float-chat-badge" />}
      </button>

      {/* Chat Window */}
      <div className={`float-chat-window ${isOpen ? 'visible' : ''}`}>
        {/* Header */}
        <div className="float-chat-header">
          <div className="float-chat-header-info">
            <div className="float-chat-avatar">IQ</div>
            <div>
              <div className="float-chat-name">ElectionIQ Assistant</div>
              <div className="float-chat-status">
                <span className="status-dot" /> Online
              </div>
            </div>
          </div>
          <button className="float-chat-clear" onClick={clearChat} title="Clear chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="float-chat-messages custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`float-msg ${msg.role} ${msg.isError ? 'error' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="float-msg-avatar">IQ</div>
              )}
              <div className="float-msg-bubble">{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="float-msg assistant">
              <div className="float-msg-avatar">IQ</div>
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
          />
          <button
            className="float-chat-send"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
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
