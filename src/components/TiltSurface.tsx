import { ReactNode, useRef, useState } from 'react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

interface TiltSurfaceProps {
  children: ReactNode;
  className?: string;
  maxTiltDeg?: number;
}

export function TiltSurface({ children, className = '', maxTiltDeg = 6 }: TiltSurfaceProps) {
  const { reducedMotion, hasFinePointer, isCompactViewport } = useDeviceCapabilities();
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const interactiveEnabled = !reducedMotion && hasFinePointer && !isCompactViewport;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveEnabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateY = (x * maxTiltDeg * 2).toFixed(2);
    const rotateX = (-y * maxTiltDeg * 2).toFixed(2);
    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
    );
  };

  const handlePointerLeave = () => {
    if (!interactiveEnabled) return;
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={interactiveEnabled ? { transform: transformStyle } : undefined}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
