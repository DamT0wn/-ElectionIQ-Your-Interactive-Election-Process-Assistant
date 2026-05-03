import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HiOutlineTrash } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getChatHistory } from '../services/api';
import { useChatAudio } from '../hooks/useChatAudio';
import { useChatScroll } from '../hooks/useChatScroll';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { TypingIndicator } from '../components/TypingIndicator';

/**
 * Chat page component - Main AI assistant interface
 * Provides real-time conversation with Gemini AI
 */
export default function ChatPage() {
  const { user } = useAuth();
  const { messages, isLoading, sendChat, clearChat, loadHistory } = useChat();
  const { isPlaying: isPlayingAudio, playAudio, audioRef } = useChatAudio();
  const { scrollRef } = useChatScroll([messages, isLoading]);

  // Load persisted chat history when user logs in
  useEffect(() => {
    if (user) {
      getChatHistory(user.uid, 'default-session')
        .then((history) => {
          if (history?.length > 0) loadHistory(history);
        })
        .catch(console.error);
    }
  }, [user, loadHistory]);

  const handleSend = async (message) => {
    await sendChat(message, user);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      clearChat();
    }
  };

  return (
    <div
      className="section-container max-w-4xl py-8 h-[calc(100vh-4rem)] flex flex-col"
      role="main"
      aria-label="Chat with AI assistant"
    >
      {/* Hidden audio element for TTS */}
      <audio ref={audioRef} className="hidden" aria-hidden="true" />

      {/* Header */}
      <header
        style={{
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
        className="rounded-t-2xl p-4 flex justify-between items-center shadow-sm z-10"
      >
        <div>
          <h1
            style={{ color: 'var(--text-primary)' }}
            className="text-xl font-bold flex items-center gap-2"
          >
            <span
              className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
              aria-label="Online"
            />
            ElectionIQ Assistant
          </h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-xs">
            Powered by Gemini 2.5 Flash
          </p>
        </div>
        <button
          onClick={handleClearChat}
          style={{ color: 'var(--text-muted)' }}
          className="p-2 hover:text-red-500 rounded-lg transition-colors"
          title="Clear chat history"
          aria-label="Clear chat history"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Messages Area */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          borderRight: '1px solid var(--border-subtle)',
        }}
        className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                message={msg}
                isUser={msg.role === 'user'}
                userName={user?.displayName}
                onReadAloud={playAudio}
                isPlayingAudio={isPlayingAudio}
              />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={scrollRef} aria-hidden="true" />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSend} isLoading={isLoading} disabled={false} />
    </div>
  );
}
