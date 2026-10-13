'use client';

import React from 'react';
import { TimelineEvent } from '@/lib/types';
import { Bot, User, ShieldAlert, Cpu, CheckCircle2, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface AuditTimelineProps {
  timeline: TimelineEvent[];
  proposalHash?: string;
}

export default function AuditTimeline({ timeline, proposalHash }: AuditTimelineProps) {
  const getActorIcon = (actor: string) => {
    switch (actor) {
      case 'agent':
        return <Bot className="w-3.5 h-3.5 text-[var(--amber)]" />;
      case 'policy_engine':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#7DD3FC]" />;
      case 'user':
        return <User className="w-3.5 h-3.5 text-[#4ADE80]" />;
      case 'system':
      default:
        return <Cpu className="w-3.5 h-3.5 text-[var(--ink-muted)]" />;
    }
  };

  const getActorLabel = (actor: string) => {
    switch (actor) {
      case 'agent':
        return 'AI Agent';
      case 'policy_engine':
        return 'Policy Engine';
      case 'user':
        return 'Human Approver';
      case 'system':
      default:
        return 'System / Settlement';
    }
  };

  return (
    <div className="space-y-5">
      {/* Integrity banner */}
      <div className="p-3.5 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-2 text-[12px]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
          <span className="text-[var(--ink)] font-[500]">Append-Only Cryptographic Audit Trail Verified</span>
        </div>
        {proposalHash && (
          <span
            className="text-[var(--ink-faint)] font-mono text-[11px] truncate max-w-[260px]"
            title={proposalHash}
          >
            Hash: {proposalHash.slice(0, 10)}...{proposalHash.slice(-8)}
          </span>
        )}
      </div>

      {/* Chronological event list with 1px rail and 10px dots */}
      <div className="relative pl-7 space-y-6 before:content-[''] before:absolute before:left-[4.5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--line)]">
        {timeline.map((event, idx) => {
          const isLatest = idx === timeline.length - 1;
          const isSettled = event.action.includes('confirmed') || event.action.includes('submitted');

          return (
            <div key={idx} className="relative group">
              {/* 10px dot indicator (amber for latest, muted for others) */}
              <span
                className={`absolute -left-[27px] top-1.5 w-[10px] h-[10px] rounded-full border-2 transition-transform duration-200 ${
                  isLatest
                    ? 'bg-[var(--amber)] border-[#FFC933] shadow-[0_0_8px_rgba(245,179,1,0.5)] scale-110'
                    : 'bg-[#18181B] border-[var(--ink-faint)]'
                }`}
                aria-hidden="true"
              />

              {/* Event card */}
              <div
                className={`p-4 rounded-[14px] border text-[13px] space-y-2 transition-colors duration-200 ${
                  isLatest
                    ? 'bg-[var(--surface-2)] border-[var(--line-strong)]'
                    : 'bg-[var(--surface)] border-[var(--line)]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-[6px] bg-white/[0.04] border border-[var(--line)]">
                      {getActorIcon(event.actor)}
                    </span>
                    <span className="text-[15px] font-[500] text-[var(--ink)]">
                      {getActorLabel(event.actor)}
                    </span>
                    <span className="px-2 py-0.5 rounded-[6px] font-mono text-[11px] bg-white/[0.04] text-[var(--ink-faint)]">
                      {event.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* SIMULATED label requirement */}
                    {event.isSimulated && (
                      <Badge variant="amber" className="text-[10px]">
                        SIMULATED
                      </Badge>
                    )}
                    <span className="text-[12px] text-[var(--ink-faint)] flex items-center gap-1 font-mono tabular-nums">
                      <Clock className="w-3 h-3" />
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <p className="text-[14px] text-[var(--ink-muted)] leading-[1.5]">
                  {event.humanDescription}
                </p>

                {event.isSimulated && isSettled && (
                  <div className="pt-2 border-t border-[var(--line)] text-[12px] text-[#FFC933] font-[500]">
                    ⚠️ Mock settlement: MockPaymentExecutor issued simulated receipt. No funds or on-chain assets moved.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
