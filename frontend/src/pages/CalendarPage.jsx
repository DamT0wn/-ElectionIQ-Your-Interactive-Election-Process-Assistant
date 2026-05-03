import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { getElectionEvents } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthProvider, getAuth, reauthenticateWithPopup } from 'firebase/auth';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, signInWithGoogle } = useAuth();
  const [addingEvent, setAddingEvent] = useState(null);
  const [addedEvents, setAddedEvents] = useState(new Set());
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    getElectionEvents(new Date().getFullYear())
      .then((data) => setEvents(data.events || []))
      .catch((err) => console.error('Failed to load events:', err))
      .finally(() => setLoading(false));
  }, []);

  const showStatus = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  // Get a fresh Google OAuth access token from Firebase
  const getGoogleAccessToken = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    try {
      // Get the credential with calendar scope
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      const result = await reauthenticateWithPopup(currentUser, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      return credential?.accessToken || null;
    } catch (err) {
      console.warn('Could not get calendar access token:', err.code);
      return null;
    }
  };

  const addToGoogleCalendar = async (event) => {
    // Sign in first if not authenticated
    if (!user) {
      try {
        await signInWithGoogle();
      } catch {
        showStatus('Please sign in to add events to your calendar.', 'error');
        return;
      }
    }

    setAddingEvent(event.id);

    try {
      // Try direct Google Calendar API insertion using OAuth token
      const accessToken = await getGoogleAccessToken();

      if (accessToken) {
        const calendarEvent = {
          summary: event.title,
          description: event.description,
          start: { date: event.date },
          end: { date: event.endDate || event.date },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 60 },
            ],
          },
        };

        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(calendarEvent),
          }
        );

        if (response.ok) {
          setAddedEvents((prev) => new Set([...prev, event.id]));
          showStatus(`✅ "${event.title}" added to your Google Calendar!`, 'success');
          return;
        }
      }

      // Fallback: open Google Calendar web UI with pre-filled event
      const startDate = event.date.replace(/-/g, '');
      const endDate = (event.endDate || event.date).replace(/-/g, '');
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}`;
      window.open(url, '_blank');
      setAddedEvents((prev) => new Set([...prev, event.id]));
      showStatus(`Opened "${event.title}" in Google Calendar.`, 'success');
    } catch (err) {
      console.error(err);
      // Final fallback
      const startDate = event.date.replace(/-/g, '');
      const endDate = (event.endDate || event.date).replace(/-/g, '');
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}`;
      window.open(url, '_blank');
      showStatus('Opened in Google Calendar.', 'success');
    } finally {
      setAddingEvent(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}
        >
          Smart Election <span className="page-title-gradient">Calendar</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}
        >
          Never miss an important deadline. Add key election dates directly to your Google Calendar.
        </motion.p>
      </div>

      {/* Status message */}
      {statusMsg.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: 700,
            margin: '0 auto 24px',
            padding: '14px 20px',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
            background:
              statusMsg.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color: statusMsg.type === 'success' ? '#4ade80' : '#f87171',
          }}
        >
          {statusMsg.type === 'success' ? (
            <HiOutlineCheckCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
          ) : (
            <HiOutlineExclamationCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
          )}
          {statusMsg.text}
        </motion.div>
      )}

      {/* Sign-in prompt */}
      {!user && (
        <div
          style={{
            maxWidth: 700,
            margin: '0 auto 24px',
            padding: '14px 20px',
            borderRadius: 12,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid var(--border-brand)',
            fontSize: 14,
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          💡 <strong style={{ color: 'var(--accent-primary)' }}>Sign in</strong> to add events
          directly to your Google Calendar.
        </div>
      )}

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 16,
                  padding: 24,
                  display: 'flex',
                  gap: 20,
                  animation: 'pulse 2s infinite',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: 'var(--bg-elevated)',
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    style={{
                      height: 18,
                      background: 'var(--bg-elevated)',
                      borderRadius: 6,
                      width: '40%',
                    }}
                  />
                  <div
                    style={{
                      height: 14,
                      background: 'var(--bg-elevated)',
                      borderRadius: 6,
                      width: '70%',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.map((event, idx) => {
              const dateObj = new Date(event.date + 'T12:00:00');
              const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
              const day = dateObj.getDate();
              const isPast = dateObj < new Date();
              const isAdded = addedEvents.has(event.id);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--glass-blur)',
                    border: `1px solid ${isAdded ? 'rgba(16,185,129,0.4)' : 'var(--glass-border)'}`,
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    gap: 20,
                    alignItems: 'flex-start',
                    opacity: isPast ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Date badge */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isPast ? 'var(--bg-elevated)' : `${event.color}20`,
                      border: `2px solid ${isPast ? 'var(--border-subtle)' : event.color}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: isPast ? 'var(--text-muted)' : event.color,
                      }}
                    >
                      {month}
                    </span>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        lineHeight: 1,
                        color: isPast ? 'var(--text-muted)' : 'var(--text-primary)',
                      }}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        marginBottom: 6,
                        color: isPast ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isPast ? 'line-through' : 'none',
                      }}
                    >
                      {event.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        marginBottom: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      {event.description}
                    </p>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
                    >
                      <button
                        onClick={() => addToGoogleCalendar(event)}
                        disabled={addingEvent === event.id || isPast}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          padding: '7px 14px',
                          borderRadius: 8,
                          cursor: isPast ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          background: isAdded
                            ? 'rgba(16,185,129,0.15)'
                            : isPast
                              ? 'var(--bg-elevated)'
                              : `${event.color}18`,
                          border: `1px solid ${isAdded ? 'rgba(16,185,129,0.5)' : isPast ? 'var(--border-subtle)' : `${event.color}50`}`,
                          color: isAdded ? '#4ade80' : isPast ? 'var(--text-muted)' : event.color,
                        }}
                      >
                        {addingEvent === event.id ? (
                          <>
                            <span
                              style={{
                                width: 14,
                                height: 14,
                                border: '2px solid currentColor',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.6s linear infinite',
                                display: 'inline-block',
                              }}
                            />{' '}
                            Adding...
                          </>
                        ) : isAdded ? (
                          <>
                            <HiOutlineCheckCircle style={{ width: 16, height: 16 }} /> Added!
                          </>
                        ) : (
                          <>
                            <HiOutlineCalendar style={{ width: 16, height: 16 }} /> Add to Calendar
                          </>
                        )}
                      </button>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
