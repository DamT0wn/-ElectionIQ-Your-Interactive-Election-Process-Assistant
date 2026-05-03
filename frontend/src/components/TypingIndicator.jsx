import { motion } from 'framer-motion';

/**
 * Typing indicator component for AI responses
 * Shows animated dots while AI is generating response
 */
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-2"
      role="status"
      aria-live="polite"
      aria-label="AI is typing"
    >
      {/* Avatar */}
      <div
        style={{ background: 'var(--brand-gradient)' }}
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
        aria-hidden="true"
      >
        IQ
      </div>

      {/* Typing Animation */}
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
        className="rounded-2xl rounded-bl-sm p-4 flex gap-1"
      >
        <span className="animate-typing" aria-hidden="true" />
        <span className="animate-typing animate-delay-200" aria-hidden="true" />
        <span className="animate-typing animate-delay-400" aria-hidden="true" />
        <span className="sr-only">AI is generating a response</span>
      </div>
    </motion.div>
  );
}
