import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer
      className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark"
      role="contentinfo"
    >
      <div className="section-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">IQ</span>
              </div>
              <span className="font-display font-bold text-lg gradient-text">ElectionIQ</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Your interactive election process assistant. Empowering civic participation through AI-powered education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Explore</h3>
            <ul className="space-y-2">
              {[
                { to: '/timeline', label: 'Election Timeline' },
                { to: '/chat', label: 'AI Assistant' },
                { to: '/quiz', label: 'Election Quiz' },
                { to: '/map', label: 'Find Polling Places' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">About</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ElectionIQ provides non-partisan, educational content about the election process. It does not endorse any candidate or party.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Powered by Google Cloud AI services.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-1">
            © {new Date().getFullYear()} ElectionIQ. Made with <HiHeart className="w-4 h-4 text-red-500 inline" /> for democracy.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 dark:text-slate-600 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
              ☁️ Deployed on Google Cloud Run
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
