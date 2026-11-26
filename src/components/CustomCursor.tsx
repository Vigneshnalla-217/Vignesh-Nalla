import { useEffect, useRef, useState } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

export function CustomCursor() {
  const { reducedMotion, hasFinePointer } = useDeviceCapabilities();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (reducedMotion || !hasFinePointer) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest('a, button, input, textarea, [role="button"], [data-cursor="interactive"]')
      );
      setInteractive(isInteractive);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onPointerLeave = () => setVisible(false);

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        const scale = interactive ? 1.45 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, hasFinePointer, interactive]);

  if (reducedMotion || !hasFinePointer) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 h-8 w-8 rounded-full border transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        } ${
          interactive
            ? 'border-[#FF557F]/80 bg-[#FF557F]/10'
            : 'border-[#9272FF]/50 bg-transparent'
        }`}
      />
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-[#FF557F] transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
