import React from 'react';

interface LandingShellProps {
  hero: React.ReactNode;
  children: React.ReactNode;
}

export default function LandingShell({ hero, children }: LandingShellProps) {
  return (
    <div className="relative w-full min-h-screen bg-[var(--bg)] text-[var(--ink)] overflow-x-hidden selection:bg-[var(--amber)]/20 selection:text-white">
      {/* ========================================================
          FRAME GUIDE LINES DRAWN OVER THE IMAGE
          - Spans full width / full page height
          - Crosshair intersection at the 4 corners
          - z-20 (above photo/overlays, below hero content and buttons)
         ======================================================== */}
      {/* 1. Left Vertical Line (Full page height) */}
      <div
        aria-hidden="true"
        className="hidden md:block anim-line-v landing-guide-line-v absolute top-0 bottom-0 left-[var(--gutter)] w-[1px] z-20 pointer-events-none"
      />

      {/* 2. Right Vertical Line (Full page height) */}
      <div
        aria-hidden="true"
        className="hidden md:block anim-line-v landing-guide-line-v absolute top-0 bottom-0 right-[var(--gutter)] w-[1px] z-20 pointer-events-none"
      />

      {/* 3. Hero Top Horizontal Line (Full viewport width) */}
      <div
        aria-hidden="true"
        className="hidden md:block anim-line-h landing-guide-line-h absolute top-[var(--gutter)] left-0 right-0 h-[1px] z-20 pointer-events-none"
      />

      {/* 4. Hero Bottom Horizontal Line (Full viewport width) */}
      <div
        aria-hidden="true"
        className="hidden md:block anim-line-h landing-guide-line-h absolute top-[calc(100dvh-var(--gutter))] left-0 right-0 h-[1px] z-20 pointer-events-none"
      />

      {/* ========================================================
          FULL-BLEED HERO (Touches all 4 edges of viewport, no margins)
         ======================================================== */}
      <div className="relative w-full z-10">{hero}</div>

      {/* ========================================================
          SECTIONS BELOW HERO (Flat --bg background, lines continue)
         ======================================================== */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
