import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, Code2, Eye, Github, X } from 'lucide-react';
import { portfolioConfig, ProjectItem } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { SectionHeader } from './SectionHeader';
import { TiltSurface } from './TiltSurface';

function ProjectVisual({ theme, title }: { theme: ProjectItem['visualTheme']; title: string }) {
  if (theme === 'python') {
    return (
      <div
        aria-label={`${title} geometric illustration`}
        className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#160F1E] via-[#09070D] to-[#1D0D19]"
      >
        <svg viewBox="0 0 320 160" className="h-full w-full opacity-90" fill="none">
          <defs>
            <linearGradient id="py-line" x1="0" y1="0" x2="320" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF557F" />
              <stop offset="100%" stopColor="#9272FF" />
            </linearGradient>
          </defs>
          <path d="M24 128H296M24 32H296" stroke="#ffffff" strokeOpacity="0.06" />
          <path d="M64 16V144M160 16V144M256 16V144" stroke="#ffffff" strokeOpacity="0.06" />
          <rect x="64" y="42" width="192" height="76" rx="12" fill="#100C16" stroke="url(#py-line)" strokeWidth="1.5" />
          <path d="M88 70L104 80L88 90" stroke="#FF557F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="116" y1="90" x2="152" y2="90" stroke="#9272FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="116" y1="70" x2="218" y2="70" stroke="#F5F1F7" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
          <circle cx="232" cy="56" r="4" fill="#FF557F" />
        </svg>
      </div>
    );
  }

  if (theme === 'java') {
    return (
      <div
        aria-label={`${title} geometric illustration`}
        className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#130E22] via-[#09070D] to-[#190F1E]"
      >
        <svg viewBox="0 0 320 160" className="h-full w-full opacity-90" fill="none">
          <circle cx="160" cy="80" r="54" stroke="#9272FF" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="5 5" />
          <polygon points="160,34 204,60 204,102 160,126 116,102 116,60" fill="#100C16" stroke="#9272FF" strokeWidth="1.75" />
          <polygon points="160,52 186,67 186,95 160,110 134,95 134,67" fill="#FF557F" fillOpacity="0.12" stroke="#FF557F" strokeWidth="1.5" />
          <circle cx="160" cy="80" r="6" fill="#F5F1F7" />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-label={`${title} geometric illustration`}
      className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#1A0D19] via-[#09070D] to-[#140E24]"
    >
      <svg viewBox="0 0 320 160" className="h-full w-full opacity-90" fill="none">
        <rect x="44" y="28" width="232" height="104" rx="12" fill="#100C16" stroke="#C44D9E" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="44" y1="52" x2="276" y2="52" stroke="#ffffff" strokeOpacity="0.08" />
        <circle cx="62" cy="40" r="3" fill="#FF557F" />
        <circle cx="74" cy="40" r="3" fill="#C44D9E" />
        <circle cx="86" cy="40" r="3" fill="#9272FF" />
        <rect x="64" y="68" width="88" height="44" rx="6" fill="#FF557F" fillOpacity="0.12" stroke="#FF557F" strokeOpacity="0.4" />
        <line x1="168" y1="74" x2="252" y2="74" stroke="#F5F1F7" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="168" y1="90" x2="234" y2="90" stroke="#A69EAC" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
        <line x1="168" y1="104" x2="214" y2="104" stroke="#9272FF" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function ProjectsSection() {
  const { reducedMotion } = useDeviceCapabilities();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    if (selectedProject) {
      window.addEventListener('keydown', onKeyDown);
    }
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 2xl:max-w-7xl">
        <SectionHeader
          index="05"
          eyebrow="Projects"
          title={portfolioConfig.projects.heading}
          description={portfolioConfig.projects.subheading}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolioConfig.projects.items.map((project, idx) => (
            <motion.div
              key={project.id}
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
                <article className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#100C16]/90 p-5 transition-colors duration-200 hover:border-[#9272FF]/50">
                  <div>
                    <ProjectVisual theme={project.visualTheme} title={project.title} />

                    <div className="mt-5">
                      <p className="font-mono text-xs font-medium text-[#FF557F]">
                        {project.stageLabel}
                      </p>
                      <h3 className="mt-1.5 font-display text-xl font-bold text-[#F5F1F7]">
                        {project.title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#A69EAC]">
                        {project.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    {/* Unboxed clean metadata tags */}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-white/[0.08] pt-4 text-xs text-[#A69EAC]">
                      {project.technologies.map((tech, tIdx) => (
                        <span key={tech} className="inline-flex items-center gap-2.5">
                          <span>{tech}</span>
                          {tIdx < project.technologies.length - 1 && (
                            <span aria-hidden="true" className="text-white/25">
                              ·
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[#FF557F]/45 bg-[#FF557F]/12 px-3 py-2 text-xs font-semibold text-[#F5F1F7] transition-colors duration-150 hover:bg-[#FF557F] hover:text-[#09070D] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF557F]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Project</span>
                      </button>

                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#09070D] px-3 py-2 text-xs font-semibold text-[#F5F1F7] transition-colors duration-150 hover:border-[#9272FF]/60 whitespace-nowrap shrink-0"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>GitHub</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#09070D]/80 px-3 py-2 text-xs font-medium text-[#A69EAC] transition-colors duration-150 hover:border-white/20 hover:text-[#F5F1F7] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#9272FF]"
                          title="Repository coming soon"
                        >
                          <Clock className="h-3.5 w-3.5 text-[#9272FF]" />
                          <span>Coming Soon</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </TiltSurface>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Concept Blueprint Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#100C16] p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-medium text-[#FF557F]">
                  {selectedProject.stageLabel}
                </p>
                <h3
                  id="project-modal-title"
                  className="mt-1 font-display text-2xl font-bold text-[#F5F1F7]"
                >
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#A69EAC] hover:border-white/25 hover:text-[#F5F1F7] focus-visible:outline-2 focus-visible:outline-[#FF557F]"
                aria-label="Close project details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#A69EAC]">
              {selectedProject.summary}
            </p>

            <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#09070D] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F5F1F7]">
                <Code2 className="h-4 w-4 text-[#9272FF]" />
                <span>Planned Learning Scope</span>
              </div>
              <ul className="mt-3 space-y-2">
                {selectedProject.plannedScope.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-[#A69EAC]">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF557F]"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
              <span className="text-xs text-[#A69EAC]">
                Live demo &amp; repository: <strong className="text-[#F5F1F7]">Coming Soon</strong>
              </span>
              <a
                href={portfolioConfig.social.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#9272FF]/50 bg-[#9272FF]/15 px-3.5 py-2 text-xs font-semibold text-[#F5F1F7] hover:bg-[#9272FF]/25 whitespace-nowrap shrink-0"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Follow My GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
