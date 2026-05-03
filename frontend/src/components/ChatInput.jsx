import { useState } from 'react';
import { HiOutlinePaperAirplane, HiOutlineStop } from 'react-icons/hi';

/**
 * Chat input component with form handling
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSend - Callback when message is sent
 * @param {boolean} props.isLoading - Whether AI is generating response
 * @param {boolean} props.disabled - Whether input is disabled
 */
export function ChatInput({ onSend, isLoading, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || disabled) return;

    const message = input.trim();
    setInput('');
    onSend(message);
  };

  const handleKeyDown = (e) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
      className="rounded-b-2xl p-4 shadow-sm z-10"
    >
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        {/* Text Input */}
        <div className="relative flex-1">
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about the election..."
            disabled={disabled}
            className="w-full rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed"
            rows="1"
            style={{
              minHeight: '52px',
              maxHeight: '120px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
            aria-label="Chat message input"
            aria-describedby="chat-input-description"
          />
          <span id="chat-input-description" className="sr-only">
            Type your election-related question and press Enter to send, or Shift+Enter for new line
          </span>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="btn-primary p-3 rounded-xl h-[52px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isLoading ? 'Stop generating' : 'Send message'}
        >
          {isLoading ? (
            <HiOutlineStop className="w-5 h-5 animate-pulse" aria-hidden="true" />
          ) : (
            <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" aria-hidden="true" />
          )}
        </button>
      </form>

      {/* Disclaimer */}
      <p
        style={{ color: 'var(--text-muted)' }}
        className="text-center text-[10px] mt-2"
        role="note"
      >
        ElectionIQ can make mistakes. Verify important election dates and rules with official state
        sources.
      </p>
    </div>
  );
}
