import React from 'react';
import Logo from './Logo';
import LaunchButton from './LaunchButton';
import MobileMenu from './MobileMenu';
import { LANDING_CONTENT } from './content';

export default function LandingNav() {
  const { nav } = LANDING_CONTENT;

  return (
    <header
      className="anim-nav absolute z-30 flex items-center justify-between select-none"
      style={{
        top: 'var(--gutter)',
        left: 'var(--gutter)',
        right: 'var(--gutter)',
        height: 'clamp(72px, 6vw, 92px)',
        paddingLeft: 'clamp(24px, 2.1vw, 40px)',
        paddingRight: 'clamp(24px, 2.1vw, 40px)',
      }}
    >
      {/* Brand logo */}
      <Logo />

      {/* Desktop links & Launch CTA */}
      <div className="flex items-center gap-[clamp(20px,2vw,36px)]">
        <nav
          aria-label="Main Navigation"
          className="hidden min-[900px]:flex items-center gap-[clamp(20px,2vw,36px)]"
        >
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-[500] tracking-[-0.01em] text-[rgba(237,237,239,0.62)] hover:text-[var(--ink)] transition-colors focus:outline-none focus-visible:outline-1 focus-visible:outline-[#FFC933] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop / Tablet CTA */}
        <div className="hidden min-[900px]:block">
          <LaunchButton size="md" label={nav.cta} />
        </div>

        {/* Mobile menu toggle */}
        <MobileMenu links={nav.links} ctaLabel={nav.cta} />
      </div>
    </header>
  );
}
