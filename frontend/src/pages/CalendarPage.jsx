import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCalendar, HiOutlinePlus } from 'react-icons/hi';
import { getElectionEvents } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, signInWithGoogle } = useAuth();
  const [addingEvent, setAddingEvent] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getElectionEvents(new Date().getFullYear());
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const addToGoogleCalendar = async (event) => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err) {
        setStatusMsg({ text: 'Please sign in to add events to your calendar.', type: 'error' });
        return;
      }
    }

    setAddingEvent(event.id);
    
    // In a real implementation, you would use gapi.client.calendar.events.insert here
    // using the OAuth token from Firebase. For this demo, we'll simulate the API call
    // or provide a direct link to the Google Calendar web interface if API fails.
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fallback method: Open in new tab via URL parameters if we don't have full gapi access
      const startDate = event.date.replace(/-/g, '');
      const endDate = event.endDate.replace(/-/g, '');
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}`;
      
      window.open(url, '_blank');
      
      setStatusMsg({ text: 'Opened event in Google Calendar!', type: 'success' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: 'Failed to add event.', type: 'error' });
    } finally {
      setAddingEvent(null);
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    }
  };

  const formatDate = (dateStr) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    // Add timezone offset to prevent off-by-one day errors
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="section-container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4"
          >
            Smart Election <span className="gradient-text">Calendar</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Never miss an important deadline. Add key election dates directly to your Google Calendar.
          </motion.p>
        </div>

        {statusMsg.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium text-center ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {statusMsg.text}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card p-6 flex gap-6 animate-pulse">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
            {events.map((event, idx) => {
              const dateObj = new Date(event.date + 'T12:00:00');
              const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
              const day = dateObj.getDate();
              const isPast = dateObj < new Date();

              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-surface-dark bg-white dark:bg-surface-dark-elevated shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-3 md:ml-0 z-10">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }}></div>
                  </div>

                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl glass-card transition-all hover:shadow-lg group-hover:-translate-y-1">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Date Badge */}
                      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl shrink-0 ${isPast ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'}`}>
                        <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
                        <span className="text-2xl font-display font-bold leading-none">{day}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className={`font-bold text-lg ${isPast ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600' : 'text-slate-900 dark:text-white'}`}>
                            {event.title}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {event.description}
                        </p>
                        <button
                          onClick={() => addToGoogleCalendar(event)}
                          disabled={addingEvent === event.id}
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            isPast 
                              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed' 
                              : 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50'
                          }`}
                        >
                          {addingEvent === event.id ? (
                            'Adding...'
                          ) : (
                            <>
                              <HiOutlineCalendar className="w-4 h-4" />
                              Add to Calendar
                            </>
                          )}
                        </button>
                      </div>
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
