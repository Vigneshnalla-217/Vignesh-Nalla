import { useEffect, useState } from 'react';

interface DeviceCapabilities {
  reducedMotion: boolean;
  hasFinePointer: boolean;
  isCompactViewport: boolean;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    if (typeof window === 'undefined') {
      return { reducedMotion: false, hasFinePointer: true, isCompactViewport: false };
    }
    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      hasFinePointer: window.matchMedia('(pointer: fine)').matches,
      isCompactViewport: window.innerWidth < 768,
    };
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');

    const update = () => {
      setCapabilities({
        reducedMotion: motionQuery.matches,
        hasFinePointer: pointerQuery.matches,
        isCompactViewport: window.innerWidth < 768,
      });
    };

    update();
    motionQuery.addEventListener('change', update);
    pointerQuery.addEventListener('change', update);
    window.addEventListener('resize', update, { passive: true });

    return () => {
      motionQuery.removeEventListener('change', update);
      pointerQuery.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return capabilities;
}
