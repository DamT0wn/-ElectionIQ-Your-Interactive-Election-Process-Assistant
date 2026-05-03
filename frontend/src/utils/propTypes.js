/**
 * Prop type validation utilities
 * Provides runtime prop validation for better code quality
 */

/**
 * Validates that a value is a non-empty string
 * @param {*} value - Value to validate
 * @param {string} propName - Name of the prop
 * @param {string} componentName - Name of the component
 * @throws {Error} If validation fails
 */
export function validateString(value, propName, componentName) {
  if (typeof value !== 'string') {
    throw new Error(
      `Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`string\`.`
    );
  }
}

/**
 * Validates that a value is a function
 * @param {*} value - Value to validate
 * @param {string} propName - Name of the prop
 * @param {string} componentName - Name of the component
 * @throws {Error} If validation fails
 */
export function validateFunction(value, propName, componentName) {
  if (typeof value !== 'function') {
    throw new Error(
      `Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`function\`.`
    );
  }
}

/**
 * Validates that a value is a boolean
 * @param {*} value - Value to validate
 * @param {string} propName - Name of the prop
 * @param {string} componentName - Name of the component
 * @throws {Error} If validation fails
 */
export function validateBoolean(value, propName, componentName) {
  if (typeof value !== 'boolean') {
    throw new Error(
      `Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`boolean\`.`
    );
  }
}

/**
 * Validates that a value is an object
 * @param {*} value - Value to validate
 * @param {string} propName - Name of the prop
 * @param {string} componentName - Name of the component
 * @throws {Error} If validation fails
 */
export function validateObject(value, propName, componentName) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      `Invalid prop \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected \`object\`.`
    );
  }
}

/**
 * Validates message object structure
 * @param {*} message - Message object to validate
 * @returns {boolean} True if valid
 */
export function isValidMessage(message) {
  return (
    message &&
    typeof message === 'object' &&
    typeof message.role === 'string' &&
    Array.isArray(message.parts) &&
    message.parts.length > 0 &&
    message.parts[0].text !== undefined
  );
}

/**
 * Validates user object structure
 * @param {*} user - User object to validate
 * @returns {boolean} True if valid
 */
export function isValidUser(user) {
  return user && typeof user === 'object' && typeof user.uid === 'string' && user.uid.length > 0;
}
