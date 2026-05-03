/**
 * Error handling utilities
 * Centralized error handling and logging
 */

/**
 * Error types for categorization
 * @constant {Object}
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * User-friendly error messages
 * @constant {Object}
 */
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network error. Please check your internet connection and try again.',
  [ERROR_TYPES.API]: 'Server error. Please try again in a moment.',
  [ERROR_TYPES.VALIDATION]: 'Invalid input. Please check your data and try again.',
  [ERROR_TYPES.AUTH]: 'Authentication error. Please sign in again.',
  [ERROR_TYPES.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

/**
 * Categorize error by type
 * @param {Error} error - Error object
 * @returns {string} Error type
 */
export function categorizeError(error) {
  if (!error) return ERROR_TYPES.UNKNOWN;

  const message = error.message?.toLowerCase() || '';

  if (message.includes('network') || message.includes('fetch')) {
    return ERROR_TYPES.NETWORK;
  }
  if (message.includes('rate limit') || message.includes('too many')) {
    return ERROR_TYPES.RATE_LIMIT;
  }
  if (message.includes('auth') || message.includes('unauthorized')) {
    return ERROR_TYPES.AUTH;
  }
  if (message.includes('validation') || message.includes('invalid')) {
    return ERROR_TYPES.VALIDATION;
  }
  if (error.response || message.includes('api') || message.includes('server')) {
    return ERROR_TYPES.API;
  }

  return ERROR_TYPES.UNKNOWN;
}

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export function getUserFriendlyMessage(error) {
  const errorType = categorizeError(error);
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];
}

/**
 * Log error with context
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export function logError(error, context = {}) {
  const errorType = categorizeError(error);
  const timestamp = new Date().toISOString();

  console.error('[ElectionIQ Error]', {
    timestamp,
    type: errorType,
    message: error.message,
    stack: error.stack,
    context,
  });

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to Sentry, LogRocket, etc.
  }
}

/**
 * Handle API error with retry logic
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum retry attempts
 * @param {number} options.delay - Delay between retries (ms)
 * @returns {Promise} API response
 */
export async function handleApiWithRetry(apiCall, options = {}) {
  const { maxRetries = 3, delay = 1000 } = options;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      const errorType = categorizeError(error);

      // Don't retry validation or auth errors
      if (errorType === ERROR_TYPES.VALIDATION || errorType === ERROR_TYPES.AUTH) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}

/**
 * Create error boundary fallback component
 * @param {Error} error - Error object
 * @param {Function} resetErrorBoundary - Reset function
 * @returns {JSX.Element} Fallback UI
 */
export function createErrorFallback(error, resetErrorBoundary) {
  return {
    title: 'Oops! Something went wrong',
    message: getUserFriendlyMessage(error),
    action: resetErrorBoundary,
    actionLabel: 'Try Again',
  };
}
