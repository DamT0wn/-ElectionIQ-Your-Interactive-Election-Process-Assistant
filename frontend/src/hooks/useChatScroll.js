import { useRef, useEffect } from 'react';

/**
 * Custom hook for auto-scrolling chat messages to bottom
 * @param {Array} dependencies - Array of dependencies that trigger scroll (e.g., messages, isLoading)
 * @returns {Object} Scroll controls
 * @returns {React.RefObject} returns.scrollRef - Ref to attach to scroll target element
 * @returns {Function} returns.scrollToBottom - Manual scroll function
 */
export function useChatScroll(dependencies = []) {
  const scrollRef = useRef(null);

  /**
   * Scroll to bottom of chat container
   * @param {Object} options - Scroll behavior options
   * @param {string} options.behavior - 'smooth' or 'auto'
   */
  const scrollToBottom = (options = { behavior: 'smooth' }) => {
    scrollRef.current?.scrollIntoView(options);
  };

  // Auto-scroll when dependencies change
  useEffect(() => {
    scrollToBottom();
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    scrollRef,
    scrollToBottom,
  };
}
