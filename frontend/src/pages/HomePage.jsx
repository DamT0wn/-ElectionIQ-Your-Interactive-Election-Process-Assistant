import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FEATURES } from '../constants/features';
import { ROUTES } from '../constants/routes';

/**
 * Home page component
 * Landing page with hero section, features grid, and CTA
 */
export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden hero-gradient text-white py-20 lg:py-32"
        aria-label="Hero section"
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

        <div className="section-container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium border border-white/30 text-white shadow-lg shadow-black/10">
                Your Interactive Election Assistant
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-display font-bold text-balance leading-tight"
            >
              Democracy, <br className="hidden sm:block" />
              Simplified.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto text-balance"
            >
              ElectionIQ empowers you with knowledge. Understand the election process, track your
              voter journey, and get AI-powered answers to all your election questions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to={ROUTES.TIMELINE}
                className="btn-primary w-full sm:w-auto bg-white text-primary-900 hover:bg-slate-50 shadow-white/20"
                aria-label="Start your voter journey with the election timeline"
              >
                Start Your Journey
              </Link>
              <Link
                to={ROUTES.CHAT}
                className="btn-secondary w-full sm:w-auto bg-primary-900/40 border-primary-400/50 text-white hover:bg-primary-800/60"
                aria-label="Ask questions to the AI assistant"
              >
                Ask the AI Assistant
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div
          className="absolute top-1/4 left-10 w-32 h-32 bg-accent-500/30 rounded-full blur-3xl animate-float"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-10 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl animate-float animate-delay-200"
          aria-hidden="true"
        />
      </section>

      {/* Features Grid */}
      <section
        style={{ padding: '80px 0', background: 'var(--bg-surface)' }}
        aria-labelledby="features-heading"
      >
        <div className="section-container">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 64px' }}>
            <h2
              id="features-heading"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              Everything you need to be an informed voter
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Explore our suite of tools designed to guide you through every step of the democratic
              process.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 24,
            }}
            role="list"
            aria-label="Application features"
          >
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                role="listitem"
              >
                <Link
                  to={feature.link}
                  style={{ display: 'block', height: '100%', textDecoration: 'none' }}
                  aria-label={`${feature.title}: ${feature.description}`}
                >
                  <div className="glass-card" style={{ height: '100%', padding: 24 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: feature.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        boxShadow: `0 4px 12px ${feature.color}40`,
                      }}
                      aria-hidden="true"
                    >
                      <feature.icon style={{ width: 24, height: 24 }} />
                    </div>
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: 8,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '80px 0',
          background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--border-subtle)',
        }}
        aria-labelledby="cta-heading"
      >
        <div className="section-container">
          <div
            style={{
              background: 'rgba(99,102,241,0.08)',
              borderRadius: 24,
              padding: '48px 40px',
              textAlign: 'center',
              border: '1px solid var(--border-brand)',
              maxWidth: 800,
              margin: '0 auto',
            }}
          >
            <h2
              id="cta-heading"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              Ready to take the next step?
            </h2>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                marginBottom: 32,
                maxWidth: 500,
                margin: '0 auto 32px',
              }}
            >
              Create an account to track your election progress, save important dates, and keep a
              history of your AI chats.
            </p>
            {!user && (
              <button className="btn-primary" aria-label="Sign in with Google to get started">
                Sign in with Google
              </button>
            )}
            {user && (
              <Link
                to={ROUTES.PROGRESS}
                className="btn-primary"
                style={{ textDecoration: 'none' }}
                aria-label="View your voter progress"
              >
                View Your Progress
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
