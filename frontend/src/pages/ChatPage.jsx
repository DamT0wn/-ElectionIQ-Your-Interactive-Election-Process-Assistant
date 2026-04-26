import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { HiOutlinePaperAirplane, HiOutlineMicrophone, HiOutlineStop, HiOutlineVolumeUp, HiOutlineTrash } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { sendMessage, getChatHistory, synthesizeSpeech } from '../services/api';

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: 'Hello! I am ElectionIQ, your AI election assistant. How can I help you understand the voting process today?' }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => scrollToBottom(), [messages, isLoading]);

  // Load history if logged in (mocked session ID for now)
  useEffect(() => {
    if (user) {
      getChatHistory(user.uid, 'default-session').then(history => {
        if (history && history.length > 0) {
          setMessages(history);
        }
      }).catch(console.error);
    }
  }, [user]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Optimistically add user message
    const newHistory = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    setMessages(newHistory);

    try {
      const response = await sendMessage(
        userMessage, 
        newHistory.slice(0, -1), // Exclude the message we just added optimistically
        user?.uid,
        user ? 'default-session' : null
      );
      setMessages(response.history);
    } catch (err) {
      console.error(err);
      const errMsg = err.message?.includes('rate limited')
        ? 'The AI is temporarily rate limited. Please wait a moment and try again.'
        : 'Sorry, I encountered an error. Please try asking again.';
      setMessages([...newHistory, { role: 'model', parts: [{ text: errMsg }] }]);
    } finally {
      setIsLoading(false);
    }
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
        audioRef.current.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(url);
        };
      }
    } catch (err) {
      console.error('TTS Error:', err);
      setIsPlayingAudio(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'model', parts: [{ text: 'Chat history cleared. How can I help you now?' }] }
    ]);
  };

  return (
    <div className="section-container max-w-4xl py-8 h-[calc(100vh-4rem)] flex flex-col">
      <audio ref={audioRef} className="hidden" />
      
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark-elevated rounded-t-2xl p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ElectionIQ Assistant
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini 1.5 Pro</p>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="Clear Chat"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50/50 dark:bg-surface-dark/50 overflow-y-auto p-4 sm:p-6 custom-scrollbar border-x border-slate-200 dark:border-slate-700">
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const text = msg.parts[0].text;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isUser ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'}`}>
                      {isUser ? (user?.displayName?.[0] || 'U') : 'IQ'}
                    </div>
                    
                    {/* Bubble */}
                    <div className={`group relative p-4 rounded-2xl shadow-sm ${
                      isUser 
                        ? 'bg-primary-600 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-surface-dark-elevated text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-700'
                    }`}>
                      <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'} prose-p:leading-relaxed prose-a:text-primary-300`}>
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                      
                      {/* TTS Button (AI only) */}
                      {!isUser && (
                        <button
                          onClick={() => handleReadAloud(text)}
                          className="absolute -right-10 top-2 p-1.5 text-slate-400 hover:text-primary-500 bg-white dark:bg-surface-dark-elevated rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 dark:border-slate-700"
                          title="Read aloud"
                        >
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
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                IQ
              </div>
              <div className="bg-white dark:bg-surface-dark-elevated rounded-2xl rounded-bl-sm p-4 border border-slate-100 dark:border-slate-700 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-typing"></span>
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-typing animate-delay-200"></span>
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-typing animate-delay-400"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-surface-dark-elevated rounded-b-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm z-10">
        <form onSubmit={handleSend} className="flex gap-2 items-end">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about the election..."
              className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-600 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none custom-scrollbar"
              rows="1"
              style={{ minHeight: '52px', maxHeight: '120px' }}
            />
            <button
              type="button"
              className="absolute right-3 bottom-3 p-1.5 text-slate-400 hover:text-primary-500 transition-colors"
              title="Voice Input (Coming Soon)"
            >
              <HiOutlineMicrophone className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary p-3 rounded-xl h-[52px] shrink-0"
          >
            {isLoading ? <HiOutlineStop className="w-5 h-5 animate-pulse" /> : <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />}
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          ElectionIQ can make mistakes. Verify important election dates and rules with official state sources.
        </p>
      </div>
    </div>
  );
}
