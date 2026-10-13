import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/landing.css';
import LandingShell from '@/components/landing/LandingShell';
import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import BuiltOnSection from '@/components/landing/BuiltOnSection';
import HowItWorks from '@/components/landing/HowItWorks';
import GuardrailsSection from '@/components/landing/GuardrailsSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';
import { LANDING_CONTENT } from '@/components/landing/content';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });

export const metadata: Metadata = {
  title: 'TapRemit: say what to pay, approve every payment',
  description: LANDING_CONTENT.subtext,
  openGraph: {
    title: 'TapRemit: say what to pay, approve every payment',
    description: LANDING_CONTENT.subtext,
    images: [{ url: '/hero/hero.jpg', width: 2400, height: 1350, alt: 'TapRemit Hero' }],
  },
};

export default function LandingPage() {
  return (
    <div className={inter.className}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 rounded-lg bg-[var(--amber)] text-black font-semibold text-sm"
      >
        Skip to content
      </a>
      <LandingShell hero={<Hero />}>
        <main id="main-content">
          <ProblemSection />
          <BuiltOnSection />
          <HowItWorks />
          <GuardrailsSection />
          <CtaSection />
        </main>
        <Footer />
      </LandingShell>
    </div>
  );
}
