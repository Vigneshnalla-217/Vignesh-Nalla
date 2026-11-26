import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { SectionHeader } from './SectionHeader';

export function JourneySection() {
  const { reducedMotion } = useDeviceCapabilities();
  const [selectedId, setSelectedId] = useState<string>(portfolioConfig.journey[0].id);

  return (
    <section id="journey" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="02"
          eyebrow="My Journey"
          title="From Foundational Math to Software Engineering."
          description="An honest timeline of where I stand today and the deliberate milestones ahead."
        />

        <div className="relative mt-14">
          {/* Glowing Vertical Spine */}
          <div
            aria-hidden="true"
            className="absolute left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#FF557F] via-[#C44D9E] to-[#9272FF]/35 md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-8 md:space-y-12">
            {portfolioConfig.journey.map((stage, idx) => {
              const isLeft = idx % 2 === 0;
              const isSelected = selectedId === stage.id;

              return (
                <motion.div
                  key={stage.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative grid grid-cols-1 items-center md:grid-cols-2"
                >
                  {/* Animated Timeline Node */}
                  <div
                    aria-hidden="true"
                    className={`absolute left-4 top-6 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-transform duration-200 md:left-1/2 md:top-1/2 md:-translate-y-1/2 ${
                      stage.isCurrent
                        ? 'border-[#FF557F] bg-[#09070D] shadow-[0_0_16px_rgba(255,85,127,0.75)]'
                        : 'border-[#9272FF] bg-[#09070D] shadow-[0_0_14px_rgba(146,114,255,0.5)]'
                    } ${isSelected ? 'scale-125' : 'scale-100'}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        stage.isCurrent ? 'bg-[#FF557F]' : 'bg-[#9272FF]'
                      }`}
                    />
                  </div>

                  {/* Card Slot */}
                  <div
                    className={`pl-11 md:pl-0 ${
                      isLeft ? 'md:col-start-1 md:pr-12' : 'md:col-start-2 md:pl-12'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(stage.id)}
                      className={`group w-full text-left rounded-2xl border p-6 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF557F] ${
                        isSelected
                          ? 'border-[#FF557F]/55 bg-[#140E1D] shadow-[0_14px_40px_rgba(255,85,127,0.12)]'
                          : 'border-white/[0.09] bg-[#100C16]/85 hover:border-[#9272FF]/45'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 text-xs font-medium">
                          <span className="font-mono tabular-nums text-[#FF557F]">
                            {stage.stepNumber}
                          </span>
                          <span aria-hidden="true" className="text-white/25">
                            ·
                          </span>
                          <span className={stage.isCurrent ? 'text-[#F5F1F7]' : 'text-[#A69EAC]'}>
                            {stage.phase}
                          </span>
                        </div>
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            isSelected
                              ? 'rotate-90 text-[#FF557F]'
                              : 'text-[#A69EAC] group-hover:translate-x-0.5'
                          }`}
                        />
                      </div>

                      <h3 className="mt-3 font-display text-xl font-semibold text-[#F5F1F7]">
                        {stage.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#A69EAC]">
                        {stage.summary}
                      </p>

                      {isSelected && (
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/[0.08] pt-4 text-xs text-[#C44D9E]">
                          {stage.highlights.map((item, hIdx) => (
                            <span key={item} className="inline-flex items-center gap-3">
                              <span>{item}</span>
                              {hIdx < stage.highlights.length - 1 && (
                                <span aria-hidden="true" className="text-white/20">
                                  ·
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
