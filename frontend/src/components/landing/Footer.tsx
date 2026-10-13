'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;

  return (
    <footer className="relative w-full border-t border-[var(--line)] py-[clamp(48px,5vw,80px)]">
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
        className="w-full max-w-[1680px] mx-auto space-y-6 px-5 md:px-0"
        style={{
          paddingLeft: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
          paddingRight: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[13px] text-[var(--ink-faint)] border-l border-[var(--line)] pl-3">
              Say what to pay, approve every payment
            </span>
          </div>

          <div className="flex items-center gap-6 text-[14px] text-[var(--ink-muted)]">
            <Link
              href="/app"
              className="hover:text-[var(--ink)] transition-colors focus:outline-none focus-visible:outline-1 focus-visible:outline-[#FFC933] rounded"
            >
              Demo App
            </Link>

            <a
              href="https://testnet.monadvision.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--ink)] transition-colors focus:outline-none focus-visible:outline-1 focus-visible:outline-[#FFC933] rounded"
            >
              Monad Explorer
            </a>

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--ink)] transition-colors focus:outline-none focus-visible:outline-1 focus-visible:outline-[#FFC933] rounded"
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[var(--ink-faint)]">
          <p>© {new Date().getFullYear()} TapRemit. Monad Metropolis Hackathon prototype.</p>
          <p>Testnet demonstration software. Do not transfer real mainnet assets.</p>
        </div>
      </div>
    </footer>
  );
}
