import React from 'react';

export type BadgeVariant = 'default' | 'amber' | 'success' | 'danger' | 'info' | 'warning';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export default function Badge({
  variant = 'default',
  dot = true,
  className = '',
  children,
  ...rest
}: BadgeProps) {
  let colorClasses = 'bg-[var(--surface-2)] text-[var(--ink)] border-[var(--line)]';
  let dotColor = 'bg-[var(--ink-faint)]';

  if (variant === 'amber' || variant === 'warning') {
    colorClasses = 'bg-[#F5B301]/10 text-[#FFC933] border-[#F5B301]/30';
    dotColor = 'bg-[#F5B301]';
  } else if (variant === 'success') {
    colorClasses = 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30';
    dotColor = 'bg-[#4ADE80]';
  } else if (variant === 'danger') {
    colorClasses = 'bg-[#F87171]/10 text-[#FCA5A5] border-[#F87171]/30';
    dotColor = 'bg-[#F87171]';
  } else if (variant === 'info') {
    colorClasses = 'bg-[#7DD3FC]/10 text-[#7DD3FC] border-[#7DD3FC]/30';
    dotColor = 'bg-[#7DD3FC]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-[500] border ${colorClasses} ${className}`}
      {...rest}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
}
