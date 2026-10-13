import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`py-12 px-6 flex flex-col items-center justify-center text-center space-y-3.5 rounded-[16px] border border-dashed border-[var(--line)] bg-white/[0.01] ${className}`}
    >
      {icon && <div className="text-[var(--ink-faint)]">{icon}</div>}
      <h4 className="text-[16px] font-[500] text-[var(--ink)]">{title}</h4>
      {description && (
        <p className="text-[14px] leading-[1.6] text-[var(--ink-muted)] max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
