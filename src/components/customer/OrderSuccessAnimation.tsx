import React from 'react';
import { motion } from 'motion/react';

interface OrderSuccessAnimationProps {
  size?: number;
}

export const OrderSuccessAnimation: React.FC<OrderSuccessAnimationProps> = ({ size = 110 }) => {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Dynamic Concentric Checkmark Ripple 1 - Outermost expanding wave */}
      <motion.span
        initial={{ scale: 0.7, opacity: 0.85 }}
        animate={{
          scale: [0.7, 1.45, 2.2],
          opacity: [0.85, 0.35, 0]
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: [0.21, 0.47, 0.32, 0.98],
          repeatDelay: 0.1
        }}
        className="absolute w-20 h-20 rounded-full border-2 border-emerald-400/70 bg-emerald-500/10 pointer-events-none"
      />

      {/* Dynamic Concentric Checkmark Ripple 2 - Mid-range wave with delay */}
      <motion.span
        initial={{ scale: 0.7, opacity: 0.85 }}
        animate={{
          scale: [0.7, 1.4, 2.05],
          opacity: [0.85, 0.4, 0]
        }}
        transition={{
          duration: 2.2,
          delay: 0.65,
          repeat: Infinity,
          ease: [0.21, 0.47, 0.32, 0.98],
          repeatDelay: 0.1
        }}
        className="absolute w-20 h-20 rounded-full border border-emerald-400/60 bg-emerald-500/15 pointer-events-none"
      />

      {/* Dynamic Concentric Checkmark Ripple 3 - Inner pulse wave with delay */}
      <motion.span
        initial={{ scale: 0.75, opacity: 0.9 }}
        animate={{
          scale: [0.75, 1.35, 1.9],
          opacity: [0.9, 0.45, 0]
        }}
        transition={{
          duration: 2.2,
          delay: 1.3,
          repeat: Infinity,
          ease: [0.21, 0.47, 0.32, 0.98],
          repeatDelay: 0.1
        }}
        className="absolute w-20 h-20 rounded-full border border-teal-300/60 bg-teal-400/10 pointer-events-none"
      />

      {/* Outer ambient soft blur glow */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.9, 1.25, 0.9],
          opacity: [0.35, 0.65, 0.35]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute w-24 h-24 rounded-full bg-emerald-500/25 blur-xl pointer-events-none"
      />

      {/* Festive Micro-Sparkles Burst */}
      {[
        { angle: 15, distance: 54, color: '#34d399', delay: 0.25, size: 5 },
        { angle: 60, distance: 58, color: '#fbbf24', delay: 0.32, size: 4 },
        { angle: 110, distance: 52, color: '#10b981', delay: 0.28, size: 6 },
        { angle: 165, distance: 56, color: '#38bdf8', delay: 0.35, size: 5 },
        { angle: 215, distance: 54, color: '#34d399', delay: 0.26, size: 4 },
        { angle: 260, distance: 58, color: '#fbbf24', delay: 0.34, size: 5 },
        { angle: 300, distance: 50, color: '#38bdf8', delay: 0.3, size: 4 },
        { angle: 345, distance: 55, color: '#10b981', delay: 0.31, size: 5 }
      ].map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.distance;
        const y = Math.sin(rad) * p.distance;

        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: [0, x * 0.75, x],
              y: [0, y * 0.75, y],
              scale: [0, 1.3, 0],
              opacity: [1, 0.9, 0]
            }}
            transition={{
              duration: 0.95,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`
            }}
          />
        );
      })}

      {/* Main Checkmark Badge Container - Elastic spring pop */}
      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 18,
          delay: 0.1
        }}
        className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_28px_rgba(16,185,129,0.45)] border-2 border-emerald-200/60"
      >
        {/* Animated Drawing SVG Checkmark */}
        <svg
          className="w-10 h-10 text-neutral-950"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated checkmark path */}
          <motion.path
            d="M4.5 12.75L9.5 17.75L19.5 7.25"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 0.45, delay: 0.32, ease: [0.25, 1, 0.5, 1] },
              opacity: { duration: 0.1, delay: 0.3 }
            }}
          />
        </svg>

        {/* Shimmer light reflect gleam on the badge */}
        <motion.div
          initial={{ opacity: 0, x: -16, y: -16 }}
          animate={{ opacity: [0, 0.8, 0], x: [ -16, 10, 20 ], y: [ -16, 10, 20 ] }}
          transition={{ duration: 1.2, delay: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
