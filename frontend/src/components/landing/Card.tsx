import React from 'react';

interface CardProps {
  number?: string;
  title: string;
  description: string;
  className?: string;
}

export default function Card({
  number,
  title,
  description,
  className = '',
}: CardProps) {
  return (
    <div
      className={`p-[28px] rounded-[20px] bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] transition-colors duration-200 space-y-4 ${className}`}
    >
      {number && (
        <span className="inline-block text-[14px] font-[500] font-mono text-[var(--amber)] tracking-wider">
          {number}
        </span>
      )}
      <h3 className="text-[20px] font-[500] text-[var(--ink)] tracking-tight">
        {title}
      </h3>
      <p className="text-[17px] leading-[1.65] text-[var(--ink-muted)]">
        {description}
      </p>
    </div>
  );
}
