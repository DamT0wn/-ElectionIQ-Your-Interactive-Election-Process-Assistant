import { memo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { HiOutlineVolumeUp } from 'react-icons/hi';

/**
 * Individual chat message component
 * Memoized to prevent unnecessary re-renders
 *
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object
 * @param {string} props.message.role - 'user' or 'model'
 * @param {Array} props.message.parts - Message content parts
 * @param {boolean} props.isUser - Whether message is from user
 * @param {string} props.userName - User's display name
 * @param {Function} props.onReadAloud - Callback for read aloud action
 * @param {boolean} props.isPlayingAudio - Whether audio is currently playing
 */
export const ChatMessage = memo(
  function ChatMessage({ message, isUser, userName, onReadAloud, isPlayingAudio }) {
    const text = message.parts?.[0]?.text || '';

    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
        role="article"
        aria-label={`${isUser ? 'Your' : 'Assistant'} message`}
      >
        <div
          className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* Avatar */}
          <div
            style={
              isUser
                ? {
                    background: 'var(--bg-elevated)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--border-brand)',
                  }
                : { background: 'var(--brand-gradient)' }
            }
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm text-white"
            aria-label={isUser ? 'User avatar' : 'Assistant avatar'}
          >
            {isUser ? userName?.[0] || 'U' : 'IQ'}
          </div>

          {/* Message Bubble */}
          <div
            style={
              isUser
                ? {
                    background: 'var(--brand-gradient)',
                    color: 'white',
                    borderBottomRightRadius: 4,
                  }
                : {
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderBottomLeftRadius: 4,
                  }
            }
            className="group relative p-4 rounded-2xl shadow-sm"
          >
            {/* Message Content */}
            <div
              className="prose prose-sm max-w-none prose-p:leading-relaxed"
              style={{ color: 'inherit' }}
            >
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>

            {/* Read Aloud Button (AI messages only) */}
            {!isUser && onReadAloud && (
              <button
                onClick={() => onReadAloud(text)}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: isPlayingAudio ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
                className="absolute -right-10 top-2 p-1.5 hover:text-indigo-400 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                title={isPlayingAudio ? 'Stop audio' : 'Read aloud'}
                aria-label={isPlayingAudio ? 'Stop reading message' : 'Read message aloud'}
              >
                <HiOutlineVolumeUp className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if message content or audio state changes
    return (
      prevProps.message.parts?.[0]?.text === nextProps.message.parts?.[0]?.text &&
      prevProps.isPlayingAudio === nextProps.isPlayingAudio
    );
  }
);
