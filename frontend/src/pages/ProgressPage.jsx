import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCheck, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { getUserProgress, updateStepProgress, getElectionSteps } from '../services/api';

export default function ProgressPage() {
  const { user, signInWithGoogle } = useAuth();
  const [steps, setSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        if (!user) {
          // Load default steps without progress if not logged in
          const data = await getElectionSteps();
          setSteps(data.steps || []);
          setLoading(false);
          return;
        }

        const progressData = await getUserProgress(user.uid);
        setSteps(progressData.steps || []);
        setCompletedSteps(progressData.completedSteps || []);
      } catch (err) {
        console.error('Failed to load progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const toggleStep = async (stepId, isCurrentlyCompleted) => {
    if (!user) return;
    
    const newStatus = !isCurrentlyCompleted;
    
    // Optimistic UI update
    if (newStatus) {
      setCompletedSteps(prev => [...prev, stepId]);
    } else {
      setCompletedSteps(prev => prev.filter(id => id !== stepId));
    }

    try {
      await updateStepProgress(user.uid, stepId, newStatus);
    } catch (err) {
      console.error('Failed to update progress:', err);
      // Revert on error
      if (!newStatus) {
        setCompletedSteps(prev => [...prev, stepId]);
      } else {
        setCompletedSteps(prev => prev.filter(id => id !== stepId));
      }
    }
  };

  const calculateProgress = () => {
    if (!steps.length) return 0;
    return Math.round((completedSteps.length / steps.length) * 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <div className="section-container py-12 max-w-4xl">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4"
        >
          Your Election <span className="gradient-text">Journey</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          Track your progress to becoming a fully prepared voter. Mark steps as complete as you finish them.
        </motion.p>
      </div>

      {!user ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineLockClosed className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Sign in to track progress</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Create a free account to track your voting preparation, save your chat history, and log your quiz scores.
          </p>
          <button onClick={signInWithGoogle} className="btn-primary px-8">
            Sign In with Google
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Dashboard */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-center">Preparation Status</h3>
              
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    className="text-slate-200 dark:text-slate-700 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  {/* Progress Circle */}
                  <circle
                    className="text-primary-500 stroke-current progress-ring-circle"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-display font-bold text-slate-900 dark:text-white">{progressPercentage}%</span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ready</span>
                </div>
              </div>

              <div className="text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                {completedSteps.length} of {steps.length} steps completed
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                ))}
              </div>
            ) : (
              steps.sort((a, b) => a.order - b.order).map((step) => {
                const isCompleted = completedSteps.includes(step.id);
                
                return (
                  <motion.div 
                    key={step.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass-card p-4 transition-all duration-300 ${isCompleted ? 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800' : ''}`}
                  >
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center shrink-0">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={isCompleted}
                          onChange={() => toggleStep(step.id, isCompleted)}
                        />
                        <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/20 scale-105' 
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-surface-dark group-hover:border-primary-400'
                        }`}>
                          <HiOutlineCheck className={`w-5 h-5 transition-transform ${isCompleted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`font-semibold text-lg transition-colors ${
                          isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {step.order}. {step.label}
                        </h4>
                      </div>
                    </label>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
