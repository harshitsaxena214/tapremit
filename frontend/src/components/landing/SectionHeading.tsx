import React from 'react';

interface SectionHeadingProps {
  overline: string;
  heading: string;
  id?: string;
  className?: string;
}

export default function SectionHeading({
  overline,
  heading,
  id,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`space-y-3 mb-12 sm:mb-16 ${className}`}>
      <p className="text-[12px] font-[500] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
        {overline}
      </p>
      <h2
        id={id}
        className="text-[var(--ink)] font-[500] tracking-[-0.04em] leading-[1.05] text-[clamp(2rem,4.2vw,3.75rem)]"
      >
        {heading}
      </h2>
    </div>
  );
}
