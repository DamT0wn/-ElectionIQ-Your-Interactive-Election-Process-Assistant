import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingChat from './components/FloatingChat';
import './components/FloatingChat.css';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import TimelinePage from './pages/TimelinePage';
import MapPage from './pages/MapPage';
import CalendarPage from './pages/CalendarPage';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  console.log('App: Rendering');

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ChatProvider>
            {/* Skip to main content — accessibility */}
            <a
              href="#main-content"
              style={{
                position: 'absolute',
                top: -40,
                left: 8,
                zIndex: 99999,
                background: 'var(--brand-gradient)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                transition: 'top 0.2s',
              }}
              onFocus={(e) => (e.target.style.top = '8px')}
              onBlur={(e) => (e.target.style.top = '-40px')}
            >
              Skip to main content
            </a>
            <div className="min-h-screen flex flex-col transition-colors duration-300">
              <Navbar />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/timeline" element={<TimelinePage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <FloatingChat />
          </ChatProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
