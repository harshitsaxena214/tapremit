'use client';

import React from 'react';
import Reveal from './Reveal';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Propose',
      desc: 'Type a natural-language instruction. The agent extracts amount, asset and counterparty.',
    },
    {
      num: '02',
      title: 'Policy Check',
      desc: 'The deterministic engine verifies per-tx limits, rolling 24h caps and contact safety.',
    },
    {
      num: '03',
      title: 'Review Hash',
      desc: 'Inspect the canonical SHA-256 hash. If any parameter was altered, the hash mismatches.',
    },
    {
      num: '04',
      title: 'Approve',
      desc: 'You explicitly authorize the payment. The AI agent holds zero autonomous signing power.',
    },
    {
      num: '05',
      title: 'Settle & Receipt',
      desc: 'Executed on Monad testnet with an explorer link and an append-only audit trail.',
    },
  ];

  return (
    <section
      id="how"
      aria-labelledby="how-heading"
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
        className="w-full max-w-[1680px] mx-auto space-y-12 px-5 md:px-0"
        style={{
          paddingLeft: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
          paddingRight: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
        }}
      >
        {/* Two-Column Section Header (Headline Left, Intro Right aligned to bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end">
          <div className="md:col-span-7 space-y-3">
            <Reveal>
              <span className="font-mono text-[12px] tracking-[0.12em] text-[var(--amber)] uppercase block">
                03 / Protocol Flow
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2
                id="how-heading"
                className="text-[clamp(2rem,3.8vw,3.5rem)] font-[500] tracking-[-0.035em] leading-[1.08] text-[var(--ink)]"
              >
                From plain English to cryptographic settlement.
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-5 pb-1">
            <Reveal delay={160}>
              <p className="text-[15px] text-[var(--ink-muted)] leading-[1.65]">
                Five transparent steps. Zero autonomous spending authority. Every action is verified
                before on-chain broadcast.
              </p>
            </Reveal>
          </div>
        </div>

        {/* 5-step grid with 20px radius, 1px lines, and no leftover highlight */}
        <div className="border border-[var(--line)] rounded-[20px] overflow-hidden bg-[var(--line)] grid grid-cols-1 md:grid-cols-5 gap-[1px]">
          {steps.map((step, idx) => (
            <Reveal key={step.num} delay={idx * 90}>
              <div className="group h-full bg-[#0F0F10] p-6 sm:p-7 space-y-3 transition-colors duration-250 ease-[var(--e-soft)] hover:bg-[var(--surface-2)] flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono text-[16px] font-[600] text-[var(--amber)] group-hover:text-[var(--amber-2)] transition-colors duration-250 ease-[var(--e-soft)] block">
                    {step.num}
                  </span>
                  <h3 className="text-[16px] font-[500] text-[var(--ink)]">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[var(--ink-muted)] leading-[1.55]">
                    {step.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
