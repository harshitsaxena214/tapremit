'use client';

import React from 'react';
import Reveal from './Reveal';
import { ShieldAlert, Hash, FileCheck2, CheckCircle2 } from 'lucide-react';

export default function GuardrailsSection() {
  const cards = [
    {
      num: '01',
      tag: 'BUDGET LIMITS',
      title: 'Enforced by Code, Not Prompts',
      desc: 'Per-transaction caps and rolling 24-hour daily budgets are evaluated deterministically by backend logic before approval. Prompt injection or agent hallucination cannot bypass these rules.',
      checks: [
        'Hardcoded per-transaction limit (MON / AUSD)',
        'Rolling 24-hour daily spending cap',
        'Mandatory confirmation for new recipients',
      ],
      icon: <ShieldAlert className="w-5 h-5 text-[var(--amber)]" />,
    },
    {
      num: '02',
      tag: 'HUMAN APPROVAL',
      title: 'Cryptographic Hash Binding',
      desc: 'Every proposal generates an immutable SHA-256 hash binding amount, recipient handle, wallet and network. You approve the hash explicitly. If any parameter was mutated, execution fails.',
      checks: [
        'Zero autonomous agent spending power',
        '15-minute time-to-live proposal expiry',
        'Explicit passkey authorization required',
      ],
      icon: <Hash className="w-5 h-5 text-[#FFC933]" />,
    },
    {
      num: '03',
      tag: 'AUDIT PROVENANCE',
      title: 'Append-Only Audit Chain',
      desc: 'Every step from prompt to settlement is permanently stored in an append-only audit log. Real transactions link to Monad Vision explorer; simulated runs are clearly labelled.',
      checks: [
        'Full event provenance (Agent, Engine, User)',
        'Direct Monad block explorer verification',
        'Clear simulated badges in mock mode',
      ],
      icon: <FileCheck2 className="w-5 h-5 text-[#4ADE80]" />,
    },
  ];

  return (
    <section
      id="guardrails"
      aria-labelledby="guardrails-heading"
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
                04 / Guardrails
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2
                id="guardrails-heading"
                className="text-[clamp(2rem,3.8vw,3.5rem)] font-[500] tracking-[-0.035em] leading-[1.08] text-[var(--ink)]"
              >
                You stay in control of every single cent.
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-5 pb-1">
            <Reveal delay={160}>
              <p className="text-[15px] text-[var(--ink-muted)] leading-[1.65]">
                Three safety invariants guaranteed by backend logic, not agent discretion.
              </p>
            </Reveal>
          </div>
        </div>

        {/* 3 Guardrail Cards spanning full width with gap clamp(16px, 1.6vw, 24px) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,1.6vw,24px)]">
          {cards.map((c, idx) => (
            <Reveal key={c.num} delay={idx * 110}>
              <div className="h-full rounded-[20px] bg-[var(--surface-2)] border border-[var(--line)] p-6 sm:p-7 space-y-5 flex flex-col justify-between transition-all duration-200 [@media(hover:hover)]:hover:border-[var(--line-strong)] [@media(hover:hover)]:hover:-translate-y-[2px] motion-reduce:hover:translate-y-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] font-[600] text-[var(--amber)]">
                      {c.num} / {c.tag}
                    </span>
                    <div className="p-2 rounded-[10px] bg-white/[0.04] border border-[var(--line)]">
                      {c.icon}
                    </div>
                  </div>

                  <h3 className="text-[18px] font-[500] text-[var(--ink)] leading-[1.3]">
                    {c.title}
                  </h3>

                  <p className="text-[14px] text-[var(--ink-muted)] leading-[1.6]">
                    {c.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--line)] space-y-2">
                  {c.checks.map((chk) => (
                    <div key={chk} className="flex items-start gap-2 text-[12px] text-[var(--ink-muted)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80] shrink-0 mt-0.5" />
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
