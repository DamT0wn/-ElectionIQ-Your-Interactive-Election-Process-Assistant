/**
 * Quiz-related constants
 * Centralized configuration for quiz feature
 */

/**
 * Default quiz topics if API fails
 * @constant {string[]}
 */
export const FALLBACK_QUIZ_TOPICS = [
  'voter registration',
  'election day procedures',
  'types of elections',
  'electoral college',
  'ballot measures and propositions',
  'campaign finance',
  'voting rights history',
  'how votes are counted',
  'absentee and mail-in voting',
  'primary elections vs general elections',
];

/**
 * Quiz difficulty levels with styling
 * @constant {Object[]}
 */
export const DIFFICULTY_LEVELS = [
  {
    level: 'easy',
    label: 'Easy',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.4)',
    description: 'Basic civics knowledge',
  },
  {
    level: 'medium',
    label: 'Medium',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.4)',
    description: 'Intermediate understanding',
  },
  {
    level: 'hard',
    label: 'Hard',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.4)',
    description: 'Advanced knowledge',
  },
];

/**
 * Quiz game states
 * @constant {Object}
 */
export const QUIZ_STATES = {
  SETUP: 'setup',
  PLAYING: 'playing',
  RESULT: 'result',
};

/**
 * Default quiz configuration
 * @constant {Object}
 */
export const DEFAULT_QUIZ_CONFIG = {
  difficulty: 'medium',
  topic: '',
  questionsPerSession: 10,
};

/**
 * Quiz error messages
 * @constant {Object}
 */
export const QUIZ_ERRORS = {
  LOAD_FAILED: 'Failed to load quiz question. Please try again.',
  SUBMIT_FAILED: 'Failed to submit answer. Please try again.',
  TOPICS_FAILED: 'Failed to load topics. Using default topics.',
  EXPLANATION_FAILED: 'Failed to load explanation.',
};

/**
 * Quiz success messages
 * @constant {Object}
 */
export const QUIZ_MESSAGES = {
  CORRECT: 'Correct! Well done!',
  INCORRECT: "Not quite. Let's learn from this!",
  LOADING_QUESTION: 'Generating question with AI...',
  LOADING_EXPLANATION: 'AI is generating explanation...',
};
