/**
 * Application route constants
 * Centralized route definitions for better maintainability
 */

/**
 * Application routes
 * @constant {Object}
 */
export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  TIMELINE: '/timeline',
  MAP: '/map',
  CALENDAR: '/calendar',
  QUIZ: '/quiz',
  PROGRESS: '/progress',
};

/**
 * Route metadata for navigation
 * @constant {Object[]}
 */
export const ROUTE_METADATA = [
  {
    path: ROUTES.HOME,
    title: 'Home',
    description: 'Welcome to ElectionIQ',
    showInNav: false,
  },
  {
    path: ROUTES.CHAT,
    title: 'AI Assistant',
    description: 'Chat with AI about elections',
    showInNav: true,
    icon: 'HiOutlineChat',
  },
  {
    path: ROUTES.TIMELINE,
    title: 'Election Timeline',
    description: 'Step-by-step election process',
    showInNav: true,
    icon: 'HiOutlineCalendar',
  },
  {
    path: ROUTES.MAP,
    title: 'Polling Places',
    description: 'Find your polling location',
    showInNav: true,
    icon: 'HiOutlineMap',
  },
  {
    path: ROUTES.CALENDAR,
    title: 'Calendar',
    description: 'Important election dates',
    showInNav: true,
    icon: 'HiOutlineCalendar',
  },
  {
    path: ROUTES.QUIZ,
    title: 'Quiz',
    description: 'Test your civics knowledge',
    showInNav: true,
    icon: 'HiOutlineAcademicCap',
  },
  {
    path: ROUTES.PROGRESS,
    title: 'Progress',
    description: 'Track your voter journey',
    showInNav: true,
    icon: 'HiOutlineChartBar',
  },
];

/**
 * Get route metadata by path
 * @param {string} path - Route path
 * @returns {Object|null} Route metadata or null
 */
export function getRouteMetadata(path) {
  return ROUTE_METADATA.find((route) => route.path === path) || null;
}

/**
 * Get all navigation routes
 * @returns {Object[]} Routes that should show in navigation
 */
export function getNavigationRoutes() {
  return ROUTE_METADATA.filter((route) => route.showInNav);
}
