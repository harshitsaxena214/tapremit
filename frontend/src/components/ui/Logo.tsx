import React from 'react';
import Link from 'next/link';

export interface LogoProps {
  href?: string;
  className?: string;
  wordmarkSize?: string;
  tileSize?: string;
}

export default function Logo({
  href = '/',
  className = '',
  wordmarkSize = 'text-[26px]',
  tileSize = 'w-[36px] h-[36px]',
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="TapRemit Home"
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:outline-2 focus-visible:outline-[#FFC933] rounded-lg ${className}`}
    >
      <div
        className={`${tileSize} rounded-lg bg-[#0B0B0D] border border-white/[0.12] flex items-center justify-center shrink-0 shadow-md group-hover:border-white/[0.25] transition-colors`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="3" y="3.5" width="14" height="3" rx="0.75" fill="var(--amber)" />
          <rect x="8.5" y="6.5" width="3" height="10" rx="0.75" fill="var(--ink)" />
        </svg>
      </div>
      <span className={`${wordmarkSize} font-[600] tracking-[-0.035em] text-white`}>
        TapRemit
      </span>
    </Link>
  );
}
