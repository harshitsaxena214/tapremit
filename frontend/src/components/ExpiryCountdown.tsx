'use client';

import React, { useEffect, useState } from 'react';
import { Timer, AlertOctagon } from 'lucide-react';

interface ExpiryCountdownProps {
  expiresAt: string;
  onExpire?: () => void;
}

export default function ExpiryCountdown({ expiresAt, onExpire }: ExpiryCountdownProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const isExpired = secondsRemaining <= 0;
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (isExpired) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#F87171]/10 border border-[#F87171]/30 text-[#FCA5A5] text-[12px] font-[500]">
        <AlertOctagon className="w-3.5 h-3.5 text-[#F87171]" />
        <span>Proposal Expired (TTL Exceeded)</span>
      </div>
    );
  }

  const isWarning = secondsRemaining < 120;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] border text-[12px] font-[500] transition-colors ${
        isWarning
          ? 'bg-[#F5B301]/10 border-[#F5B301]/40 text-[#FFC933] animate-pulse motion-reduce:animate-none'
          : 'bg-[var(--surface-2)] border-[var(--line)] text-[var(--ink-muted)]'
      }`}
    >
      <Timer className={`w-3.5 h-3.5 ${isWarning ? 'text-[var(--amber)]' : 'text-[var(--ink-faint)]'}`} />
      <span>
        Expires in: <strong className="font-mono tabular-nums text-[var(--ink)] text-[13px]">{formattedTime}</strong>
      </span>
    </div>
  );
}
