import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AIToolsSection } from './components/AIToolsSection';
import { BackToTopButton } from './components/BackToTopButton';
import { CinematicPreloader } from './components/CinematicPreloader';
import { ContactSection } from './components/ContactSection';
import { CustomCursor } from './components/CustomCursor';
import { EducationSection } from './components/EducationSection';
import { Footer } from './components/Footer';
import { GoalsSection } from './components/GoalsSection';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { Navbar } from './components/Navbar';
import { OwnerAnalyticsModal } from './components/OwnerAnalyticsModal';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';

export default function App() {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Privacy-conscious pageview tracking (respects Do Not Track, sends only coarse source/device info)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (navigator.doNotTrack === '1') return;

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || params.get('ref') || '';
    const width = window.innerWidth;
    const deviceHint = width < 768 ? 'Mobile' : width < 1024 ? 'Tablet' : 'Desktop';

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrer: document.referrer || '',
        utmSource,
        deviceHint,
      }),
      keepalive: true,
    }).catch(() => {
      // Silently ignore analytics errors so user experience is never interrupted
    });
  }, []);

  // Allow opening Owner Analytics directly via #owner-analytics URL hash
  useEffect(() => {
    if (window.location.hash === '#owner-analytics') {
      setAnalyticsOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#09070D] text-[#F5F1F7]">
      <CinematicPreloader />
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <JourneySection />
        <SkillsSection />
        <AIToolsSection />
        <ProjectsSection />
        <EducationSection />
        <GoalsSection />
        <ContactSection />
      </main>
      <Footer onOpenAnalytics={() => setAnalyticsOpen(true)} />
      <BackToTopButton />
      <OwnerAnalyticsModal open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />
    </div>
  );
}
