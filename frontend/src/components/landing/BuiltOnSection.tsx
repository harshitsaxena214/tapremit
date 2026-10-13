'use client';

import React from 'react';
import Reveal from './Reveal';
import { Cpu, ShieldCheck, KeyRound, Database } from 'lucide-react';

export default function BuiltOnSection() {
  const buildingBlocks = [
    {
      tag: 'CHAIN & SETTLEMENT',
      title: 'Monad Testnet',
      desc: 'High-throughput EVM execution on Chain ID 10143 with native MON and testnet AUSD. Runs live on testnet or in mock mode.',
      icon: <Cpu className="w-4 h-4 text-[var(--amber)]" />,
    },
    {
      tag: 'SAFETY GUARDRAILS',
      title: 'Deterministic Policy Engine',
      desc: 'Hardcoded per-transaction caps, rolling 24-hour daily limits, and first-time recipient verification enforced by backend code.',
      icon: <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />,
    },
    {
      tag: 'NATURAL LANGUAGE',
      title: 'AI Proposal Adapter',
      desc: 'Parses human prompts into structured payment intents with canonical parameters. Swappable between deterministic mock and real LLM.',
      icon: <Database className="w-4 h-4 text-[#7DD3FC]" />,
    },
    {
      tag: 'BIOMETRIC SIGNING',
      title: 'WebAuthn Passkeys',
      desc: 'Cryptographic authorization without seed phrases or exposed private keys. Demo account switcher included for instant testing.',
      icon: <KeyRound className="w-4 h-4 text-[#FFC933]" />,
    },
  ];

  const wordmarks = [
    { name: 'Monad Testnet', note: 'Chain 10143' },
    { name: 'Viem & Node 20', note: 'TypeScript EVM' },
    { name: 'Deterministic Policy', note: 'Strict Guardrails' },
    { name: 'Passkey WebAuthn', note: 'Hardware-Backed' },
    { name: 'Better-SQLite3', note: 'Append-Only Trail' },
  ];

  return (
    <section
      id="architecture"
      aria-labelledby="built-on-heading"
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
        {/* Top: 2-column layout (5/12 left, 7/12 right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left Column: Headline and overview in 5/12 */}
          <div className="md:col-span-5 space-y-4">
            <Reveal>
              <span className="font-mono text-[12px] tracking-[0.12em] text-[var(--amber)] uppercase block">
                02 / Architecture
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2
                id="built-on-heading"
                className="text-[clamp(2rem,3.8vw,3.5rem)] font-[500] tracking-[-0.035em] leading-[1.08] text-[var(--ink)]"
              >
                Built on verifiable building blocks.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-[15px] text-[var(--ink-muted)] leading-[1.65] max-w-[34rem]">
                Every external system sits behind a swappable adapter with a real testnet
                implementation and a self-contained mock mode. The whole pipeline runs
                consistently from laptop to production.
              </p>
            </Reveal>
          </div>

          {/* Right Column: 2x2 grid in 7/12 with seamless 1px borders & 20px radius */}
          <div className="md:col-span-7">
            <Reveal delay={120}>
              <div className="border border-[var(--line)] rounded-[20px] overflow-hidden bg-[var(--line)] grid grid-cols-1 sm:grid-cols-2 gap-[1px]">
                {buildingBlocks.map((block) => (
                  <div
                    key={block.title}
                    className="bg-[#0F0F10] p-6 sm:p-7 space-y-2.5 transition-all duration-200 [@media(hover:hover)]:hover:bg-[var(--surface-2)] [@media(hover:hover)]:hover:-translate-y-[2px] motion-reduce:hover:translate-y-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--ink-faint)] uppercase">
                        {block.tag}
                      </span>
                      {block.icon}
                    </div>
                    <h3 className="text-[16px] font-[500] text-[var(--ink)]">
                      {block.title}
                    </h3>
                    <p className="text-[13px] text-[var(--ink-muted)] leading-[1.55]">
                      {block.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom: Centered wordmark row */}
        <Reveal delay={200}>
          <div className="pt-8 border-t border-[var(--line)] flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {wordmarks.map((w) => (
              <div
                key={w.name}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-[var(--surface)] border border-[var(--line)] hover:border-white/20 transition-colors"
              >
                <span className="text-[13px] font-[500] text-[var(--ink)]">{w.name}</span>
                <span className="text-[11px] font-mono text-[var(--ink-faint)] border-l border-[var(--line)] pl-2">
                  {w.note}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
