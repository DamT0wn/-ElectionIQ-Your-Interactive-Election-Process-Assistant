import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineRefresh, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineChevronRight } from 'react-icons/hi';
import { getQuizTopics, generateQuizQuestion, explainQuizAnswer, submitQuizResult } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FALLBACK_TOPICS = [
  'voter registration',
  'election day procedures',
  'types of elections',
  'electoral college',
  'ballot measures and propositions',
  'campaign finance',
  'voting rights history',
  'how votes are counted',
  'absentee and mail-in voting',
  'primary elections vs general elections',
];

export default function QuizPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState(FALLBACK_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [gameState, setGameState] = useState('setup');
  const [question, setQuestion] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getQuizTopics()
      .then(data => { if (data.topics?.length) setTopics(data.topics); })
      .catch(() => {}); // silently use fallback
  }, []);

  const startQuiz = async () => {
    setGameState('playing');
    setStats({ correct: 0, total: 0 });
    await loadNextQuestion();
  };

  const loadNextQuestion = async () => {
    setLoading(true);
    setError('');
    setExplanation('');
    setSelectedOptionIndex(null);
    setIsAnswering(false);
    try {
      const data = await generateQuizQuestion(selectedTopic, difficulty);
      setQuestion(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (index) => {
    if (isAnswering || !question) return;
    setSelectedOptionIndex(index);
    setIsAnswering(true);
    setLoading(true);
    const isCorrect = index === question.correctIndex;
    setStats(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    try {
      const data = await explainQuizAnswer(question.question, question.options[index], question.options[question.correctIndex], isCorrect);
      setExplanation(typeof data === 'string' ? data : data.explanation || question.explanation || '');
    } catch {
      setExplanation(question.explanation || '');
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = async () => {
    setGameState('result');
    if (user && stats.total > 0) {
      submitQuizResult(user.uid, { score: stats.correct, totalQuestions: stats.total, topic: selectedTopic || 'mixed', difficulty }).catch(console.error);
    }
  };

  const cardStyle = { background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', border: '1px solid var(--glass-border)', borderRadius: 16, boxShadow: 'var(--shadow-md)' };
  const headerStyle = { background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '16px 20px' };

  return (
    <div className="section-container py-12 max-w-3xl">
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <HiOutlineAcademicCap style={{ color: 'var(--accent-primary)' }} />
          Election <span className="gradient-text">Quiz</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Test your civics knowledge with AI-generated questions and explanations.
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {/* SETUP */}
        {gameState === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ ...cardStyle, padding: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Select a Topic (Optional)
                </label>
                <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
                  <option value="">🎲 Surprise me (Random Topic)</option>
                  {topics.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Difficulty Level
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    { level: 'easy', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.4)' },
                    { level: 'medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)' },
                    { level: 'hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.4)' },
                  ].map(({ level, color, bg, border }) => (
                    <button key={level} onClick={() => setDifficulty(level)}
                      style={{
                        padding: '12px', borderRadius: 12, fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
                        background: difficulty === level ? bg : 'var(--bg-elevated)',
                        border: `2px solid ${difficulty === level ? border : 'var(--border-default)'}`,
                        color: difficulty === level ? color : 'var(--text-secondary)',
                      }}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={startQuiz} className="btn-primary" style={{ padding: '16px', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <HiOutlineLightningBolt style={{ width: 20, height: 20 }} />
                Start Quiz
              </button>
            </div>
          </motion.div>
        )}

        {/* PLAYING */}
        {gameState === 'playing' && (
          <motion.div key="playing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Stats bar */}
            <div style={{ ...headerStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', background: 'var(--bg-overlay)', padding: '4px 12px', borderRadius: 999, textTransform: 'capitalize' }}>
                  {question?.topic || selectedTopic || 'Mixed'}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px', borderRadius: 6,
                  color: difficulty === 'easy' ? '#10b981' : difficulty === 'medium' ? '#f59e0b' : '#ef4444',
                  background: difficulty === 'easy' ? 'rgba(16,185,129,0.1)' : difficulty === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                }}>
                  {difficulty}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                Score: <span style={{ color: 'var(--accent-primary)' }}>{stats.correct}</span> / {stats.total}
              </div>
            </div>

            {loading && !isAnswering ? (
              <div style={{ ...cardStyle, padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
                <div style={{ width: 48, height: 48, border: '4px solid var(--border-default)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--text-muted)', animation: 'pulse 2s infinite' }}>Generating question with AI...</p>
              </div>
            ) : error ? (
              <div style={{ ...cardStyle, padding: 32, textAlign: 'center' }}>
                <p style={{ color: '#f87171', marginBottom: 16 }}>{error}</p>
                <button onClick={loadNextQuestion} className="btn-secondary">Try Again</button>
              </div>
            ) : question && (
              <div style={{ ...cardStyle, padding: 28 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 28, lineHeight: 1.5 }}>
                  {question.question}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {question.options.map((opt, idx) => {
                    let bg = 'var(--bg-elevated)';
                    let border = 'var(--border-default)';
                    let color = 'var(--text-primary)';
                    let Icon = null;

                    if (isAnswering) {
                      if (idx === question.correctIndex) {
                        bg = 'rgba(16,185,129,0.12)'; border = '#10b981'; color = '#4ade80';
                        Icon = HiOutlineCheckCircle;
                      } else if (idx === selectedOptionIndex) {
                        bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; color = '#f87171';
                        Icon = HiOutlineXCircle;
                      } else {
                        bg = 'var(--bg-surface)'; color = 'var(--text-muted)';
                      }
                    }

                    return (
                      <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={isAnswering}
                        style={{
                          width: '100%', textAlign: 'left', padding: '14px 18px', borderRadius: 12,
                          background: bg, border: `2px solid ${border}`, color,
                          cursor: isAnswering ? 'default' : 'pointer', transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                          opacity: isAnswering && idx !== question.correctIndex && idx !== selectedOptionIndex ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { if (!isAnswering) e.currentTarget.style.borderColor = 'var(--border-brand)'; }}
                        onMouseLeave={e => { if (!isAnswering) e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
                        <span style={{ fontWeight: 500 }}>{opt}</span>
                        {Icon && <Icon style={{ width: 22, height: 22, flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {isAnswering && explanation && (
                    <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                        AI Explanation
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>{explanation}</p>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={loadNextQuestion} disabled={loading} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          Next Question <HiOutlineChevronRight style={{ width: 18, height: 18 }} />
                        </button>
                        <button onClick={finishQuiz} className="btn-secondary">Finish</button>
                      </div>
                    </motion.div>
                  )}
                  {isAnswering && !explanation && loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ marginTop: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                      AI is generating explanation...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* RESULT */}
        {gameState === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ ...cardStyle, padding: 48, textAlign: 'center' }}>
            <div style={{ width: 96, height: 96, margin: '0 auto 24px', background: 'var(--brand-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <HiOutlineAcademicCap style={{ width: 48, height: 48, color: 'white' }} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Quiz Complete!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.1rem' }}>
              You scored <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{stats.correct}</span> out of {stats.total}.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setGameState('setup'); setQuestion(null); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HiOutlineRefresh style={{ width: 18, height: 18 }} /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
