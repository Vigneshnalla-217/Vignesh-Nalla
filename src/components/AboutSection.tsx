import { motion } from 'motion/react';
import { BookOpen, Compass, Cpu, Sparkles } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { SectionHeader } from './SectionHeader';
import { TiltSurface } from './TiltSurface';

const pillarIcons = [BookOpen, Cpu, Compass, Sparkles];

export function AboutSection() {
  const { reducedMotion } = useDeviceCapabilities();

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="01"
          eyebrow="About Me"
          title={portfolioConfig.about.heading}
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Narrative Column */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 lg:col-span-5"
          >
            {portfolioConfig.about.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={`leading-relaxed ${
                  idx === 0
                    ? 'text-lg font-medium text-[#F5F1F7]'
                    : 'text-base text-[#A69EAC]'
                }`}
              >
                {paragraph}
              </p>
            ))}

            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A69EAC]">
              <span>MPC Student</span>
              <span aria-hidden="true">·</span>
              <span>Python &amp; Java Learner</span>
              <span aria-hidden="true">·</span>
              <span>Aspiring Software Developer</span>
            </div>
          </motion.div>

          {/* 4-Pillar Bento Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {portfolioConfig.about.pillars.map((pillar, idx) => {
              const Icon = pillarIcons[idx % pillarIcons.length];
              return (
                <motion.div
                  key={pillar.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <TiltSurface className="h-full">
                    <div className="group flex h-full flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#100C16]/85 p-6 transition-colors duration-200 hover:border-[#9272FF]/45">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs tabular-nums text-[#A69EAC]">
                            0{idx + 1}
                          </span>
                          <Icon className="h-5 w-5 text-[#FF557F] transition-colors duration-200 group-hover:text-[#9272FF]" />
                        </div>
                        <h3 className="mt-5 font-display text-lg font-semibold text-[#F5F1F7]">
                          {pillar.title}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-[#A69EAC]">
                          {pillar.detail}
                        </p>
                      </div>
                    </div>
                  </TiltSurface>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
