# Utils Directory

This directory contains utility functions and helper modules used throughout the ElectionIQ application.

## Modules

### `propTypes.js`
Runtime prop validation utilities for better type safety.

**Functions:**
- `validateString(value, propName, componentName)` - Validates string props
- `validateFunction(value, propName, componentName)` - Validates function props
- `validateBoolean(value, propName, componentName)` - Validates boolean props
- `validateObject(value, propName, componentName)` - Validates object props
- `isValidMessage(message)` - Validates chat message structure
- `isValidUser(user)` - Validates user object structure

**Usage:**
```javascript
import { validateString, isValidMessage } from '../utils/propTypes';

function MyComponent({ title, message }) {
  validateString(title, 'title', 'MyComponent');
  if (!isValidMessage(message)) {
    throw new Error('Invalid message format');
  }
  // ...
}
```

### `errorHandling.js`
Centralized error handling and logging utilities.

**Constants:**
- `ERROR_TYPES` - Error type categories
- `ERROR_MESSAGES` - User-friendly error messages

**Functions:**
- `categorizeError(error)` - Categorize error by type
- `getUserFriendlyMessage(error)` - Get user-friendly error message
- `logError(error, context)` - Log error with context
- `handleApiWithRetry(apiCall, options)` - Retry failed API calls
- `createErrorFallback(error, resetErrorBoundary)` - Create error boundary fallback

**Usage:**
```javascript
import { logError, getUserFriendlyMessage, handleApiWithRetry } from '../utils/errorHandling';

try {
  const data = await handleApiWithRetry(() => fetchData(), { maxRetries: 3 });
} catch (error) {
  logError(error, { component: 'MyComponent', action: 'fetchData' });
  showError(getUserFriendlyMessage(error));
}
```

### `validation.js`
Input validation utilities for forms and user input.

**Functions:**
- `isValidEmail(email)` - Validate email format
- `validateMessageText(text, options)` - Validate message text
- `sanitizeInput(input)` - Sanitize user input
- `isValidQuizAnswer(index, totalOptions)` - Validate quiz answer
- `isValidDifficulty(difficulty)` - Validate difficulty level
- `isValidTopic(topic, validTopics)` - Validate topic string
- `validateFileUpload(file, options)` - Validate file upload
- `isValidUrl(url)` - Validate URL format
- `isValidDate(dateString)` - Validate date string

**Usage:**
```javascript
import { validateMessageText, sanitizeInput } from '../utils/validation';

function handleSubmit(rawInput) {
  const sanitized = sanitizeInput(rawInput);
  const validation = validateMessageText(sanitized, { minLength: 1, maxLength: 1000 });
  
  if (!validation.valid) {
    showError(validation.error);
    return;
  }
  
  sendMessage(validation.value);
}
```

### `api.js`
API client utilities for backend communication.

**Functions:**
- `sendMessage(message, history, userId, sessionId)` - Send chat message
- `synthesizeSpeech(text)` - Convert text to speech
- `getChatHistory(userId, sessionId)` - Get chat history
- `getQuizTopics()` - Get quiz topics
- `generateQuizQuestion(topic, difficulty)` - Generate quiz question
- `explainQuizAnswer(question, userAnswer, correctAnswer, isCorrect)` - Get answer explanation
- `submitQuizResult(userId, result)` - Submit quiz result

**Usage:**
```javascript
import { sendMessage, synthesizeSpeech } from '../services/api';

const response = await sendMessage('What is voter registration?', [], userId, sessionId);
const audio = await synthesizeSpeech(response.text);
```

## Best Practices

### Error Handling
Always use the error handling utilities for consistent error management:

```javascript
// ❌ Bad
try {
  await apiCall();
} catch (error) {
  console.error(error);
  alert('Error!');
}

// ✅ Good
try {
  await handleApiWithRetry(() => apiCall(), { maxRetries: 3 });
} catch (error) {
  logError(error, { component: 'MyComponent' });
  showError(getUserFriendlyMessage(error));
}
```

### Input Validation
Always validate and sanitize user input:

```javascript
// ❌ Bad
function handleInput(input) {
  sendToServer(input);
}

// ✅ Good
function handleInput(input) {
  const sanitized = sanitizeInput(input);
  const validation = validateMessageText(sanitized);
  
  if (!validation.valid) {
    showError(validation.error);
    return;
  }
  
  sendToServer(validation.value);
}
```

### Prop Validation
Use prop validation in development for better debugging:

```javascript
// ✅ Good
function ChatMessage({ message, onReadAloud }) {
  if (process.env.NODE_ENV === 'development') {
    if (!isValidMessage(message)) {
      console.warn('Invalid message prop:', message);
    }
    validateFunction(onReadAloud, 'onReadAloud', 'ChatMessage');
  }
  
  // Component logic
}
```

## Testing

All utility functions should have corresponding test files:
- `propTypes.test.js` - Prop validation tests
- `errorHandling.test.js` - Error handling tests
- `validation.test.js` - Input validation tests

Example test:
```javascript
import { isValidEmail } from './validation';

describe('isValidEmail', () => {
  it('should validate correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });
});
```

## Contributing

When adding new utilities:
1. Create utility file in this directory
2. Add comprehensive JSDoc comments
3. Export all functions
4. Add to this README
5. Write tests
6. Use TypeScript-style JSDoc for better IDE support

## Dependencies

- None (pure JavaScript utilities)
- All utilities are framework-agnostic where possible
