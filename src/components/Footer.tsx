import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

interface FooterProps {
  onOpenAnalytics: () => void;
}

export function Footer({ onOpenAnalytics }: FooterProps) {
  const { reducedMotion } = useDeviceCapabilities();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-[#09070D] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 2xl:max-w-7xl">
        {/* Developer Identity & Animated Signature Block */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/[0.08] pb-10 md:flex-row md:items-end">
          <div>
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs font-semibold tracking-[0.22em] text-[#FF557F]"
            >
              {portfolioConfig.brand.signature}
            </motion.p>

            <div className="mt-3 flex items-center gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#F5F1F7]">
                  {portfolioConfig.personal.displayName}
                </h2>
                <p className="mt-0.5 text-sm text-[#A69EAC]">
                  {portfolioConfig.personal.title}
                </p>
              </div>

              {/* Animated Signature Stroke */}
              <svg
                viewBox="0 0 120 40"
                className="h-9 w-28 shrink-0"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="footer-sig-grad" x1="4" y1="20" x2="116" y2="20" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FF557F" />
                    <stop offset="50%" stopColor="#C44D9E" />
                    <stop offset="100%" stopColor="#9272FF" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M6 12L17 30L28 10C30 22 33 28 38 22C42 17 44 26 50 24C57 21 68 18 114 21"
                  stroke="url(#footer-sig-grad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reducedMotion ? false : { pathLength: 0, opacity: 0.3 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                />
              </svg>
            </div>

            <motion.div
              aria-hidden="true"
              initial={reducedMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left center' }}
              className="mt-4 h-[2px] w-48 rounded-full bg-gradient-to-r from-[#FF557F] via-[#C44D9E] to-[#9272FF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[#A69EAC]">
            <a
              href={`mailto:${portfolioConfig.social.email}`}
              className="transition-colors hover:text-[#FF557F]"
            >
              Email
            </a>
            <a
              href={portfolioConfig.social.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#9272FF]"
            >
              GitHub
            </a>
            <a
              href={portfolioConfig.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#C44D9E]"
            >
              Instagram
            </a>
            <button
              type="button"
              onClick={onOpenAnalytics}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A69EAC] transition-colors hover:text-[#F5F1F7] focus-visible:outline-2 focus-visible:outline-[#9272FF]"
            >
              <BarChart3 className="h-3.5 w-3.5 text-[#9272FF]" />
              <span>Owner Analytics</span>
            </button>
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="mt-6 flex flex-col items-start justify-between gap-2 text-xs text-[#A69EAC] sm:flex-row sm:items-center">
          <p>
            &copy; {year} {portfolioConfig.personal.displayName} · {portfolioConfig.brand.domain}
          </p>
          <p>Intermediate 2nd Year · MPC · Python &amp; Java</p>
        </div>
      </div>
    </footer>
  );
}
