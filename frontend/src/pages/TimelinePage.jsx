import { motion } from 'framer-motion';
import { steps } from '../data/timelineSteps';

export default function TimelinePage() {
  return (
    <div className="section-container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4"
          >
            The Election <span className="gradient-text">Timeline</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Follow these steps to ensure your voice is heard.
          </motion.p>
        </div>

        <div className="relative pl-8 sm:pl-32 py-6">
          {/* Timeline Connector Line */}
          <div className="hidden sm:block absolute left-[10.5rem] top-8 bottom-8 w-1 bg-gradient-to-b from-primary-200 via-primary-500 to-primary-200 dark:from-primary-900 dark:via-primary-500 dark:to-primary-900 rounded-full" />
          
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col sm:flex-row items-start group"
              >
                {/* Mobile Icon */}
                <div className="sm:hidden absolute -left-8 top-1 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 border-2 border-primary-500 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300 z-10">
                  {step.order}
                </div>

                {/* Desktop Order/Icon Indicator */}
                <div className="hidden sm:flex flex-col items-end pr-12 w-32 shrink-0 pt-2 relative">
                  <span className="text-4xl font-display font-bold text-slate-200 dark:text-slate-700 group-hover:text-primary-200 dark:group-hover:text-primary-800 transition-colors">
                    0{step.order}
                  </span>
                  
                  {/* Indicator Dot */}
                  <div className="absolute -right-[11px] top-4 w-6 h-6 rounded-full bg-white dark:bg-surface-dark border-4 border-primary-500 shadow-lg shadow-primary-500/30 z-10 group-hover:scale-125 transition-transform duration-300" />
                </div>

                {/* Content Card */}
                <div className="glass-card flex-1 p-6 sm:p-8 ml-4 sm:ml-0 group-hover:-translate-y-1 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary-500/10">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
