'use client';

import React from 'react';
import { RuleOutcome } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface PolicyEvaluationCardProps {
  decision: 'ALLOW' | 'REQUIRE_APPROVAL' | 'DENY';
  reasons: RuleOutcome[];
}

export default function PolicyEvaluationCard({ decision, reasons }: PolicyEvaluationCardProps) {
  const getDecisionBadge = () => {
    switch (decision) {
      case 'REQUIRE_APPROVAL':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: 'Requires Human Approval',
          variant: 'warning' as const,
          desc: 'Agent has zero spending authority. Policy mandates explicit human confirmation before funds can move.',
        };
      case 'ALLOW':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Policy Checks Passed',
          variant: 'success' as const,
          desc: 'Instruction complies with all safety policies, within bounds.',
        };
      case 'DENY':
      default:
        return {
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: 'Policy Denied',
          variant: 'danger' as const,
          desc: 'One or more safety rules were violated. This proposal cannot be executed.',
        };
    }
  };

  const badge = getDecisionBadge();

  return (
    <div className="rounded-[16px] bg-[var(--surface)] border border-[var(--line)] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--amber)]" />
          <h3 className="font-[500] text-[var(--ink)] text-[15px]">Deterministic Policy Evaluation</h3>
        </div>
        <Badge variant={badge.variant}>
          <span className="inline-flex items-center gap-1.5">
            {badge.icon}
            {badge.label}
          </span>
        </Badge>
      </div>

      <p className="text-[13px] text-[var(--ink-muted)] leading-[1.5]">{badge.desc}</p>

      {/* Rules breakdown table */}
      <div className="space-y-2 pt-3 border-t border-[var(--line)]">
        <span className="text-[11px] font-[600] text-[var(--ink-faint)] uppercase tracking-[0.12em] block">
          Individual Safety Rules ({reasons.length}):
        </span>

        <div className="grid gap-2">
          {reasons.map((rule, idx) => {
            const isDeny = rule.decision === 'DENY';
            const isRequire = rule.decision === 'REQUIRE_APPROVAL';
            const variant = isDeny ? 'danger' : isRequire ? 'warning' : 'success';

            return (
              <div
                key={idx}
                className="p-3 rounded-[12px] bg-[var(--surface-2)] border border-[var(--line)] text-[13px] flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-[var(--ink)] text-[12px]">{rule.rule}</span>
                  </div>
                  <p className="text-[12px] text-[var(--ink-muted)] leading-[1.4]">{rule.reason}</p>
                </div>

                <Badge variant={variant} className="shrink-0 text-[11px]">
                  {rule.decision}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
