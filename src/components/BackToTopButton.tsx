import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export function BackToTopButton() {
  const { reducedMotion } = useDeviceCapabilities();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          aria-label="Back to top"
          className="fixed right-5 bottom-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF557F]/45 bg-[#100C16]/95 text-[#F5F1F7] shadow-[0_10px_30px_rgba(0,0,0,0.65)] transition-colors hover:bg-[#FF557F] hover:text-[#09070D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF557F]"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
