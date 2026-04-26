import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { HiOutlinePaperAirplane, HiOutlineStop, HiOutlineVolumeUp, HiOutlineTrash } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getChatHistory, synthesizeSpeech } from '../services/api';

export default function ChatPage() {
  const { user } = useAuth();
  const { messages, isLoading, sendChat, clearChat, loadHistory } = useChat();
  const [input, setInput] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load persisted history when user logs in
  useEffect(() => {
    if (user) {
      getChatHistory(user.uid, 'default-session')
        .then(history => { if (history?.length > 0) loadHistory(history); })
        .catch(console.error);
    }
  }, [user, loadHistory]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    await sendChat(msg);
  };

  const handleReadAloud = async (text) => {
    if (isPlayingAudio) {
      audioRef.current?.pause();
      setIsPlayingAudio(false);
      return;
    }
    try {
      setIsPlayingAudio(true);
      const audioBuffer = await synthesizeSpeech(text);
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        audioRef.current.onended = () => { setIsPlayingAudio(false); URL.revokeObjectURL(url); };
      }
    } catch (err) {
      console.error('TTS Error:', err);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="section-container max-w-4xl py-8 h-[calc(100vh-4rem)] flex flex-col">
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <div style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}
        className="rounded-t-2xl p-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ElectionIQ Assistant
          </h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-xs">Powered by Gemini 2.5 Flash</p>
        </div>
        <button onClick={clearChat} style={{ color: 'var(--text-muted)' }}
          className="p-2 hover:text-red-500 rounded-lg transition-colors" title="Clear Chat">
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}
        className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const text = msg.parts?.[0]?.text || '';
              return (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div style={isUser
                      ? { background: 'var(--bg-elevated)', color: 'var(--accent-primary)', border: '1px solid var(--border-brand)' }
                      : { background: 'var(--brand-gradient)' }}
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm text-white">
                      {isUser ? (user?.displayName?.[0] || 'U') : 'IQ'}
                    </div>
                    <div style={isUser
                      ? { background: 'var(--brand-gradient)', color: 'white', borderBottomRightRadius: 4 }
                      : { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderBottomLeftRadius: 4 }}
                      className="group relative p-4 rounded-2xl shadow-sm">
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed" style={{ color: 'inherit' }}>
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                      {!isUser && (
                        <button onClick={() => handleReadAloud(text)}
                          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                          className="absolute -right-10 top-2 p-1.5 hover:text-indigo-400 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Read aloud">
                          <HiOutlineVolumeUp className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
              <div style={{ background: 'var(--brand-gradient)' }} className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">IQ</div>
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }} className="rounded-2xl rounded-bl-sm p-4 flex gap-1">
                <span className="animate-typing" />
                <span className="animate-typing animate-delay-200" />
                <span className="animate-typing animate-delay-400" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        className="rounded-b-2xl p-4 shadow-sm z-10">
        <form onSubmit={handleSend} className="flex gap-2 items-end">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask me anything about the election..."
              className="w-full rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none custom-scrollbar"
              rows="1"
              style={{ minHeight: '52px', maxHeight: '120px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            />
          </div>
          <button type="submit" disabled={!input.trim() || isLoading} className="btn-primary p-3 rounded-xl h-[52px] shrink-0">
            {isLoading ? <HiOutlineStop className="w-5 h-5 animate-pulse" /> : <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />}
          </button>
        </form>
        <p style={{ color: 'var(--text-muted)' }} className="text-center text-[10px] mt-2">
          ElectionIQ can make mistakes. Verify important election dates and rules with official state sources.
        </p>
      </div>
    </div>
  );
}
