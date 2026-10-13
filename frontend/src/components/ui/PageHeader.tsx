import React from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backAction?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  backAction,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`space-y-3 pb-6 border-b border-[var(--line)] ${className}`}>
      {backAction && <div>{backAction}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-[500] tracking-[-0.035em] leading-[1.1] text-[var(--ink)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-[15px] leading-[1.6] text-[var(--ink-muted)]">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
