import React from 'react';
import LandingNav from './LandingNav';
import HeroBackground from './HeroBackground';
import LaunchButton from './LaunchButton';
import { LANDING_CONTENT } from './content';

export default function Hero() {
  const { pill, h1, subtext, actions } = LANDING_CONTENT;

  return (
    <section
      aria-label="Hero"
      className="relative w-full h-[100dvh] min-h-[640px] flex flex-col justify-end overflow-hidden"
      style={{
        paddingTop: 'calc(var(--gutter) + clamp(72px, 6vw, 92px) + 32px)',
      }}
    >
      {/* 1. Full-bleed Hero image & overlays touching all viewport edges */}
      <HeroBackground />

      {/* 2. Absolute Nav placed below top guide line */}
      <LandingNav />

      {/* 3. Hero content block anchored to bottom */}
      <div
        className="relative z-30 w-full flex flex-col justify-end"
        style={{
          paddingLeft: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
          paddingRight: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
          paddingBottom: 'calc(var(--gutter) + clamp(48px, 9vh, 110px))',
        }}
      >
        <div className="w-full max-w-[1400px]">
          {/* Monad Testnet Demo Pill (22px above H1) */}
          <div className="anim-pill mb-[22px]">
            <div className="inline-flex items-center gap-2 px-[14px] py-[7px] rounded-full border border-white/[0.14] bg-white/[0.04] backdrop-blur-[6px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--amber)] shrink-0" />
              <span className="text-[12px] font-[500] tracking-[0.02em] text-[var(--ink)] select-none">
                {pill}
              </span>
            </div>
          </div>

          {/* H1 Headline: two lines on desktop, wraps under 1024px */}
          <h1 className="text-[var(--ink)] font-[500] tracking-[-0.045em] leading-[0.97] text-[clamp(2.25rem,9vw,3.5rem)] lg:text-[clamp(2.6rem,4.9vw,5.75rem)] text-left">
            <span className="anim-h1-1 lg:block">{h1.line1}</span>
            <span className="anim-h1-2 lg:block lg:mt-[clamp(6px,0.8vw,14px)]">{h1.line2}</span>
          </h1>

          {/* Subtext: clamp(18px, 1.6vw, 28px) under H1, ~20px text, max 44rem */}
          <p className="anim-subtext mt-[clamp(18px,1.6vw,28px)] max-w-[44rem] text-[clamp(1rem,1.1vw,1.25rem)] font-[400] leading-[1.6] text-[var(--ink-muted)] [text-wrap:pretty]">
            {subtext}
          </p>

          {/* Action Buttons: clamp(28px, 2.6vw, 44px) under subtext */}
          <div className="anim-actions mt-[clamp(28px,2.6vw,44px)] flex flex-wrap items-center gap-[28px]">
            <LaunchButton size="lg" label={actions.primary} />

            <a
              href="#how"
              className="group inline-flex items-center gap-2 text-[17px] font-[500] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors focus:outline-none focus-visible:outline-1 focus-visible:outline-[#FFC933] rounded px-1 py-1"
            >
              <span>{actions.secondary.replace(' →', '')}</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
