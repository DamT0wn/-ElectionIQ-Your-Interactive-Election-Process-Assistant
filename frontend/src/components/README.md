# Components Directory

This directory contains reusable React components used throughout the ElectionIQ application.

## Component Structure

### Core Components

#### `Navbar.jsx`
Navigation bar component displayed at the top of all pages.
- **Features:** Logo, navigation links, theme toggle, user authentication
- **Props:** None (uses context for auth and theme)
- **Accessibility:** Keyboard navigable, ARIA labels

#### `Footer.jsx`
Footer component displayed at the bottom of all pages.
- **Features:** Links, copyright, social media
- **Props:** None
- **Accessibility:** Semantic HTML, proper link labels

#### `ErrorBoundary.jsx`
Error boundary component for graceful error handling.
- **Features:** Catches React errors, displays fallback UI
- **Props:** `children` - Components to wrap
- **Usage:** Wrap around features that might fail

### Chat Components

#### `ChatMessage.jsx`
Individual chat message component (memoized for performance).
- **Props:**
  - `message` - Message object with role and content
  - `isUser` - Boolean indicating if message is from user
  - `userName` - User's display name for avatar
  - `onReadAloud` - Callback for text-to-speech
  - `isPlayingAudio` - Boolean for audio playback state
- **Features:** Markdown rendering, read aloud button, animations
- **Accessibility:** ARIA labels, semantic HTML, keyboard accessible

#### `ChatInput.jsx`
Chat input form component.
- **Props:**
  - `onSend` - Callback when message is sent
  - `isLoading` - Boolean for loading state
  - `disabled` - Boolean to disable input
- **Features:** Auto-resize textarea, keyboard shortcuts, validation
- **Accessibility:** Labels, descriptions, keyboard navigation

#### `TypingIndicator.jsx`
Animated typing indicator for AI responses.
- **Props:** None
- **Features:** Animated dots, ARIA live region
- **Accessibility:** Screen reader announcements

#### `FloatingChat.jsx`
Floating chat widget displayed on all pages.
- **Features:** Minimizable, quick access to chat
- **Props:** None (uses chat context)
- **Accessibility:** Keyboard accessible, ARIA labels

## Usage Examples

### ChatMessage
```jsx
import { ChatMessage } from '../components/ChatMessage';

<ChatMessage
  message={{ role: 'model', parts: [{ text: 'Hello!' }] }}
  isUser={false}
  userName="John"
  onReadAloud={handleReadAloud}
  isPlayingAudio={false}
/>
```

### ChatInput
```jsx
import { ChatInput } from '../components/ChatInput';

<ChatInput
  onSend={(message) => console.log(message)}
  isLoading={false}
  disabled={false}
/>
```

### ErrorBoundary
```jsx
import { ErrorBoundary } from '../components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Best Practices

1. **Memoization:** Use `React.memo` for components that receive stable props
2. **Accessibility:** Always include ARIA labels and semantic HTML
3. **Props Documentation:** Document all props with JSDoc comments
4. **Error Handling:** Wrap risky components in ErrorBoundary
5. **Performance:** Use `useCallback` and `useMemo` for expensive operations

## Testing

All components should have corresponding test files:
- `ComponentName.test.jsx` - Unit tests
- Test accessibility with `jest-axe`
- Test user interactions with `@testing-library/react`

## Styling

- Use CSS variables for theming (defined in `globals.css`)
- Use Tailwind utility classes for layout and spacing
- Use inline styles only for dynamic values
- Maintain consistent spacing and sizing

## Dependencies

- `react` - Core React library
- `framer-motion` - Animations
- `react-markdown` - Markdown rendering
- `react-icons` - Icon library

## Contributing

When adding new components:
1. Create component file in this directory
2. Add JSDoc comments for props
3. Include accessibility features
4. Add to this README
5. Write tests
6. Update storybook (if applicable)
