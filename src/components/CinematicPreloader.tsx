import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export function CinematicPreloader() {
  const { reducedMotion } = useDeviceCapabilities();
  const [visible, setVisible] = useState(!reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="vn-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09070D] px-6"
          aria-label="Loading Vignesh Nalla portfolio"
        >
          {/* Ambient radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-72 w-72 rounded-full bg-gradient-to-tr from-[#FF557F]/20 via-[#C44D9E]/15 to-[#9272FF]/20 blur-[90px]"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* Animated VN Monogram SVG */}
            <svg viewBox="0 0 96 64" className="h-16 w-24" fill="none">
              <defs>
                <linearGradient id="preloader-vn-grad" x1="8" y1="8" x2="88" y2="56" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF557F" />
                  <stop offset="50%" stopColor="#C44D9E" />
                  <stop offset="100%" stopColor="#9272FF" />
                </linearGradient>
              </defs>
              {/* V path */}
              <motion.path
                d="M12 14L27 50L42 14"
                stroke="url(#preloader-vn-grad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
              />
              {/* N path */}
              <motion.path
                d="M54 50V14L82 50V14"
                stroke="url(#preloader-vn-grad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.55, delay: 0.15, ease: 'easeInOut' }}
              />
            </svg>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-4 font-mono text-xs tracking-[0.26em] text-[#A69EAC]"
            >
              {portfolioConfig.personal.fullName}
            </motion.p>
          </motion.div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="mt-10 text-xs font-medium text-[#A69EAC]/70 transition-colors hover:text-[#F5F1F7] focus-visible:outline-2 focus-visible:outline-[#FF557F]"
          >
            Enter Portfolio
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
