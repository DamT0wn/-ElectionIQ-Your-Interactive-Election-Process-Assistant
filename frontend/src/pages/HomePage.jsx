import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineChat, HiOutlineMap, HiOutlineCalendar, HiOutlineAcademicCap } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20" />
        
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
              ElectionIQ empowers you with knowledge. Understand the election process, track your voter journey, and get AI-powered answers to all your election questions.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link to="/timeline" className="btn-primary w-full sm:w-auto bg-white text-primary-900 hover:bg-slate-50 shadow-white/20">
                Start Your Journey
              </Link>
              <Link to="/chat" className="btn-secondary w-full sm:w-auto bg-primary-900/40 border-primary-400/50 text-white hover:bg-primary-800/60">
                Ask the AI Assistant
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-accent-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl animate-float animate-delay-200" />
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 dark:bg-surface-dark">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to be an informed voter
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Explore our suite of tools designed to guide you through every step of the democratic process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI Chatbot',
                desc: 'Ask any election-related question and get simple, unbiased answers.',
                icon: HiOutlineChat,
                link: '/chat',
                color: 'bg-blue-500',
                shadow: 'shadow-blue-500/20'
              },
              {
                title: 'Interactive Timeline',
                desc: 'Step-by-step visual guide from registration to election day.',
                icon: HiOutlineCalendar,
                link: '/timeline',
                color: 'bg-indigo-500',
                shadow: 'shadow-indigo-500/20'
              },
              {
                title: 'Polling Places',
                desc: 'Find nearby polling stations and drop boxes on an interactive map.',
                icon: HiOutlineMap,
                link: '/map',
                color: 'bg-emerald-500',
                shadow: 'shadow-emerald-500/20'
              },
              {
                title: 'Election Quiz',
                desc: 'Test your civics knowledge with AI-generated explanations.',
                icon: HiOutlineAcademicCap,
                link: '/quiz',
                color: 'bg-amber-500',
                shadow: 'shadow-amber-500/20'
              }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link to={feature.link} className="block h-full group">
                  <div className="glass-card h-full p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:bg-white/10">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-surface-dark-elevated border-t border-slate-200 dark:border-slate-800">
        <div className="section-container">
          <div className="bg-primary-50 dark:bg-primary-900/10 rounded-3xl p-8 md:p-12 text-center border border-primary-100 dark:border-primary-800/50 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Ready to take the next step?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Create an account to track your election progress, save important dates, and keep a history of your AI chats.
            </p>
            {!user && (
               <button className="btn-primary">
                 Sign in with Google
               </button>
            )}
            {user && (
               <Link to="/progress" className="btn-primary">
                 View Your Progress
               </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
