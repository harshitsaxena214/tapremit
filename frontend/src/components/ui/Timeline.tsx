import React from 'react';

export interface TimelineItem {
  id?: string;
  timestamp: string;
  title: string;
  detail?: string;
  isLatest?: boolean;
  actor?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function Timeline({ items, className = '' }: TimelineProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`relative pl-6 space-y-6 ${className}`}>
      {/* 1px --line vertical rail */}
      <div
        className="absolute left-[4.5px] top-2 bottom-2 w-[1px] bg-[var(--line)] pointer-events-none"
        aria-hidden="true"
      />

      {items.map((item, idx) => {
        const isLatest = item.isLatest ?? idx === 0;

        return (
          <div key={item.id || idx} className="relative group">
            {/* 10px dot indicator */}
            <span
              className={`absolute -left-[24px] top-1.5 w-[10px] h-[10px] rounded-full border-2 transition-transform duration-200 ${
                isLatest
                  ? 'bg-[var(--amber)] border-[#FFC933] shadow-[0_0_8px_rgba(245,179,1,0.5)] scale-110'
                  : 'bg-[#18181B] border-[var(--ink-faint)]'
              }`}
              aria-hidden="true"
            />

            <div className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span
                  className={`text-[15px] font-[500] tracking-tight ${
                    isLatest ? 'text-white' : 'text-[var(--ink)]'
                  }`}
                >
                  {item.title}
                </span>
                <span className="text-[12px] tabular-nums text-[var(--ink-faint)]">
                  {item.timestamp}
                </span>
              </div>

              {item.detail && (
                <p className="text-[14px] leading-[1.5] text-[var(--ink-muted)]">
                  {item.detail}
                </p>
              )}

              {item.actor && (
                <span className="inline-block text-[11px] font-mono text-[var(--ink-faint)] bg-white/[0.04] px-1.5 py-0.5 rounded">
                  actor: {item.actor}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
