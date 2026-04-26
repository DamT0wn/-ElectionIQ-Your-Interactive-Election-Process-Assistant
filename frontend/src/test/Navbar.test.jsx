import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock contexts
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ darkMode: false, toggleDarkMode: vi.fn() }),
}));

const mockUseAuth = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

import Navbar from '../components/Navbar';

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('renders the ElectionIQ logo', () => {
    mockUseAuth.mockReturnValue({ user: null, signInWithGoogle: vi.fn(), signOut: vi.fn(), signInDemo: vi.fn(), isFirebaseConfigured: false });
    renderNavbar();
    expect(screen.getByLabelText('ElectionIQ Home')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    mockUseAuth.mockReturnValue({ user: null, signInWithGoogle: vi.fn(), signOut: vi.fn(), signInDemo: vi.fn(), isFirebaseConfigured: false });
    renderNavbar();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
    expect(screen.getByText('Polling Map')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('shows Sign In button when user is not logged in', () => {
    mockUseAuth.mockReturnValue({ user: null, signInWithGoogle: vi.fn(), signOut: vi.fn(), signInDemo: vi.fn(), isFirebaseConfigured: false });
    renderNavbar();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('has correct aria-label on navigation', () => {
    mockUseAuth.mockReturnValue({ user: null, signInWithGoogle: vi.fn(), signOut: vi.fn(), signInDemo: vi.fn(), isFirebaseConfigured: false });
    renderNavbar();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('shows user display name when logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { displayName: 'John Doe', email: 'john@example.com', photoURL: null, uid: '123' },
      signInWithGoogle: vi.fn(), signOut: vi.fn(), signInDemo: vi.fn(), isFirebaseConfigured: true,
    });
    renderNavbar();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });
});
