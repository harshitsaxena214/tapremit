import React from 'react';

export interface StatRowProps {
  label: string;
  value: React.ReactNode;
  helper?: string;
  progress?: {
    used: number;
    limit: number;
    percent?: number;
  };
  tabular?: boolean;
  className?: string;
}

export default function StatRow({
  label,
  value,
  helper,
  progress,
  tabular = false,
  className = '',
}: StatRowProps) {
  const percentage = progress
    ? progress.percent ?? Math.min(100, Math.round((progress.used / Math.max(0.0001, progress.limit)) * 100))
    : null;

  return (
    <div className={`space-y-1.5 py-2.5 ${className}`}>
      <div className="flex items-center justify-between text-[14px]">
        <span className="text-[var(--ink-muted)] font-[400]">{label}</span>
        <span className={`text-[var(--ink)] font-[500] ${tabular ? 'tabular-nums' : ''}`}>
          {value}
        </span>
      </div>

      {percentage !== null && (
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#F5B301] to-[#FFC933] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {helper && <p className="text-[12px] text-[var(--ink-faint)]">{helper}</p>}
    </div>
  );
}
