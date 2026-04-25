import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid var(--footer-border)',
        background: 'var(--footer-bg)',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="section-container" style={{ padding: '40px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--brand-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 12 }}>IQ</span>
              </div>
              <span className="gradient-text" style={{ fontWeight: 700, fontSize: 18 }}>ElectionIQ</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 260, lineHeight: 1.6 }}>
              Your interactive election process assistant. Empowering civic participation through AI-powered education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, fontSize: 15 }}>Explore</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/timeline', label: 'Election Timeline' },
                { to: '/chat', label: 'AI Assistant' },
                { to: '/quiz', label: 'Election Quiz' },
                { to: '/map', label: 'Find Polling Places' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, fontSize: 15 }}>About</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              ElectionIQ provides non-partisan, educational content about the election process. It does not endorse any candidate or party.
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>
              Powered by Google Cloud AI services.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 32, paddingTop: 24,
          borderTop: '1px solid var(--footer-border)',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: 16
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            © {new Date().getFullYear()} ElectionIQ. Made with{' '}
            <HiHeart style={{ color: '#ef4444', display: 'inline', width: 14, height: 14 }} />{' '}
            for democracy.
          </p>
          <span style={{
            fontSize: 12, color: 'var(--text-muted)',
            padding: '4px 12px', borderRadius: 999,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)'
          }}>
            ☁️ Deployed on Google Cloud Run
          </span>
        </div>
      </div>
    </footer>
  );
}
