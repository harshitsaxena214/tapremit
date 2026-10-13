import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';
import { LANDING_CONTENT } from './content';

export default function TestnetNotice() {
  const { testnet } = LANDING_CONTENT;

  return (
    <section
      id="testnet"
      aria-labelledby="testnet-heading"
      className="scroll-mt-[100px] w-full border-t border-[var(--line)] py-[clamp(80px,10vw,140px)] px-[clamp(20px,4vw,50px)]"
    >
      <div className="max-w-[1100px] mx-auto">
        <Reveal>
          <div className="p-8 sm:p-10 rounded-[20px] bg-white/[0.02] border border-white/[0.12] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[12px] font-mono text-[var(--amber)] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[var(--amber)] shrink-0" />
                {testnet.badge}
              </div>
              <h3
                id="testnet-heading"
                className="text-[22px] font-[500] text-[var(--ink)] tracking-tight"
              >
                {testnet.title}
              </h3>
              <p className="text-[17px] leading-[1.65] text-[var(--ink-muted)]">
                {testnet.description}
              </p>
            </div>

            <Link
              href="/app"
              className="shrink-0 h-[48px] px-6 rounded-[12px] bg-white/[0.04] border border-white/[0.16] hover:border-white/[0.32] text-white text-[15px] font-[500] flex items-center justify-center transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-[#FFC933]"
            >
              {testnet.button}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
