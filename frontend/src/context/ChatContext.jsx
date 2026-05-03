import { createContext, useContext, useState, useCallback } from 'react';
import { sendMessage } from '../services/api';

const ChatContext = createContext();

const INITIAL_MESSAGE = {
  role: 'model',
  parts: [
    {
      text: 'Hello! I am ElectionIQ, your AI election assistant. How can I help you understand the voting process today?',
    },
  ],
};

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // user is passed in at call time so ChatContext doesn't depend on AuthContext
  const sendChat = useCallback(
    async (userMessage, user = null) => {
      if (!userMessage.trim() || isLoading) return;

      setError(null);
      setIsLoading(true);

      const newHistory = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
      setMessages(newHistory);

      try {
        const response = await sendMessage(
          userMessage,
          newHistory.slice(0, -1),
          user?.uid || null,
          user ? 'default-session' : null
        );

        if (response.history && response.history.length > 0) {
          setMessages(response.history);
        } else if (response.response) {
          setMessages([...newHistory, { role: 'model', parts: [{ text: response.response }] }]);
        }
      } catch (err) {
        const errMsg =
          err.message?.includes('rate limited') || err.message?.includes('temporarily')
            ? '⏳ The AI is temporarily rate limited. Please wait a moment and try again.'
            : `Sorry, I encountered an error: ${err.message || 'Please try again.'}`;
        setMessages([...newHistory, { role: 'model', parts: [{ text: errMsg }] }]);
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        role: 'model',
        parts: [{ text: 'Chat history cleared. How can I help you now?' }],
      },
    ]);
    setError(null);
  }, []);

  const loadHistory = useCallback((history) => {
    if (history && history.length > 0) {
      setMessages(history);
    }
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, error, sendChat, clearChat, loadHistory }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
