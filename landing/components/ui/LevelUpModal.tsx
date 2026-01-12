'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Trophy, X } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  levelName: string;
}

const levelColors: Record<number, string> = {
  1: '#D4D4D8',
  2: '#22C55E',
  3: '#3B82F6',
  4: '#2DD4BF',
  5: '#0D9488',
  6: '#EF4444',
  7: '#EC4899',
  8: '#14B8A6',
};

// Confetti particle component
const Particle = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: color,
    }}
    initial={{
      x: 0,
      y: 0,
      scale: 0,
      opacity: 1,
    }}
    animate={{
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      scale: [0, 1, 0.5],
      opacity: [1, 1, 0],
      rotate: Math.random() * 360,
    }}
    transition={{
      duration: 1.5,
      delay: delay,
      ease: 'easeOut',
    }}
  />
);

// Sparkle effect component
const SparkleEffect = ({ delay }: { delay: number }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: '#FFD700',
      boxShadow: '0 0 10px #FFD700',
    }}
    initial={{
      x: 0,
      y: 0,
      scale: 0,
      opacity: 0,
    }}
    animate={{
      x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
      y: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
      scale: [0, 1.5, 0],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      delay: delay,
      repeat: Infinity,
      repeatDelay: 0.5,
    }}
  />
);

export default function LevelUpModal({ isOpen, onClose, newLevel, levelName }: LevelUpModalProps) {
  const [particles, setParticles] = useState<{ id: number; delay: number; color: string }[]>([]);
  const levelColor = levelColors[newLevel] || levelColors[8];

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.5,
        color: ['#14B8A6', '#7B2FF7', '#00D4AA', '#FFD700', '#FF6B6B'][Math.floor(Math.random() * 5)],
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                background: 'linear-gradient(180deg, #1C1C1E 0%, #141416 100%)',
                borderRadius: '24px',
                padding: '48px',
                textAlign: 'center',
                border: `2px solid ${levelColor}40`,
                boxShadow: `0 0 60px ${levelColor}30`,
                maxWidth: '400px',
                width: '90%',
                overflow: 'visible',
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#71717A',
                  cursor: 'pointer',
                  padding: '8px',
                }}
              >
                <X style={{ width: '24px', height: '24px' }} />
              </button>

              {/* Confetti particles */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}>
                {particles.map((p) => (
                  <Particle key={p.id} delay={p.delay} color={p.color} />
                ))}
              </div>

              {/* Sparkle effects */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SparkleEffect key={i} delay={i * 0.2} />
                ))}
              </div>

              {/* Level Up Text */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Sparkles style={{ width: '24px', height: '24px', color: '#FFD700' }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFD700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Level Up!
                  </span>
                  <Sparkles style={{ width: '24px', height: '24px', color: '#FFD700' }} />
                </div>
              </motion.div>

              {/* Level Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3,
                }}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${levelColor} 0%, ${levelColor}80 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: `0 0 40px ${levelColor}60`,
                  position: 'relative',
                }}
              >
                {/* Glow ring animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    inset: -10,
                    borderRadius: '50%',
                    border: `3px solid ${levelColor}`,
                  }}
                />
                <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'white' }}>
                  {newLevel}
                </span>
              </motion.div>

              {/* Level Name */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                  {levelName}
                </h2>
                <p style={{ fontSize: '16px', color: '#A1A1AA', marginBottom: '24px' }}>
                  새로운 레벨에 도달했습니다!
                </p>
              </motion.div>

              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255, 215, 0, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                }}
              >
                <Trophy style={{ width: '20px', height: '20px', color: '#FFD700' }} />
                <span style={{ fontSize: '14px', color: '#FFD700', fontWeight: 500 }}>
                  축하합니다!
                </span>
              </motion.div>

              {/* Continue Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  marginTop: '24px',
                  padding: '14px 48px',
                  background: `linear-gradient(135deg, ${levelColor} 0%, ${levelColor}80 100%)`,
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: `0 4px 20px ${levelColor}40`,
                }}
              >
                확인
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
