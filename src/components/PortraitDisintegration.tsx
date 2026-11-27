import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  origX: number;
  origY: number;
  rgbPrefix: string; // pre-formatted "r,g,b" to avoid per-frame string math
  glowIndex: number; // 0 = crimson, 1 = purple, 2 = pink
  vx: number;
  vy: number;
  vz: number;
  size: number;
  delay: number;
  spin: number;
  edgeWeight: number;
}

const GLOW_COLORS: Array<[number, number, number]> = [
  [255, 85, 127], // #FF557F
  [146, 114, 255], // #9272FF
  [196, 77, 158], // #C44D9E
];

function createGlowSprite(r: number, g: number, b: number): HTMLCanvasElement {
  const size = 24;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    const half = size / 2;
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0, `rgba(255, 255, 255, 0.95)`);
    grad.addColorStop(0.28, `rgba(${r}, ${g}, ${b}, 0.92)`);
    grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.32)`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  return c;
}

interface PortraitDisintegrationProps {
  src: string;
  alt: string;
}

export function PortraitDisintegration({ src, alt }: PortraitDisintegrationProps) {
  const { reducedMotion, isCompactViewport } = useDeviceCapabilities();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageError, setImageError] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const imgEl = imgRef.current;
    if (!wrapper || !canvas || !imgEl || reducedMotion || imageError) {
      setParticlesReady(false);
      return;
    }

    let cancelled = false;
    let particles: Particle[] = [];
    let canvasW = 0;
    let canvasH = 0;
    let imgOffsetX = 0;
    let imgOffsetY = 0;
    let frameW = 0;
    let frameH = 0;
    let scrollTriggerInstance: ScrollTrigger | null = null;

    // Continuous damped progress for ultra-smooth 60fps scroll tracking
    let targetProgress = 0;
    let smoothedProgress = 0;
    let lastDrawnProgress = -1;

    // Pre-bake 3 glowing radial particle sprites once
    const glowSprites = GLOW_COLORS.map(([r, g, b]) => createGlowSprite(r, g, b));

    const buildParticles = (loadedImg: HTMLImageElement) => {
      if (cancelled || !wrapper || !canvas) return;

      const rect = wrapper.getBoundingClientRect();
      frameW = Math.max(200, Math.round(rect.width));
      frameH = Math.max(240, Math.round(rect.height));

      const padX = isCompactViewport ? 56 : 110;
      const padY = isCompactViewport ? 64 : 110;
      canvasW = frameW + padX * 2;
      canvasH = frameH + padY * 2;
      imgOffsetX = padX;
      imgOffsetY = padY;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvasW * dpr);
      canvas.height = Math.round(canvasH * dpr);
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      canvas.style.left = `${-padX}px`;
      canvas.style.top = `${-padY}px`;

      const offscreen = document.createElement('canvas');
      offscreen.width = frameW;
      offscreen.height = frameH;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      const natW = loadedImg.naturalWidth || loadedImg.width;
      const natH = loadedImg.naturalHeight || loadedImg.height;
      const scale = Math.max(frameW / natW, frameH / natH);
      const drawW = natW * scale;
      const drawH = natH * scale;
      const drawX = (frameW - drawW) / 2;
      const drawY = 0;

      offCtx.drawImage(loadedImg, drawX, drawY, drawW, drawH);

      let pixelData: Uint8ClampedArray;
      try {
        pixelData = offCtx.getImageData(0, 0, frameW, frameH).data;
      } catch {
        setParticlesReady(false);
        return;
      }

      // Fine, balanced sampling grid for silky motion without CPU bottleneck
      const step = isCompactViewport ? 7 : 5;
      const centerX = frameW * 0.5;
      const centerY = frameH * 0.45;
      const maxRadius = Math.hypot(centerX, centerY) || 1;
      const nextParticles: Particle[] = [];

      for (let py = 0; py < frameH; py += step) {
        for (let px = 0; px < frameW; px += step) {
          const idx = (py * frameW + px) * 4;
          const r = pixelData[idx];
          const g = pixelData[idx + 1];
          const b = pixelData[idx + 2];
          const a = pixelData[idx + 3];
          if (a < 40) continue;

          // Omit pure studio white backdrop outside the subject silhouette so Vignesh's portrait cleanly blasts
          const isStudioBackdrop = r > 236 && g > 236 && b > 236;
          if (isStudioBackdrop) continue;

          const dx = px - centerX;
          const dy = py - centerY;
          const dist = Math.hypot(dx, dy) || 1;
          const normX = dx / dist;
          const normY = dy / dist;

          // Deterministic pseudo-random hashes for exact scroll-up reconstruction
          const s1 = Math.sin(px * 12.9898 + py * 78.233) * 43758.5453;
          const r1 = s1 - Math.floor(s1);
          const s2 = Math.sin(px * 39.346 + py * 11.135) * 24634.6345;
          const r2 = s2 - Math.floor(s2);
          const s3 = Math.sin(px * 73.156 + py * 52.235) * 19283.4712;
          const r3 = s3 - Math.floor(s3);

          const glowIndex = Math.floor(r1 * GLOW_COLORS.length) % GLOW_COLORS.length;

          // Radial 3D blast velocity + graceful upward lift & lateral drift
          const speed = (isCompactViewport ? 110 : 175) + r1 * (isCompactViewport ? 130 : 220);
          const vx = normX * speed + (r2 - 0.5) * 95;
          const vy = normY * speed - 48 + (r3 - 0.5) * 85;
          const vz = (r2 - 0.25) * 340;

          // Outer silhouette edges peel away smoothly first, inner core follows
          const edgeWeight = Math.min(1, dist / maxRadius);
          const delay = (1 - edgeWeight) * 0.22 + r3 * 0.08;

          nextParticles.push({
            origX: imgOffsetX + px,
            origY: imgOffsetY + py,
            rgbPrefix: `${r},${g},${b}`,
            glowIndex,
            vx,
            vy,
            vz,
            size: (isCompactViewport ? 3.2 : 3.6) + r2 * 2.4,
            delay,
            spin: (r1 - 0.5) * 2.1,
            edgeWeight,
          });
        }
      }

      particles = nextParticles;
      setParticlesReady(true);
      lastDrawnProgress = -1;
    };

    const drawFrame = (progress: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Silky crossfade of underlying crisp portrait image
      if (imgEl) {
        const photoOpacity =
          progress <= 0.01
            ? 1
            : progress >= 0.28
              ? 0
              : 1 - Math.pow((progress - 0.01) / 0.27, 1.35);
        imgEl.style.opacity = photoOpacity.toFixed(3);
      }

      if (progress <= 0.002 || particles.length === 0) {
        return;
      }

      const layerIn = Math.min(1, progress / 0.1);
      const layerOut = progress > 0.78 ? Math.max(0, 1 - (progress - 0.78) / 0.22) : 1;
      const globalAlpha = layerIn * layerOut;
      if (globalAlpha <= 0.005) return;

      const focalLength = 520;
      const originCenterX = imgOffsetX + frameW * 0.5;
      const originCenterY = imgOffsetY + frameH * 0.45;

      // Pass 1: True-color micro pixels dissolving seamlessly from the photograph
      const pixelPhaseAlpha = globalAlpha * Math.max(0, 1 - progress * 1.9);
      if (pixelPhaseAlpha > 0.02) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const localT = Math.max(0, Math.min(1, (progress - p.delay) / (1 - p.delay)));
          // Smooth S-curve launch (zero sudden velocity jump at start)
          const ease = localT * localT * (3 - 2 * localT);

          const curl = ease * p.spin;
          const cosA = Math.cos(curl);
          const sinA = Math.sin(curl);
          const dx = p.vx * ease;
          const dy = p.vy * ease;

          const wx = p.origX + (dx * cosA - dy * sinA * 0.3);
          const wy = p.origY + (dy * cosA + dx * sinA * 0.3);
          const wz = p.vz * ease;

          const depth = Math.max(110, focalLength - wz);
          const persp = focalLength / depth;
          const sx = originCenterX + (wx - originCenterX) * persp;
          const sy = originCenterY + (wy - originCenterY) * persp;

          const rectSize = Math.max(1.8, p.size * 0.75 * persp);
          ctx.fillStyle = `rgba(${p.rgbPrefix},${pixelPhaseAlpha.toFixed(2)})`;
          ctx.fillRect(sx - rectSize * 0.5, sy - rectSize * 0.5, rectSize, rectSize);
        }
      }

      // Pass 2: Volumetric glowing crimson, purple, and pink embers
      const glowStrength = Math.min(1, progress * 2.4) * globalAlpha;
      if (glowStrength > 0.02) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const localT = Math.max(0, Math.min(1, (progress - p.delay) / (1 - p.delay)));
          const ease = localT * localT * (3 - 2 * localT);

          const curl = ease * p.spin;
          const cosA = Math.cos(curl);
          const sinA = Math.sin(curl);
          const dx = p.vx * ease;
          const dy = p.vy * ease;

          const wx = p.origX + (dx * cosA - dy * sinA * 0.3);
          const wy = p.origY + (dy * cosA + dx * sinA * 0.3);
          const wz = p.vz * ease;

          const depth = Math.max(110, focalLength - wz);
          const persp = focalLength / depth;
          const sx = originCenterX + (wx - originCenterX) * persp;
          const sy = originCenterY + (wy - originCenterY) * persp;

          const drawSize = Math.max(3, p.size * 2.6 * persp * (1 - ease * 0.2));
          ctx.globalAlpha = glowStrength * (0.45 + p.edgeWeight * 0.4) * (1 - ease * 0.25);
          ctx.drawImage(
            glowSprites[p.glowIndex],
            sx - drawSize * 0.5,
            sy - drawSize * 0.5,
            drawSize,
            drawSize
          );
        }
        ctx.restore();
      }
    };

    const tick = (_time: number, deltaTime: number) => {
      if (cancelled) return;
      // Exponential frame-rate independent damping so scroll bursts feel velvety smooth
      const dt = Math.min(deltaTime || 16.67, 50) / 1000;
      const dampFactor = 1 - Math.exp(-11 * dt);
      smoothedProgress += (targetProgress - smoothedProgress) * dampFactor;

      if (Math.abs(targetProgress - smoothedProgress) < 0.0004) {
        smoothedProgress = targetProgress;
      }

      if (Math.abs(smoothedProgress - lastDrawnProgress) > 0.0004) {
        lastDrawnProgress = smoothedProgress;
        drawFrame(smoothedProgress);
      }
    };

    gsap.ticker.add(tick);

    const imgLoader = new Image();
    imgLoader.crossOrigin = 'anonymous';
    imgLoader.onload = () => {
      buildParticles(imgLoader);
      ScrollTrigger.refresh();
      if (scrollTriggerInstance) {
        targetProgress = scrollTriggerInstance.progress;
        smoothedProgress = targetProgress;
        lastDrawnProgress = -1;
      }
    };
    imgLoader.src = src;

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: wrapper,
      start: () => {
        if (isCompactViewport) {
          return 'top 56px';
        }
        const naturalTop = wrapper.getBoundingClientRect().top + window.scrollY;
        const startOffset = Math.min(84, Math.max(20, Math.round(naturalTop - 24)));
        return `top ${startOffset}px`;
      },
      end: 'bottom -140px',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    const onResize = () => {
      if (imgLoader.complete && imgLoader.naturalWidth > 0) {
        buildParticles(imgLoader);
      }
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', onResize);
      scrollTriggerInstance?.kill();
      if (imgEl) {
        imgEl.style.opacity = '1';
      }
    };
  }, [src, reducedMotion, isCompactViewport, imageError]);

  return (
    <div ref={wrapperRef} className="relative aspect-[4/4.6] w-full overflow-visible rounded-xl">
      {/* Accessible Non-Animated Fallback / Base Portrait */}
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#EAE6F0]">
        {!imageError ? (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-top will-change-[opacity]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#100C16] p-6 text-center">
            <span className="font-display text-4xl font-bold text-[#FF557F]">
              {portfolioConfig.brand.monogram}
            </span>
            <span className="mt-2 text-sm text-[#A69EAC]">
              {portfolioConfig.personal.displayName}
            </span>
          </div>
        )}

        {/* Measured bottom scrim for legibility and seamless dark integration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#09070D] via-[#09070D]/60 to-transparent"
        />

        {/* Portrait Caption inside scrim */}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-base font-semibold text-[#F5F1F7]">
              {portfolioConfig.personal.displayName}
            </p>
            <p className="text-xs text-[#A69EAC]">{portfolioConfig.brand.domain}</p>
          </div>
          <span className="font-mono text-xs text-[#FF557F]">
            {portfolioConfig.brand.monogram}
          </span>
        </div>
      </div>

      {/* 3D Scroll-Driven Particle Canvas Overlay */}
      {!reducedMotion && !imageError && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`pointer-events-none absolute z-20 ${
            particlesReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
