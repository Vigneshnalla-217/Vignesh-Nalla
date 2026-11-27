import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Play, RotateCcw, Terminal } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { SectionHeader } from './SectionHeader';
import { TiltSurface } from './TiltSurface';

export function SkillsSection() {
  const { reducedMotion } = useDeviceCapabilities();
  const [expandedRoadmap, setExpandedRoadmap] = useState(false);
  const [executedIds, setExecutedIds] = useState<Record<string, boolean>>({});

  const toggleRun = (id: string) => {
    setExecutedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 2xl:max-w-7xl">
        <SectionHeader
          index="03"
          eyebrow="Technical Skills"
          title={portfolioConfig.skills.heading}
          description={portfolioConfig.skills.subheading}
        />

        {/* Active Learning Languages Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {portfolioConfig.skills.items.map((skill, idx) => {
            const hasRun = Boolean(executedIds[skill.id]);

            return (
              <motion.div
                key={skill.id}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <TiltSurface className="h-full">
                  <article className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.1] bg-[#100C16]/90 p-6 sm:p-7 transition-colors duration-200 hover:border-[#FF557F]/45">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className="font-mono text-xs font-medium tracking-wide"
                            style={{ color: skill.accentHex }}
                          >
                            {skill.status}
                          </p>
                          <h3 className="mt-1.5 font-display text-2xl font-bold text-[#F5F1F7]">
                            {skill.name}
                          </h3>
                        </div>
                        <Terminal
                          className="h-5 w-5 shrink-0"
                          style={{ color: skill.accentHex }}
                        />
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-[#A69EAC]">
                        {skill.tagline}
                      </p>

                      <ul className="mt-5 space-y-2 border-t border-white/[0.08] pt-5">
                        {skill.focusAreas.map((focus) => (
                          <li
                            key={focus}
                            className="flex items-start gap-2.5 text-sm text-[#F5F1F7]/90"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: skill.accentHex }}
                            />
                            <span>{focus}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Code Explorer Surface */}
                    <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.07] bg-[#09070D]">
                      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                        <span className="font-mono text-[11px] text-[#A69EAC]">
                          {skill.codeLanguage} · Practice Snippet
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleRun(skill.id)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-white/12 bg-[#100C16] px-2.5 py-1 text-[11px] font-medium text-[#F5F1F7] transition-colors hover:border-[#FF557F]/50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF557F]"
                        >
                          {hasRun ? (
                            <>
                              <RotateCcw className="h-3 w-3 text-[#9272FF]" />
                              <span>Reset Output</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 text-[#FF557F]" />
                              <span>Run Snippet</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="overflow-x-auto p-4">
                        <pre className="font-mono text-xs leading-relaxed text-[#F5F1F7]/90">
                          <code>{skill.sampleCode}</code>
                        </pre>
                      </div>

                      {hasRun && (
                        <div className="border-t border-white/[0.06] bg-[#100C16]/80 px-4 py-3">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-[#A69EAC]">
                            Output
                          </p>
                          <pre className="mt-1 font-mono text-xs leading-relaxed text-[#FF557F] whitespace-pre-wrap">
                            {skill.sampleOutput}
                          </pre>
                        </div>
                      )}
                    </div>
                  </article>
                </TiltSurface>
              </motion.div>
            );
          })}
        </div>

        {/* Expandable Future Languages / Roadmap Strip */}
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#100C16]/70 px-6 py-5">
          <button
            type="button"
            onClick={() => setExpandedRoadmap((prev) => !prev)}
            className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9272FF]"
            aria-expanded={expandedRoadmap}
          >
            <div>
              <h3 className="font-display text-base font-semibold text-[#F5F1F7]">
                Planned Next Technologies
              </h3>
              <p className="mt-0.5 text-sm text-[#A69EAC]">
                Languages and developer tools I plan to explore next as my foundations solidify.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9272FF] whitespace-nowrap shrink-0">
              <span>{expandedRoadmap ? 'Collapse' : 'View Roadmap'}</span>
              {expandedRoadmap ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          </button>

          {expandedRoadmap && (
            <div className="mt-4 border-t border-white/[0.08] pt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#A69EAC]">
              {portfolioConfig.skills.upcomingTopics.map((topic, tIdx) => (
                <span key={topic} className="inline-flex items-center gap-4">
                  <span className="text-[#F5F1F7]">{topic}</span>
                  {tIdx < portfolioConfig.skills.upcomingTopics.length - 1 && (
                    <span aria-hidden="true" className="text-white/20">
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
