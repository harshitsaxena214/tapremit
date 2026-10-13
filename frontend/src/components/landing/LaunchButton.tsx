import React from 'react';
import Link from 'next/link';

interface LaunchButtonProps {
  size?: 'md' | 'lg';
  href?: string;
  label?: string;
  className?: string;
}

export default function LaunchButton({
  size = 'md',
  href = '/app',
  label = 'Launch app',
  className = '',
}: LaunchButtonProps) {
  const isLg = size === 'lg';

  const btnHeight = isLg ? 'h-[60px]' : 'h-[52px]';
  const tileSize = isLg ? 'w-[46px] h-[46px]' : 'w-[40px] h-[40px]';
  const labelText = isLg ? 'text-[20px]' : 'text-[18px]';

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-[14px] ${btnHeight} bg-[rgba(8,8,10,0.92)] border border-white/[0.14] hover:border-white/[0.30] rounded-[12px] p-[6px] pr-[22px] text-white font-[500] transition-all duration-200 hover:-translate-y-[1px] focus:outline-none focus-visible:outline-2 focus-visible:outline-[#FFC933] focus-visible:outline-offset-[3px] ${className}`}
    >
      <div
        className={`${tileSize} rounded-[10px] bg-gradient-to-br from-[#FFC933] to-[#F5B301] flex items-center justify-center shrink-0 anim-amber-pulse group-hover:brightness-[1.06] transition-all duration-200`}
      >
        {/* 3x3 Dotted Grid Icon in #B07A00 */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="4" cy="4" r="1.5" fill="#B07A00" />
          <circle cx="9" cy="4" r="1.5" fill="#B07A00" />
          <circle cx="14" cy="4" r="1.5" fill="#B07A00" />
          <circle cx="4" cy="9" r="1.5" fill="#B07A00" />
          <circle cx="9" cy="9" r="1.5" fill="#B07A00" />
          <circle cx="14" cy="9" r="1.5" fill="#B07A00" />
          <circle cx="4" cy="14" r="1.5" fill="#B07A00" />
          <circle cx="9" cy="14" r="1.5" fill="#B07A00" />
          <circle cx="14" cy="14" r="1.5" fill="#B07A00" />
        </svg>
      </div>
      <span className={`${labelText} tracking-tight select-none`}>{label}</span>
    </Link>
  );
}
