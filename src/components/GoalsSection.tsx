import { useState } from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';
import { portfolioConfig } from '../data/portfolioConfig';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { SectionHeader } from './SectionHeader';
import { TiltSurface } from './TiltSurface';

export function GoalsSection() {
  const { reducedMotion } = useDeviceCapabilities();
  const [activeGoalId, setActiveGoalId] = useState<string>(portfolioConfig.goals.items[0].id);

  return (
    <section id="goals" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 2xl:max-w-7xl">
        <SectionHeader
          index="07"
          eyebrow="Future Goals"
          title={portfolioConfig.goals.heading}
          description={portfolioConfig.goals.subheading}
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioConfig.goals.items.map((goal, idx) => {
            const isActive = activeGoalId === goal.id;
            const isFinalGoal = idx === portfolioConfig.goals.items.length - 1;

            return (
              <motion.div
                key={goal.id}
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={isFinalGoal ? 'sm:col-span-2 lg:col-span-3' : ''}
              >
                <TiltSurface maxTiltDeg={4} className="h-full">
                  <button
                    type="button"
                    onClick={() => setActiveGoalId(goal.id)}
                    className={`group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border p-6 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF557F] ${
                      isActive
                        ? 'border-[#FF557F]/55 bg-[#150E1E] shadow-[0_14px_40px_rgba(255,85,127,0.1)]'
                        : 'border-white/[0.09] bg-[#100C16]/85 hover:border-[#9272FF]/45'
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 text-xs font-medium">
                          <span className="font-mono tabular-nums text-[#FF557F]">
                            {goal.index}
                          </span>
                          <span aria-hidden="true" className="text-white/25">
                            ·
                          </span>
                          <span className="text-[#A69EAC]">{goal.category}</span>
                        </div>
                        <Target
                          className={`h-4 w-4 transition-colors duration-200 ${
                            isActive ? 'text-[#FF557F]' : 'text-[#9272FF]/70 group-hover:text-[#9272FF]'
                          }`}
                        />
                      </div>

                      <h3 className="mt-4 font-display text-lg font-semibold text-[#F5F1F7] sm:text-xl">
                        {goal.title}
                      </h3>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A69EAC]">
                        {goal.description}
                      </p>
                    </div>

                    {/* Subtle animated bottom gradient line when active */}
                    <div
                      aria-hidden="true"
                      className={`mt-5 h-[2px] w-full rounded-full transition-opacity duration-200 bg-gradient-to-r from-[#FF557F] via-[#C44D9E] to-[#9272FF] ${
                        isActive ? 'opacity-100' : 'opacity-15 group-hover:opacity-50'
                      }`}
                    />
                  </button>
                </TiltSurface>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
