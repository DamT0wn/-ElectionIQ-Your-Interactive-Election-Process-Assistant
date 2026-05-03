/**
 * Input validation utilities
 * Centralized validation logic for forms and user input
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate message text
 * @param {string} text - Message text to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length
 * @param {number} options.maxLength - Maximum length
 * @returns {Object} Validation result
 */
export function validateMessageText(text, options = {}) {
  const { minLength = 1, maxLength = 5000 } = options;

  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Message cannot be empty' };
  }

  const trimmed = text.trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: `Message must be at least ${minLength} characters` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `Message must be less than ${maxLength} characters` };
  }

  return { valid: true, value: trimmed };
}

/**
 * Sanitize user input
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validate quiz answer selection
 * @param {number} index - Selected option index
 * @param {number} totalOptions - Total number of options
 * @returns {boolean} True if valid
 */
export function isValidQuizAnswer(index, totalOptions) {
  return typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < totalOptions;
}

/**
 * Validate difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {boolean} True if valid
 */
export function isValidDifficulty(difficulty) {
  const validLevels = ['easy', 'medium', 'hard'];
  return validLevels.includes(difficulty);
}

/**
 * Validate topic string
 * @param {string} topic - Topic string
 * @param {string[]} validTopics - Array of valid topics
 * @returns {boolean} True if valid
 */
export function isValidTopic(topic, validTopics = []) {
  if (!topic || typeof topic !== 'string') return false;
  if (validTopics.length === 0) return true; // Allow any topic if no list provided
  return validTopics.includes(topic.toLowerCase());
}

/**
 * Validate file upload
 * @param {File} file - File object
 * @param {Object} options - Validation options
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @param {number} options.maxSize - Maximum file size in bytes
 * @returns {Object} Validation result
 */
export function validateFileUpload(file, options = {}) {
  const { allowedTypes = [], maxSize = 10 * 1024 * 1024 } = options; // 10MB default

  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'Invalid file' };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not allowed` };
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
  }

  return { valid: true };
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate date string
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid
 */
export function isValidDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
