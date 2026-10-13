'use client';

import React from 'react';
import Reveal from './Reveal';
import LaunchButton from './LaunchButton';

export default function CtaSection() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative w-full border-t border-[var(--line)] py-[clamp(64px,7vw,112px)]"
    >
      {/* Guide line crosshair corner markers at horizontal border intersection (BORDER SYSTEM - UNTOUCHED) */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute -top-[7px] left-[calc(var(--gutter)-6px)] w-[13px] h-[13px] items-center justify-center text-white/30 text-[11px] font-mono pointer-events-none select-none z-20"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="hidden md:flex absolute -top-[7px] right-[calc(var(--gutter)-6px)] w-[13px] h-[13px] items-center justify-center text-white/30 text-[11px] font-mono pointer-events-none select-none z-20"
      >
        +
      </div>

      <div
        className="w-full max-w-[1680px] mx-auto text-center space-y-8 px-5 md:px-0"
        style={{
          paddingLeft: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
          paddingRight: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
        }}
      >
        <Reveal>
          <span className="font-mono text-[12px] tracking-[0.12em] text-[var(--amber)] uppercase block">
            05 / Get Started
          </span>
        </Reveal>

        <div className="space-y-4 max-w-[36rem] mx-auto">
          <Reveal delay={80}>
            <h2
              id="cta-heading"
              className="text-[clamp(2.2rem,5vw,3.6rem)] font-[500] tracking-[-0.035em] leading-[1.08] text-[var(--ink)]"
            >
              Try TapRemit on Monad testnet.
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-[16px] text-[var(--ink-muted)] leading-[1.6]">
              Prompt-based payments with strict human-in-the-loop safety. No mainnet tokens or
              seed phrases required.
            </p>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div className="pt-2 flex flex-col items-center gap-4">
            <LaunchButton size="lg" label="Launch Demo App" href="/app" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] text-[12px] text-[var(--ink-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--amber)] shrink-0 animate-pulse motion-reduce:animate-none" />
              <span>Monad Testnet Demo · Demo accounts with mock and live testnet modes</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
