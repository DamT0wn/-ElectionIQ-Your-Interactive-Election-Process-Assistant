import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineChat,
  HiOutlineMap,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineClock,
} from 'react-icons/hi';

const NAV_LINKS = [
  { path: '/timeline', label: 'Timeline', icon: HiOutlineClock },
  { path: '/chat', label: 'AI Chat', icon: HiOutlineChat },
  { path: '/map', label: 'Polling Map', icon: HiOutlineMap },
  { path: '/calendar', label: 'Calendar', icon: HiOutlineCalendar },
  { path: '/quiz', label: 'Quiz', icon: HiOutlineAcademicCap },
  { path: '/progress', label: 'Progress', icon: HiOutlineChartBar },
];

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, signInWithGoogle, signOut, signInDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // Fallback to demo mode if Firebase not configured
      signInDemo();
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-surface-dark/80 border-b border-slate-200/50 dark:border-slate-700/50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="ElectionIQ Home"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25"
            >
              <span className="text-white font-display font-bold text-sm">IQ</span>
            </motion.div>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">
              ElectionIQ
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link flex items-center gap-1.5 text-sm ${
                  location.pathname === path ? 'active' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn-ghost p-2 rounded-xl"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <HiOutlineSun className="w-5 h-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <HiOutlineMoon className="w-5 h-5 text-slate-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-primary-700 dark:text-primary-300 max-w-[100px] truncate">
                    {user.displayName || 'User'}
                  </span>
                </div>
                <button onClick={signOut} className="btn-ghost text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={handleSignIn} className="btn-primary text-sm py-2 px-4">
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-ghost p-2 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="section-container py-4 space-y-1">
              {NAV_LINKS.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location.pathname === path
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
