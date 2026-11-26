import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, Code2, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { HeroScene3D } from './HeroScene3D';
import { TiltSurface } from './TiltSurface';

export function HeroSection() {
  const { reducedMotion } = useDeviceCapabilities();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState<string>(portfolioConfig.personal.typingPhrases[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Typing animation for professional subtitle
  useEffect(() => {
    if (reducedMotion) {
      setTypedText(portfolioConfig.personal.title);
      return;
    }

    const phrases = portfolioConfig.personal.typingPhrases;
    const currentPhrase = phrases[phraseIndex];

    const timeout = window.setTimeout(
      () => {
        if (!isDeleting) {
          if (typedText.length < currentPhrase.length) {
            setTypedText(currentPhrase.slice(0, typedText.length + 1));
          } else {
            window.setTimeout(() => setIsDeleting(true), 1700);
          }
        } else {
          if (typedText.length > 0) {
            setTypedText(currentPhrase.slice(0, typedText.length - 1));
          } else {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? 34 : 62
    );

    return () => window.clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIndex, reducedMotion]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-20 pb-12"
    >
      {/* Background radial atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_70%_28%,rgba(146,114,255,0.16),transparent_65%),radial-gradient(ellipse_55%_45%_at_18%_72%,rgba(255,85,127,0.14),transparent_65%)]"
      />

      {/* Interactive Three.js 3D Stage */}
      <HeroScene3D />

      {/* Subtle ambient code syntax accents (desktop only, non-overlapping) */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute inset-x-0 top-28 mx-auto max-w-6xl px-8"
      >
        <span className="animate-subtle-float absolute right-12 top-2 font-mono text-xs text-[#9272FF]/50">
          {'{ code: "future" }'}
        </span>
        <span className="animate-subtle-float-delayed absolute left-8 -bottom-72 font-mono text-xs text-[#FF557F]/45">
          {'def learn(today): return tomorrow'}
        </span>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Architectural Typography & Actions */}
          <div className="lg:col-span-7">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-sm font-medium tracking-[0.2em] text-[#FF557F]"
            >
              {portfolioConfig.personal.greeting}
            </motion.p>

            <motion.h1
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 font-display text-4xl font-extrabold tracking-tight text-[#F5F1F7] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.03]"
            >
              <span className="animate-gradient-text bg-gradient-to-r from-[#F5F1F7] via-[#FF557F] to-[#9272FF] bg-clip-text text-transparent">
                {portfolioConfig.personal.fullName}
              </span>
            </motion.h1>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 flex min-h-[2.25rem] items-center"
            >
              <p className="font-display text-xl font-semibold text-[#F5F1F7] sm:text-2xl">
                <span>{typedText}</span>
                {!reducedMotion && (
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-6 w-[2px] align-middle bg-[#FF557F]"
                  />
                )}
              </p>
            </motion.div>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 max-w-xl text-base leading-relaxed text-[#A69EAC] sm:text-lg"
            >
              {portfolioConfig.personal.heroIntro}
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={() => scrollTo('projects')}
                className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FF557F] to-[#C44D9E] px-6 py-3 text-sm font-semibold text-[#09070D] shadow-[0_8px_30px_rgba(255,85,127,0.3)] transition-all duration-200 hover:brightness-110 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF557F]"
              >
                <span>Explore My Work</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('contact')}
                className="group inline-flex min-h-[46px] items-center gap-2.5 rounded-xl border border-white/15 bg-[#100C16]/90 px-6 py-3 text-sm font-semibold text-[#F5F1F7] transition-all duration-200 hover:border-[#9272FF]/60 hover:bg-[#181222] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9272FF]"
              >
                <span>Contact Me</span>
                <ArrowDownRight className="h-4 w-4 text-[#9272FF] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: Studio Portrait Frame + Floating Highlights */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-md"
          >
            <TiltSurface maxTiltDeg={5}>
              <div className="relative rounded-2xl border border-white/12 bg-gradient-to-b from-[#161020] to-[#100C16] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
                {/* Ambient corner glow behind frame */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-[#FF557F]/35 via-transparent to-[#9272FF]/35 opacity-60 blur-sm"
                />

                {/* Portrait Image Slot */}
                <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-xl bg-[#EAE6F0]">
                  {!imageError ? (
                    <img
                      src={portfolioConfig.personal.profilePhoto.src}
                      alt={portfolioConfig.personal.profilePhoto.alt}
                      onError={() => setImageError(true)}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
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
                      <p className="text-xs text-[#A69EAC]">
                        {portfolioConfig.brand.domain}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[#FF557F]">
                      {portfolioConfig.brand.monogram}
                    </span>
                  </div>
                </div>
              </div>
            </TiltSurface>

            {/* Floating Information Card 1 (solid/rgba surface, no backdrop-blur over WebGL) */}
            <div className="animate-subtle-float mt-4 grid grid-cols-2 gap-3 sm:mt-0 sm:block">
              <div className="sm:absolute sm:-left-8 sm:top-8 rounded-xl border border-white/12 bg-[#100C16]/95 px-4 py-3 shadow-[0_14px_36px_rgba(0,0,0,0.55)]">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-4 w-4 shrink-0 text-[#FF557F]" />
                  <div>
                    <p className="text-[11px] font-medium text-[#A69EAC]">
                      {portfolioConfig.personal.floatingHighlights[0].label}
                    </p>
                    <p className="text-sm font-semibold text-[#F5F1F7]">
                      {portfolioConfig.personal.floatingHighlights[0].value}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Information Card 2 */}
              <div className="animate-subtle-float-delayed sm:absolute sm:-right-6 sm:bottom-16 rounded-xl border border-white/12 bg-[#100C16]/95 px-4 py-3 shadow-[0_14px_36px_rgba(0,0,0,0.55)]">
                <div className="flex items-center gap-2.5">
                  <Code2 className="h-4 w-4 shrink-0 text-[#9272FF]" />
                  <div>
                    <p className="text-[11px] font-medium text-[#A69EAC]">
                      {portfolioConfig.personal.floatingHighlights[1].label}
                    </p>
                    <p className="text-sm font-semibold text-[#F5F1F7]">
                      {portfolioConfig.personal.floatingHighlights[1].value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Summary Row Below Hero Split */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid grid-cols-2 gap-6 border-t border-white/[0.08] pt-8 sm:grid-cols-4"
        >
          <div>
            <p className="text-xs font-medium text-[#A69EAC]">Current Stage</p>
            <p className="mt-1 font-display text-base font-semibold text-[#F5F1F7]">
              Intermediate 2nd Year
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#A69EAC]">Academic Stream</p>
            <p className="mt-1 font-display text-base font-semibold text-[#F5F1F7]">
              MPC
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#A69EAC]">Learning Focus</p>
            <p className="mt-1 font-display text-base font-semibold text-[#F5F1F7]">
              Python &amp; Java
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#A69EAC]">Experience Level</p>
            <p className="mt-1 font-display text-base font-semibold text-[#FF557F]">
              Currently Learning
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
