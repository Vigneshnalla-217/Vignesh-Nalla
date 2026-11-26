import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { portfolioConfig } from '../data/portfolioConfig';

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryLinks = portfolioConfig.navigation.filter((item) => item.id !== 'contact');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = portfolioConfig.navigation.map((n) => n.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#09070D]/90 border-b border-white/[0.08] backdrop-blur-md'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          className="font-display text-xl font-bold tracking-tight text-[#F5F1F7] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF557F]"
          aria-label="Vignesh Nalla Home"
        >
          <span className="bg-gradient-to-r from-[#FF557F] via-[#C44D9E] to-[#9272FF] bg-clip-text text-transparent">
            {portfolioConfig.brand.monogram}
          </span>
        </a>

        {/* Zone 2: Primary Nav Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-6">
          {primaryLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF557F] ${
                  isActive ? 'text-[#F5F1F7]' : 'text-[#A69EAC] hover:text-[#F5F1F7]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#FF557F] to-[#9272FF]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
            className={`hidden md:inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF557F] ${
              activeSection === 'contact'
                ? 'bg-[#FF557F] text-[#09070D]'
                : 'border border-[#FF557F]/45 bg-[#FF557F]/12 text-[#F5F1F7] hover:bg-[#FF557F] hover:text-[#09070D]'
            }`}
          >
            Contact
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#100C16] text-[#F5F1F7] hover:border-[#FF557F]/50 focus-visible:outline-2 focus-visible:outline-[#FF557F]"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-white/[0.08] bg-[#09070D]/95 px-5 py-4 backdrop-blur-lg"
        >
          <div className="flex flex-col gap-1">
            {portfolioConfig.navigation.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#100C16] text-[#FF557F]'
                      : 'text-[#A69EAC] hover:bg-[#100C16]/60 hover:text-[#F5F1F7]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-[#FF557F] to-[#9272FF]" />
                  )}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
