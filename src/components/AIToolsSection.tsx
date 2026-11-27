import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AIConceptItem,
  AIToolCategory,
  AIToolItem,
  PlannedAIProject,
  portfolioConfig,
} from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { AIToolLogo } from './AIToolLogo';
import { SectionHeader } from './SectionHeader';
import { TiltSurface } from './TiltSurface';

type FilterTab = 'All' | AIToolCategory;

export function AIToolsSection() {
  const { reducedMotion } = useDeviceCapabilities();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [selectedTool, setSelectedTool] = useState<AIToolItem>(portfolioConfig.aiInnovation.tools[0]);
  const [selectedConcept, setSelectedConcept] = useState<AIConceptItem>(
    portfolioConfig.aiInnovation.concepts[0]
  );
  const [modalAIProject, setModalAIProject] = useState<PlannedAIProject | null>(null);

  const filteredTools = useMemo(() => {
    if (activeFilter === 'All') return portfolioConfig.aiInnovation.tools;
    return portfolioConfig.aiInnovation.tools.filter((tool) => tool.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalAIProject(null);
    };
    if (modalAIProject) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalAIProject]);

  return (
    <section id="ai-tools" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 2xl:max-w-7xl">
        <SectionHeader
          index="04"
          eyebrow="Artificial Intelligence & Innovation"
          title={portfolioConfig.aiInnovation.heading}
          description={portfolioConfig.aiInnovation.subheading}
        />

        {/* 1. Honest Distinction: Demonstrated Foundations vs. Concepts Being Learned */}
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/[0.09] bg-[#100C16]/85 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-[#F5F1F7]">
                Skills &amp; Habits Demonstrated
              </h3>
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#FF557F]" />
            </div>
            <ul className="mt-4 space-y-2.5 border-t border-white/[0.08] pt-4">
              {portfolioConfig.aiInnovation.demonstratedVsLearning.demonstrated.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#A69EAC]">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF557F]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/[0.09] bg-[#100C16]/85 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-[#F5F1F7]">
                AI Concepts Currently Learning
              </h3>
              <Compass className="h-5 w-5 shrink-0 text-[#9272FF]" />
            </div>
            <ul className="mt-4 space-y-2.5 border-t border-white/[0.08] pt-4">
              {portfolioConfig.aiInnovation.demonstratedVsLearning.learning.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#A69EAC]">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9272FF]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* 2. Official AI Tools Ecosystem with Brand Logos */}
        <div className="mt-16">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#F5F1F7]">
                AI Tools &amp; Platforms
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm text-[#A69EAC]">
                Honest categorization across the AI tools I use daily for learning, tools I am actively studying, and builders I want to explore next.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Filter AI tools by category"
              className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#100C16] p-1.5 shrink-0"
            >
              {portfolioConfig.aiInnovation.categories.map((cat) => {
                const isSelected = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveFilter(cat)}
                    className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF557F] ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FF557F] to-[#9272FF] font-semibold text-[#09070D]'
                        : 'text-[#A69EAC] hover:text-[#F5F1F7]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Logo Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
              {filteredTools.map((tool, idx) => {
                const isSelected = selectedTool.id === tool.id;
                return (
                  <motion.div
                    key={tool.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.03,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <TiltSurface maxTiltDeg={4} className="h-full">
                      <button
                        type="button"
                        onClick={() => setSelectedTool(tool)}
                        className={`group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF557F] ${
                          isSelected
                            ? 'border-[#FF557F]/60 bg-[#150E1F]'
                            : 'border-white/[0.09] bg-[#100C16]/85 hover:-translate-y-0.5 hover:border-white/25'
                        }`}
                      >
                        {/* Subtle Brand-Color Radial Glow on Hover/Selected */}
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300 ${
                            isSelected ? 'opacity-25' : 'opacity-0 group-hover:opacity-20'
                          }`}
                          style={{ backgroundColor: tool.brandColor }}
                        />

                        <div className="relative z-10 w-full">
                          <div className="flex items-center justify-between gap-3">
                            <AIToolLogo
                              id={tool.id}
                              name={tool.name}
                              className="h-10 w-10 shrink-0 transition-transform duration-200 group-hover:scale-105"
                            />
                            <span
                              className="font-mono text-[11px] font-medium text-right"
                              style={{ color: tool.brandColor }}
                            >
                              {tool.category}
                            </span>
                          </div>

                          <h4 className="mt-4 font-display text-lg font-bold text-[#F5F1F7]">
                            {tool.name}
                          </h4>
                          <p className="mt-0.5 text-xs font-medium text-[#C44D9E]">{tool.role}</p>
                          <p className="mt-2.5 text-xs leading-relaxed text-[#A69EAC]">
                            {tool.summary}
                          </p>
                        </div>

                        <div className="relative z-10 mt-4 flex w-full items-center justify-between border-t border-white/[0.07] pt-3 text-[11px] font-medium text-[#A69EAC]">
                          <span>{isSelected ? 'Viewing details' : 'Inspect focus'}</span>
                          <span className="font-mono text-[#F5F1F7]">→</span>
                        </div>
                      </button>
                    </TiltSurface>
                  </motion.div>
                );
              })}
            </div>

            {/* Tool Inspector Column */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-white/[0.1] bg-[#100C16]/95 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#A69EAC]">
                    <Bot className="h-4 w-4 text-[#FF557F]" />
                    <span>Tool Focus Inspector</span>
                  </div>
                  <Cpu className="h-4 w-4 text-[#9272FF]" />
                </div>

                <div className="mt-5 border-t border-white/[0.08] pt-5">
                  <div className="flex items-center gap-3.5">
                    <AIToolLogo id={selectedTool.id} name={selectedTool.name} className="h-11 w-11 shrink-0" />
                    <div>
                      <p
                        className="font-mono text-xs font-medium"
                        style={{ color: selectedTool.brandColor }}
                      >
                        {selectedTool.category}
                      </p>
                      <h4 className="font-display text-xl font-bold text-[#F5F1F7]">
                        {selectedTool.name}
                      </h4>
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-[#C44D9E]">{selectedTool.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#A69EAC]">
                    {selectedTool.summary}
                  </p>

                  <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#09070D] p-4">
                    <p className="text-xs font-semibold text-[#F5F1F7]">How I Approach It</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#A69EAC]">
                      {selectedTool.learningFocus}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                    <span className="text-xs text-[#A69EAC]">Official Platform</span>
                    <a
                      href={selectedTool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#09070D] px-3.5 py-2 text-xs font-semibold text-[#F5F1F7] transition-colors hover:border-[#FF557F]/55 whitespace-nowrap shrink-0"
                    >
                      <span>Visit {selectedTool.name}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Dedicated AI Concepts & Engineering Interests (All 8 Domains) */}
        <div className="mt-16 rounded-2xl border border-white/[0.09] bg-[#100C16]/75 p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#9272FF]">
                <BrainCircuit className="h-4 w-4" />
                <span>AI Concepts &amp; Development Interests</span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#F5F1F7]">
                Core Areas I Am Studying
              </h3>
            </div>
            <p className="text-xs text-[#A69EAC]">Select a topic to inspect study focus</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:col-span-7">
              {portfolioConfig.aiInnovation.concepts.map((concept) => {
                const active = selectedConcept.id === concept.id;
                return (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => setSelectedConcept(concept)}
                    className={`flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#FF557F] ${
                      active
                        ? 'border-[#FF557F]/60 bg-[#170F22]'
                        : 'border-white/[0.07] bg-[#09070D]/80 hover:border-[#9272FF]/45'
                    }`}
                  >
                    <span className="font-mono text-[11px] text-[#9272FF]">{concept.status}</span>
                    <span className="mt-1.5 font-display text-sm font-semibold text-[#F5F1F7] sm:text-base">
                      {concept.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-5">
              <div className="flex h-full flex-col justify-between rounded-xl border border-white/[0.08] bg-[#09070D] p-5 sm:p-6">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-[#FF557F]">
                      {selectedConcept.status}
                    </span>
                    <Layers className="h-4 w-4 text-[#9272FF]" />
                  </div>
                  <h4 className="mt-2 font-display text-xl font-bold text-[#F5F1F7]">
                    {selectedConcept.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#A69EAC]">
                    {selectedConcept.summary}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/[0.08] pt-4">
                  <p className="text-xs font-semibold text-[#F5F1F7]">Key Focus Areas</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#A69EAC]">
                    {selectedConcept.keyFocus.map((item, kIdx) => (
                      <span key={item} className="inline-flex items-center gap-3">
                        <span className="text-[#F5F1F7]/90">{item}</span>
                        {kIdx < selectedConcept.keyFocus.length - 1 && (
                          <span aria-hidden="true" className="text-white/25">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Planned AI Projects Showcase (Coming Soon) */}
        <div className="mt-16">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#F5F1F7]">
                Planned AI Projects
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm text-[#A69EAC]">
                Upcoming AI application concepts I plan to build as I advance in Python and API engineering. None of these are published yet.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioConfig.aiInnovation.plannedProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltSurface maxTiltDeg={4} className="h-full">
                  <article className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#100C16]/90 p-6 transition-colors duration-200 hover:border-[#9272FF]/50">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono font-medium text-[#FF557F]">
                          {project.status}
                        </span>
                        <span className="text-[#A69EAC]">{project.category}</span>
                      </div>

                      <h4 className="mt-3 font-display text-xl font-bold text-[#F5F1F7]">
                        {project.title}
                      </h4>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#A69EAC]">
                        {project.summary}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-white/[0.08] pt-4">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#A69EAC]">
                        {project.plannedStack.map((tech, tIdx) => (
                          <span key={tech} className="inline-flex items-center gap-2.5">
                            <span>{tech}</span>
                            {tIdx < project.plannedStack.length - 1 && (
                              <span aria-hidden="true" className="text-white/25">
                                ·
                              </span>
                            )}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setModalAIProject(project)}
                        className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#09070D] px-4 py-2 text-xs font-semibold text-[#F5F1F7] transition-colors hover:border-[#FF557F]/50 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#FF557F]"
                      >
                        <Clock className="h-3.5 w-3.5 text-[#9272FF]" />
                        <span>View Planned Concept · Coming Soon</span>
                      </button>
                    </div>
                  </article>
                </TiltSurface>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. Future AI Vision Banner */}
        <div className="mt-12 rounded-2xl border border-[#9272FF]/25 bg-gradient-to-r from-[#130D1C] via-[#100C16] to-[#190D19] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF557F]">
                <Sparkles className="h-4 w-4" />
                <span>Vision for the Future</span>
              </div>
              <p className="mt-2.5 text-base leading-relaxed text-[#F5F1F7]">
                {portfolioConfig.aiInnovation.vision}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Planned AI Project Blueprint Modal */}
      {modalAIProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setModalAIProject(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#100C16] p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-medium text-[#FF557F]">
                  {modalAIProject.status} · {modalAIProject.category}
                </p>
                <h4
                  id="ai-project-modal-title"
                  className="mt-1 font-display text-2xl font-bold text-[#F5F1F7]"
                >
                  {modalAIProject.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setModalAIProject(null)}
                aria-label="Close AI project concept"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#A69EAC] hover:border-white/25 hover:text-[#F5F1F7]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#A69EAC]">{modalAIProject.summary}</p>

            <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#09070D] p-4">
              <p className="text-xs font-semibold text-[#F5F1F7]">Planned Capabilities</p>
              <ul className="mt-3 space-y-2">
                {modalAIProject.goals.map((goal) => (
                  <li key={goal} className="flex items-start gap-2.5 text-sm text-[#A69EAC]">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9272FF]"
                    />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4 text-xs text-[#A69EAC]">
              <span>Status: Coming Soon (no fake results or repo links)</span>
              <button
                type="button"
                onClick={() => setModalAIProject(null)}
                className="rounded-lg border border-white/15 bg-[#09070D] px-3.5 py-2 font-semibold text-[#F5F1F7] hover:border-[#FF557F]/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
