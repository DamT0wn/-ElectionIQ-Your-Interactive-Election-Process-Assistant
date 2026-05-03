/**
 * Feature configuration constants
 * Centralized feature definitions for homepage and marketing
 */

import {
  HiOutlineChat,
  HiOutlineMap,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
} from 'react-icons/hi';
import { ROUTES } from './routes';

/**
 * Main application features
 * @constant {Object[]}
 */
export const FEATURES = [
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot',
    description: 'Ask any election-related question and get simple, unbiased answers.',
    icon: HiOutlineChat,
    link: ROUTES.CHAT,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
  {
    id: 'timeline',
    title: 'Interactive Timeline',
    description: 'Step-by-step visual guide from registration to election day.',
    icon: HiOutlineCalendar,
    link: ROUTES.TIMELINE,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  },
  {
    id: 'polling-places',
    title: 'Polling Places',
    description: 'Find nearby polling stations and drop boxes on an interactive map.',
    icon: HiOutlineMap,
    link: ROUTES.MAP,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    id: 'quiz',
    title: 'Election Quiz',
    description: 'Test your civics knowledge with AI-generated explanations.',
    icon: HiOutlineAcademicCap,
    link: ROUTES.QUIZ,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
];

/**
 * Get feature by ID
 * @param {string} id - Feature ID
 * @returns {Object|null} Feature object or null
 */
export function getFeatureById(id) {
  return FEATURES.find((feature) => feature.id === id) || null;
}

/**
 * Get feature by route
 * @param {string} route - Route path
 * @returns {Object|null} Feature object or null
 */
export function getFeatureByRoute(route) {
  return FEATURES.find((feature) => feature.link === route) || null;
}
