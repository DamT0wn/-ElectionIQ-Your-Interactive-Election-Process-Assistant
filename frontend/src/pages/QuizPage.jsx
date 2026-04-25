import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineRefresh, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineChevronRight } from 'react-icons/hi';
import { getQuizTopics, generateQuizQuestion, explainQuizAnswer, submitQuizResult } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function QuizPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  
  const [gameState, setGameState] = useState('setup'); // setup, playing, result
  const [question, setQuestion] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [explanation, setExplanation] = useState('');
  
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await getQuizTopics();
        setTopics(data.topics || []);
      } catch (err) {
        console.error('Failed to load topics:', err);
      }
    }
    loadTopics();
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
    setStats(prev => ({ 
      correct: prev.correct + (isCorrect ? 1 : 0), 
      total: prev.total + 1 
    }));

    try {
      const data = await explainQuizAnswer(
        question.question,
        question.options[index],
        question.options[question.correctIndex],
        isCorrect
      );
      setExplanation(data.explanation);
    } catch (err) {
      console.error(err);
      setExplanation(question.explanation || 'No explanation available.');
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = async () => {
    setGameState('result');
    if (user && stats.total > 0) {
      try {
        await submitQuizResult(user.uid, {
          score: stats.correct,
          totalQuestions: stats.total,
          topic: selectedTopic || 'mixed',
          difficulty
        });
      } catch (err) {
        console.error('Failed to save score:', err);
      }
    }
  };

  return (
    <div className="section-container py-12 max-w-3xl">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 flex justify-center items-center gap-3"
        >
          <HiOutlineAcademicCap className="text-primary-500" />
          Election <span className="gradient-text">Quiz</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-400"
        >
          Test your civics knowledge with AI-generated questions and explanations.
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {/* SETUP STATE */}
        {gameState === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select a Topic (Optional)
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                >
                  <option value="">Surprise me (Random Topic)</option>
                  {topics.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-3 px-4 rounded-xl font-medium capitalize transition-all ${
                        difficulty === level
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                          : 'bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={startQuiz}
                  className="btn-primary w-full py-4 text-lg"
                >
                  <HiOutlineLightningBolt className="w-6 h-6" />
                  Start Quiz
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header / Stats */}
            <div className="flex justify-between items-center bg-white dark:bg-surface-dark-elevated p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {question?.topic || selectedTopic || 'Mixed'}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  difficulty === 'easy' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' :
                  difficulty === 'medium' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' :
                  'text-red-600 bg-red-50 dark:bg-red-900/30'
                }`}>
                  {difficulty}
                </span>
              </div>
              <div className="font-display font-bold text-lg">
                Score: <span className="text-primary-600 dark:text-primary-400">{stats.correct}</span> / {stats.total}
              </div>
            </div>

            {loading && !isAnswering ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400 animate-pulse">Generating your next question via AI...</p>
              </div>
            ) : error ? (
              <div className="glass-card p-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={loadNextQuestion} className="btn-secondary">Try Again</button>
              </div>
            ) : question && (
              <div className="glass-card p-6 md:p-8 relative overflow-hidden">
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-relaxed">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((opt, idx) => {
                    let btnClass = "quiz-option";
                    let Icon = null;

                    if (isAnswering) {
                      if (idx === question.correctIndex) {
                        btnClass += " correct";
                        Icon = HiOutlineCheckCircle;
                      } else if (idx === selectedOptionIndex) {
                        btnClass += " incorrect";
                        Icon = HiOutlineXCircle;
                      } else {
                        btnClass += " opacity-50 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswering}
                        className={btnClass}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{opt}</span>
                          {Icon && <Icon className="w-6 h-6 shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Area */}
                <AnimatePresence>
                  {isAnswering && explanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      className="border-t border-slate-200 dark:border-slate-700 pt-6"
                    >
                      <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        AI Explanation
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                        {explanation}
                      </p>
                      <div className="flex gap-4">
                        <button onClick={loadNextQuestion} disabled={loading} className="btn-primary flex-1">
                          Next Question <HiOutlineChevronRight className="w-5 h-5" />
                        </button>
                        <button onClick={finishQuiz} className="btn-secondary">
                          Finish
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {isAnswering && !explanation && loading && (
                     <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="mt-6 text-center text-slate-500 animate-pulse text-sm"
                   >
                     AI is typing explanation...
                   </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}

        {/* RESULT STATE */}
        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 text-center"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20">
              <HiOutlineAcademicCap className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
              Quiz Complete!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              You scored <span className="font-bold text-primary-600 dark:text-primary-400">{stats.correct}</span> out of {stats.total}.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setGameState('setup')} 
                className="btn-primary"
              >
                <HiOutlineRefresh className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
