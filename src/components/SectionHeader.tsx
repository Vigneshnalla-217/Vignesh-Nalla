import { motion } from 'motion/react';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';

interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeader({ index, eyebrow, title, description }: SectionHeaderProps) {
  const { reducedMotion } = useDeviceCapabilities();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl"
    >
      <div className="flex items-center gap-3 text-sm font-medium text-[#A69EAC]">
        <span className="font-mono tabular-nums text-[#FF557F]">{index}.</span>
        <span aria-hidden="true" className="text-white/25">
          /
        </span>
        <span className="tracking-wide text-[#C44D9E]">{eyebrow}</span>
      </div>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F5F1F7] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-[#A69EAC]">{description}</p>
      )}
    </motion.div>
  );
}
