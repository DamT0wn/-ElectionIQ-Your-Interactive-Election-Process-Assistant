// src/components/Timeline.jsx
import React from "react";
import { motion } from "framer-motion";
import { steps } from "../data/timelineSteps";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Timeline() {
  return (
    <motion.div
      className="timeline-container max-w-4xl mx-auto py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {steps.map((step, idx) => (
        <motion.div key={idx} className="timeline-step" variants={item}>
          <div className="step-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center">
            <img src={step.icon} alt={step.title} className="w-12 h-12 mr-4" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
