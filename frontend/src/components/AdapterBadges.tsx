'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { SystemStatus } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import { ShieldCheck } from 'lucide-react';

export default function AdapterBadges() {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .getSystemStatus()
      .then((data) => {
        if (mounted) setStatus(data);
      })
      .catch(() => {
        // Fallback default mock values if backend not reachable yet
        if (mounted) {
          setStatus({
            adapters: { auth: 'mock', llm: 'mock', executor: 'mock', chain: 'mock' },
            limits: { perTxLimitAusd: 50, dailyLimitAusd: 200, proposalTtlSeconds: 900 },
            network: { name: 'Monad Testnet', chainId: 10143, asset: 'AUSD' },
          });
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const isMon =
    status?.activeAsset === 'MON' ||
    (!status?.activeAsset && status?.adapters?.executor !== 'mock');
  const asset = status?.activeAsset || (isMon ? 'MON' : 'AUSD');
  const perTx = isMon
    ? (status?.limits?.perTxLimitMon ?? 0.1)
    : (status?.limits?.perTxLimitAusd ?? 50);
  const daily = isMon
    ? (status?.limits?.dailyLimitMon ?? 1.0)
    : (status?.limits?.dailyLimitAusd ?? 200);
  const maxCap = isMon ? (status?.limits?.maxTestnetTransferMon ?? 0.2) : null;

  return (
    <div className="w-full bg-[#0F0F10]/90 backdrop-blur-md border-b border-[var(--line)] py-3 text-xs">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-[500] uppercase tracking-[0.12em] text-[var(--ink-faint)] text-[11px]">
            Active Adapters:
          </span>

          {/* LLM Adapter */}
          <Badge variant={status?.adapters.llm === 'mock' ? 'amber' : 'success'}>
            LLM: <strong className="font-[600] text-white ml-0.5">{status?.adapters.llm === 'mock' ? 'Mock (Deterministic)' : 'Real'}</strong>
          </Badge>

          {/* Executor Adapter */}
          <Badge variant={status?.adapters.executor === 'mock' ? 'amber' : 'success'}>
            Executor: <strong className="font-[600] text-white ml-0.5">{status?.adapters.executor === 'mock' ? 'Mock (Simulated)' : 'Testnet'}</strong>
          </Badge>

          {/* Auth Adapter */}
          <Badge variant={status?.adapters.auth === 'mock' ? 'amber' : 'success'}>
            Auth: <strong className="font-[600] text-white ml-0.5">{status?.adapters.auth === 'mock' ? 'Demo Auth' : 'WebAuthn Passkey'}</strong>
          </Badge>
        </div>

        {/* Network & Limits */}
        <div className="flex items-center gap-3 text-[var(--ink-muted)]">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5B301]" />
            <span>Policy Limits:</span>
            <span className="text-white font-[500] tabular-nums">max {perTx} {asset}/tx</span>
            <span>·</span>
            <span className="text-white font-[500] tabular-nums">{daily} {asset}/day</span>
            {maxCap !== null && (
              <>
                <span>·</span>
                <span className="text-[#FFC933] font-[500] tabular-nums">max cap {maxCap} {asset}</span>
              </>
            )}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-[var(--ink-muted)] border border-[var(--line)]">
            Monad Testnet (10143)
          </span>
        </div>
      </div>
    </div>
  );
}
