import { motion } from 'motion/react';
import { Award, GraduationCap } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { SectionHeader } from './SectionHeader';

export function EducationSection() {
  const { reducedMotion } = useDeviceCapabilities();

  return (
    <section id="education" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index="05"
          eyebrow="Education"
          title={portfolioConfig.education.heading}
          description={portfolioConfig.education.subheading}
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Educational Timeline */}
          <div className="lg:col-span-8">
            <div className="relative pl-8">
              <div
                aria-hidden="true"
                className="absolute left-2.5 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#FF557F] to-[#9272FF]/30"
              />

              <div className="space-y-6">
                {portfolioConfig.education.items.map((edu, idx) => (
                  <motion.article
                    key={edu.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      duration: 0.45,
                      delay: idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative rounded-2xl border border-white/[0.1] bg-[#100C16]/90 p-6 sm:p-7"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-[29px] top-7 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#FF557F] bg-[#09070D]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF557F]" />
                    </span>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs font-medium text-[#FF557F]">
                        {edu.timeframe}
                      </span>
                      <GraduationCap className="h-5 w-5 text-[#9272FF]" />
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-bold text-[#F5F1F7]">
                      {edu.level}
                    </h3>
                    <p className="mt-1 text-base font-medium text-[#C44D9E]">{edu.stream}</p>

                    <p className="mt-4 text-sm leading-relaxed text-[#A69EAC]">
                      {edu.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/[0.08] pt-4 text-xs text-[#F5F1F7]/85">
                      <span className="text-[#A69EAC]">Core Subjects:</span>
                      {edu.subjects.map((subject, sIdx) => (
                        <span key={subject} className="inline-flex items-center gap-3">
                          <span>{subject}</span>
                          {sIdx < edu.subjects.length - 1 && (
                            <span aria-hidden="true" className="text-white/25">
                              ·
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications / Future Academic Milestones Slot */}
          <div className="lg:col-span-4">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#100C16]/75 p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#9272FF]">Milestones</span>
                  <Award className="h-5 w-5 text-[#FF557F]" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-[#F5F1F7]">
                  Certifications &amp; Next Degrees
                </h3>

                {portfolioConfig.education.certifications.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {portfolioConfig.education.certifications.map((cert) => (
                      <li key={cert.id} className="border-t border-white/[0.08] pt-3">
                        <p className="text-sm font-semibold text-[#F5F1F7]">{cert.title}</p>
                        <p className="text-xs text-[#A69EAC]">
                          {cert.issuer} · {cert.date}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-[#A69EAC]">
                    Focused currently on completing Intermediate 2nd Year (MPC) while building core
                    Python and Java skills. Verified certifications and computer science studies
                    will be listed here as they are earned.
                  </p>
                )}
              </div>

              <p className="mt-6 border-t border-white/[0.08] pt-4 font-mono text-xs text-[#A69EAC]">
                Editable in portfolioConfig.ts
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
