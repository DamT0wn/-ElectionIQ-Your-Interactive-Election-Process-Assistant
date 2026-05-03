import { useState, useRef, useCallback } from 'react';
import { synthesizeSpeech } from '../services/api';

/**
 * Custom hook for managing text-to-speech audio playback
 * @returns {Object} Audio controls and state
 * @returns {boolean} returns.isPlaying - Whether audio is currently playing
 * @returns {Function} returns.playAudio - Function to play text as speech
 * @returns {Function} returns.stopAudio - Function to stop current playback
 */
export function useChatAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  /**
   * Play text as speech using Cloud Text-to-Speech
   * @param {string} text - Text to convert to speech
   */
  const playAudio = useCallback(
    async (text) => {
      if (!text) return;

      // Stop current playback if any
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      try {
        setIsPlaying(true);
        const audioBuffer = await synthesizeSpeech(text);
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        // Create or reuse audio element
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }

        audioRef.current.src = url;
        audioRef.current.play();

        // Cleanup on end
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };

        // Cleanup on error
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          console.error('Audio playback error');
        };
      } catch (err) {
        console.error('TTS Error:', err);
        setIsPlaying(false);
      }
    },
    [isPlaying]
  );

  /**
   * Stop current audio playback
   */
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return {
    isPlaying,
    playAudio,
    stopAudio,
    audioRef,
  };
}
