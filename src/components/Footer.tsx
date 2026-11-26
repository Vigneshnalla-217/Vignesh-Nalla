import { portfolioConfig } from '../data/portfolioConfig';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-[#09070D] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold bg-gradient-to-r from-[#FF557F] to-[#9272FF] bg-clip-text text-transparent">
              {portfolioConfig.brand.monogram}
            </span>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <span className="text-sm font-medium text-[#F5F1F7]">
              {portfolioConfig.personal.displayName}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-[#A69EAC]">
            &copy; {year} {portfolioConfig.personal.displayName} · {portfolioConfig.brand.domain}
          </p>
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
        </div>
      </div>
    </footer>
  );
}
