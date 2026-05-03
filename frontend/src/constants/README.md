# Constants Directory

This directory contains application-wide constants and configuration values for better maintainability and consistency.

## Files

### `routes.js`
Application route definitions and metadata.

**Exports:**
- `ROUTES` - Object with all route paths
- `ROUTE_METADATA` - Array of route metadata objects
- `getRouteMetadata(path)` - Get metadata for a specific route
- `getNavigationRoutes()` - Get routes that should show in navigation

**Usage:**
```javascript
import { ROUTES, getRouteMetadata } from '../constants/routes';

// Use in navigation
<Link to={ROUTES.CHAT}>Chat</Link>

// Get route metadata
const metadata = getRouteMetadata(ROUTES.CHAT);
console.log(metadata.title); // "AI Assistant"
```

### `features.js`
Feature configuration for homepage and marketing.

**Exports:**
- `FEATURES` - Array of feature objects with icons, colors, and descriptions
- `getFeatureById(id)` - Get feature by ID
- `getFeatureByRoute(route)` - Get feature by route path

**Usage:**
```javascript
import { FEATURES, getFeatureById } from '../constants/features';

// Render features
{FEATURES.map(feature => (
  <FeatureCard key={feature.id} {...feature} />
))}

// Get specific feature
const chatFeature = getFeatureById('ai-chatbot');
```

### `quiz.js`
Quiz-related constants and configuration.

**Exports:**
- `FALLBACK_QUIZ_TOPICS` - Default topics if API fails
- `DIFFICULTY_LEVELS` - Difficulty levels with styling
- `QUIZ_STATES` - Game state constants
- `DEFAULT_QUIZ_CONFIG` - Default configuration
- `QUIZ_ERRORS` - Error messages
- `QUIZ_MESSAGES` - Success/info messages

**Usage:**
```javascript
import { DIFFICULTY_LEVELS, QUIZ_STATES, QUIZ_ERRORS } from '../constants/quiz';

// Use difficulty levels
{DIFFICULTY_LEVELS.map(level => (
  <Button key={level.level} color={level.color}>
    {level.label}
  </Button>
))}

// Use game states
if (gameState === QUIZ_STATES.PLAYING) {
  // Show quiz
}

// Use error messages
showError(QUIZ_ERRORS.LOAD_FAILED);
```

## Benefits

### 1. Single Source of Truth
All configuration values are defined in one place, making updates easier and reducing bugs.

```javascript
// ❌ Bad - Hardcoded values scattered everywhere
<Link to="/chat">Chat</Link>
<Link to="/chat">AI Assistant</Link>
<Link to="/chat">Chatbot</Link>

// ✅ Good - Centralized constants
import { ROUTES } from '../constants/routes';
<Link to={ROUTES.CHAT}>Chat</Link>
```

### 2. Type Safety
Constants provide better IDE autocomplete and catch typos at development time.

```javascript
// ❌ Bad - Typo not caught until runtime
<Link to="/chatt">Chat</Link>

// ✅ Good - IDE will autocomplete and catch typos
<Link to={ROUTES.CHAT}>Chat</Link>
```

### 3. Easier Refactoring
Changing a route or feature is as simple as updating one constant.

```javascript
// Change route from /chat to /assistant
// Only need to update ROUTES.CHAT in one place
export const ROUTES = {
  CHAT: '/assistant', // Changed here
  // All usages automatically updated
};
```

### 4. Better Testing
Constants make it easier to test components with consistent data.

```javascript
import { FEATURES } from '../constants/features';

test('renders all features', () => {
  render(<FeatureGrid features={FEATURES} />);
  expect(screen.getAllByRole('listitem')).toHaveLength(FEATURES.length);
});
```

## Best Practices

### 1. Use UPPER_SNAKE_CASE for Constants
```javascript
// ✅ Good
export const MAX_MESSAGE_LENGTH = 5000;
export const DEFAULT_DIFFICULTY = 'medium';

// ❌ Bad
export const maxMessageLength = 5000;
export const defaultDifficulty = 'medium';
```

### 2. Group Related Constants
```javascript
// ✅ Good
export const QUIZ_STATES = {
  SETUP: 'setup',
  PLAYING: 'playing',
  RESULT: 'result',
};

// ❌ Bad
export const QUIZ_STATE_SETUP = 'setup';
export const QUIZ_STATE_PLAYING = 'playing';
export const QUIZ_STATE_RESULT = 'result';
```

### 3. Add JSDoc Comments
```javascript
/**
 * Maximum length for chat messages
 * @constant {number}
 */
export const MAX_MESSAGE_LENGTH = 5000;
```

### 4. Export Helper Functions
```javascript
/**
 * Get feature by ID
 * @param {string} id - Feature ID
 * @returns {Object|null} Feature object or null
 */
export function getFeatureById(id) {
  return FEATURES.find(f => f.id === id) || null;
}
```

## Adding New Constants

When adding new constants:

1. **Create a new file** if it's a new category
2. **Add JSDoc comments** for all exports
3. **Export helper functions** if needed
4. **Update this README** with usage examples
5. **Use the constants** throughout the codebase

Example:
```javascript
// constants/theme.js

/**
 * Theme color constants
 * @constant {Object}
 */
export const THEME_COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#3b82f6',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
};

/**
 * Get theme color by name
 * @param {string} name - Color name
 * @returns {string} Hex color code
 */
export function getThemeColor(name) {
  return THEME_COLORS[name.toUpperCase()] || THEME_COLORS.PRIMARY;
}
```

## Migration Guide

To migrate existing hardcoded values to constants:

1. **Identify repeated values** in your codebase
2. **Create appropriate constant** in this directory
3. **Replace all occurrences** with the constant
4. **Test thoroughly** to ensure nothing broke

Example migration:
```javascript
// Before
<Link to="/chat">Chat</Link>
<Link to="/timeline">Timeline</Link>
<Link to="/quiz">Quiz</Link>

// After
import { ROUTES } from '../constants/routes';

<Link to={ROUTES.CHAT}>Chat</Link>
<Link to={ROUTES.TIMELINE}>Timeline</Link>
<Link to={ROUTES.QUIZ}>Quiz</Link>
```

## Testing

Constants should be tested to ensure they're valid:

```javascript
import { ROUTES, ROUTE_METADATA } from './routes';

describe('Routes', () => {
  it('should have valid route paths', () => {
    Object.values(ROUTES).forEach(route => {
      expect(route).toMatch(/^\//);
    });
  });

  it('should have metadata for all routes', () => {
    Object.values(ROUTES).forEach(route => {
      const metadata = ROUTE_METADATA.find(m => m.path === route);
      expect(metadata).toBeDefined();
    });
  });
});
```

## Dependencies

- `react-icons` - For feature icons
- None otherwise (pure JavaScript constants)
