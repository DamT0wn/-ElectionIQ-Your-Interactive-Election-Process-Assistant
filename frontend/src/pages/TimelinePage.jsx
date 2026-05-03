import { useState } from 'react';
import { motion } from 'framer-motion';
import { steps } from '../data/timelineSteps';

const STEP_COLORS = ['#7c3aed', '#6366f1', '#3b82f6', '#06b6d4', '#10b981'];

export default function TimelinePage() {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const toggleStep = (id) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const completedCount = completedSteps.size;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* ── Hero ── */}
      <section
        style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 700, margin: '0 auto' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 999,
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--accent-primary)',
            marginBottom: 24,
            letterSpacing: '0.02em',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
              animation: 'pulse-dot 2s infinite',
              display: 'inline-block',
            }}
          />
          Election Guide 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}
        >
          The Election <span className="page-title-gradient">Timeline</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: 500,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Follow these steps to ensure your voice is heard.
        </motion.p>
      </section>

      {/* ── Progress Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          maxWidth: 860,
          margin: '0 auto 48px',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            flex: 1,
            height: 4,
            background: 'var(--border-subtle)',
            borderRadius: 999,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'var(--brand-gradient)',
              borderRadius: 999,
              width: `${(completedCount / steps.length) * 100}%`,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        <span
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
            fontWeight: 500,
          }}
        >
          {completedCount}/{steps.length} steps completed
        </span>
      </div>

      {/* ── Steps ── */}
      <div
        style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px', position: 'relative' }}
      >
        {/* Vertical connector line */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(24px + 64px + 16px + 20px)',
            top: 0,
            bottom: 0,
            width: 2,
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(99,102,241,0.6) 10%, rgba(99,102,241,0.4) 50%, rgba(99,102,241,0.6) 90%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = completedSteps.has(step.id);
          const color = STEP_COLORS[idx % STEP_COLORS.length];

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '64px 40px 1fr',
                alignItems: 'flex-start',
                gap: '0 16px',
                marginBottom: 32,
                opacity: isCompleted ? 0.65 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              {/* Step number */}
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: isCompleted ? 'rgba(16,185,129,0.4)' : 'var(--border-default)',
                  textAlign: 'right',
                  paddingTop: 20,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  transition: 'color 0.3s',
                }}
              >
                0{step.order}
              </div>

              {/* Dot column */}
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24 }}>
                <div
                  onClick={() => toggleStep(step.id)}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: `2px solid ${isCompleted ? '#10b981' : 'var(--accent-primary)'}`,
                    background: isCompleted ? '#10b981' : 'var(--bg-base)',
                    boxShadow: isCompleted
                      ? '0 0 15px rgba(16,185,129,0.6)'
                      : '0 0 12px rgba(99,102,241,0.5)',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}
                  title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                />
              </div>

              {/* Card */}
              <div
                className="glass-card"
                style={{
                  padding: 28,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 16,
                  cursor: 'default',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    fontSize: '2.25rem',
                    flexShrink: 0,
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: 12,
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  {step.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Complete toggle */}
                <button
                  onClick={() => toggleStep(step.id)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    border: `1px solid ${isCompleted ? '#10b981' : 'var(--border-default)'}`,
                    background: isCompleted ? 'rgba(16,185,129,0.15)' : 'transparent',
                    color: isCompleted ? '#10b981' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isCompleted ? '✓ Done' : 'Mark done'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
