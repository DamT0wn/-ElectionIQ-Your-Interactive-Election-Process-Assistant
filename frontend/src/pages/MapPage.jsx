import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MapPage() {
  const [address, setAddress] = useState('');

  const handleSearch = () => {
    // Open India's official voter portal
    window.open('https://voters.eci.gov.in/', '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '60px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 800, 
            color: 'var(--text-primary)', 
            marginBottom: 12 
          }}
        >
          Find Your <span className="page-title-gradient">Polling Place</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}
        >
          Find polling locations and voter information
        </motion.p>
      </div>

      {/* Main Card */}
      <div style={{ 
        maxWidth: 600, 
        margin: '0 auto', 
        background: 'var(--glass-bg)', 
        border: '1px solid var(--glass-border)', 
        borderRadius: 20, 
        padding: '48px 40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🗳️</div>
        <h3 style={{ 
          fontSize: '1.4rem', 
          fontWeight: 700, 
          color: 'var(--text-primary)', 
          marginBottom: 12 
        }}>
          Official Polling Place Finder
        </h3>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 16, 
          marginBottom: 24,
          lineHeight: 1.6
        }}>
          Use the official Election Commission of India portal to find your polling station, check voter registration, and access election information.
        </p>

        {/* Address Input */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Enter your address or EPIC number"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 10,
              border: '1px solid var(--border-default)',
              background: 'var(--input-bg)',
              color: 'var(--text-primary)',
              fontSize: 15,
              outline: 'none',
              marginBottom: 16
            }}
          />
          <button
            onClick={handleSearch}
            className="btn-primary"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              fontSize: 16,
              width: '100%',
              justifyContent: 'center'
            }}
          >
            Find Your Polling Station →
          </button>
        </div>

        {/* Info Box */}
        <div style={{ 
          marginTop: 32, 
          padding: 20, 
          background: 'var(--bg-elevated)', 
          borderRadius: 12,
          textAlign: 'left'
        }}>
          <h4 style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            marginBottom: 12 
          }}>
            What You Can Find:
          </h4>
          <ul style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 14, 
            lineHeight: 1.8,
            paddingLeft: 20,
            margin: 0
          }}>
            <li>Your polling station location</li>
            <li>Voter registration status</li>
            <li>EPIC (Voter ID) card details</li>
            <li>Election dates and schedules</li>
          </ul>
        </div>

        {/* Official Links */}
        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          background: 'rgba(99,102,241,0.1)', 
          border: '1px solid var(--border-brand)', 
          borderRadius: 12 
        }}>
          <p style={{ 
            fontSize: 13, 
            color: 'var(--text-secondary)', 
            margin: 0,
            marginBottom: 12
          }}>
            📌 <strong style={{ color: 'var(--text-primary)' }}>Official Resources:</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a 
              href="https://voters.eci.gov.in/" 
              target="_blank" 
              rel="noreferrer"
              style={{ 
                color: 'var(--accent-primary)', 
                fontSize: 13, 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              🔗 National Voters' Service Portal
            </a>
            <a 
              href="https://eci.gov.in/" 
              target="_blank" 
              rel="noreferrer"
              style={{ 
                color: 'var(--accent-primary)', 
                fontSize: 13, 
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              🔗 Election Commission of India
            </a>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ 
        maxWidth: 800, 
        margin: '48px auto 0', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 20 
      }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📍</div>
          <h4 style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            marginBottom: 8 
          }}>
            Polling Station
          </h4>
          <p style={{ 
            fontSize: 14, 
            color: 'var(--text-secondary)', 
            lineHeight: 1.6,
            margin: 0
          }}>
            Find your designated polling station based on your registered address and constituency.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🆔</div>
          <h4 style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            marginBottom: 8 
          }}>
            Voter ID
          </h4>
          <p style={{ 
            fontSize: 14, 
            color: 'var(--text-secondary)', 
            lineHeight: 1.6,
            margin: 0
          }}>
            Check your EPIC (Voter ID) card status and download your e-EPIC card online.
          </p>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📅</div>
          <h4 style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            marginBottom: 8 
          }}>
            Election Schedule
          </h4>
          <p style={{ 
            fontSize: 14, 
            color: 'var(--text-secondary)', 
            lineHeight: 1.6,
            margin: 0
          }}>
            View upcoming election dates, phases, and important deadlines for your constituency.
          </p>
        </div>
      </div>
    </div>
  );
}
