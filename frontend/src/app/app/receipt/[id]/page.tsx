'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { Proposal, TimelineEvent, User } from '@/lib/types';
import AuditTimeline from '@/components/AuditTimeline';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StatRow from '@/components/ui/StatRow';
import Skeleton from '@/components/ui/Skeleton';
import {
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Cpu,
  Clock,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

export default function ReceiptTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.push('/app');
      return;
    }
    setUser(stored);

    if (proposalId) {
      loadReceiptAndTimeline(proposalId);
    }
  }, [proposalId, router]);

  // Poll every 2.5 seconds until proposal reaches terminal state
  useEffect(() => {
    if (!proposal || proposal.status !== 'submitted') return;
    const interval = setInterval(async () => {
      try {
        const data = await api.getTimeline(proposal.id);
        setProposal(data.proposal);
        setTimeline(data.timeline);
      } catch {
        // Retry next tick
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [proposal?.id, proposal?.status]);

  const loadReceiptAndTimeline = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTimeline(id);
      setProposal(data.proposal);
      setTimeline(data.timeline);
    } catch (err: any) {
      setError(err.message || 'Failed to load receipt and timeline.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full text-center space-y-4">
            <p className="text-[14px] text-[#FCA5A5]">{error || 'Receipt not found.'}</p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => router.push('/app/dashboard')}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const isSimulated =
    proposal.status === 'simulated_confirmed' ||
    Boolean(proposal.execution_tx_hash?.startsWith('sim_'));

  const shortTxHash = proposal.execution_tx_hash
    ? `${proposal.execution_tx_hash.slice(0, 10)}...${proposal.execution_tx_hash.slice(-8)}`
    : null;

  // Exact API timing value if present (honesty rule: never hardcode)
  const apiTiming =
    (proposal as any).execution_latency_ms ??
    (proposal as any).metadata?.execution_time_ms ??
    null;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 anim-app-fade">
        {/* Page Header with Success State Header */}
        <PageHeader
          title="Settlement Receipt"
          subtitle="Approved by Human · Settled by Payment Executor"
          backAction={
            <Button
              as="a"
              href="/app/dashboard"
              variant="ghost"
              size="sm"
              className="!px-0 hover:bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Dashboard
            </Button>
          }
          actions={
            <div className="flex items-center gap-3">
              {/* 48px circle with success tint */}
              <div className="w-12 h-12 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/30 flex items-center justify-center text-[#4ADE80] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[12px] text-[var(--ink-faint)] font-mono">
                ID: {proposal.id.slice(0, 8)}...
              </span>
            </div>
          }
        />

        {/* Execution Status Badge Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[16px] bg-[var(--surface-2)] border border-[var(--line)]">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-[500] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              Execution State:
            </span>
          </div>

          <div>
            {isSimulated ? (
              <Badge variant="amber">
                <Cpu className="w-3.5 h-3.5 mr-1 text-[var(--amber)]" />
                SIMULATED EXECUTION
              </Badge>
            ) : proposal.status === 'confirmed' ? (
              <Badge variant="success">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                MONAD FINALIZED
              </Badge>
            ) : proposal.status === 'failed' ? (
              <Badge variant="danger">FAILED ON-CHAIN</Badge>
            ) : proposal.execution_substate === 'included_pending_finality' ? (
              <Badge variant="info">
                <Clock className="w-3.5 h-3.5 mr-1" />
                INCLUDED (AWAITING FINALITY)
              </Badge>
            ) : proposal.execution_substate === 'broadcasted_unknown' ? (
              <Badge variant="warning">
                <Clock className="w-3.5 h-3.5 mr-1" />
                OUTCOME UNKNOWN, CHECKING
              </Badge>
            ) : proposal.execution_substate === 'not_found_needs_review' ? (
              <Badge variant="danger">NOT FOUND, NEEDS REVIEW</Badge>
            ) : (
              <Badge variant="info">
                <Clock className="w-3.5 h-3.5 mr-1" />
                SUBMITTED (BROADCAST ACCEPTED)
              </Badge>
            )}
          </div>
        </div>

        {/* Prominent Simulated disclaimer if mock mode */}
        {isSimulated && (
          <div className="p-4 rounded-[14px] bg-[#F5B301]/10 border border-[#F5B301]/30 text-[13px] text-[#FFC933] space-y-1">
            <div className="font-[600] flex items-center gap-1.5 text-[#FFD34D]">
              <span>⚠️ Simulated Prototype Notice</span>
            </div>
            <p className="text-[#FFC933]/90 text-[12px] leading-relaxed">
              This transaction was executed in <strong>Mock Mode</strong>. The receipt hash is labelled simulated (<code className="font-mono">{proposal.execution_tx_hash || 'sim_0x...'}</code>). No real tokens or private keys were touched on Monad testnet.
            </p>
          </div>
        )}

        {/* Receipt Card with StatRows */}
        <Card className="space-y-4">
          <div className="pb-3 border-b border-[var(--line)]">
            <h2 className="text-[16px] font-[500] text-[var(--ink)]">Transaction Breakdown</h2>
          </div>

          <div className="divide-y divide-[var(--line)]">
            <StatRow
              label="Amount"
              value={
                <span className="text-[18px] font-[600] text-[var(--ink)]">
                  {proposal.display_amount || proposal.amount}{' '}
                  <span className="text-[var(--amber)]">{proposal.asset}</span>
                </span>
              }
              tabular
            />

            <StatRow
              label="Recipient"
              value={<span className="font-[500] text-[var(--ink)]">@{proposal.recipient_handle}</span>}
            />

            <StatRow
              label="Asset"
              value={<span className="font-mono text-[var(--ink)]">{proposal.asset}</span>}
            />

            <StatRow
              label="Network"
              value={<span className="font-[500] text-[var(--ink-muted)]">{proposal.network}</span>}
            />

            <StatRow
              label="Status"
              value={
                <Badge variant={isSimulated ? 'amber' : proposal.status === 'confirmed' ? 'success' : 'default'}>
                  {proposal.status}
                </Badge>
              }
            />

            {proposal.execution_tx_hash && (
              <StatRow
                label="Transaction Hash"
                value={
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-[var(--ink-muted)] select-all">
                      {shortTxHash}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(proposal.execution_tx_hash!);
                        setCopiedHash(true);
                        setTimeout(() => setCopiedHash(false), 2000);
                      }}
                      title="Copy transaction hash"
                      className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[var(--ink-faint)] hover:text-white transition"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-[var(--success)]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                }
              />
            )}

            <StatRow
              label="Timestamp"
              value={
                <span className="text-[13px] text-[var(--ink-muted)] tabular-nums">
                  {new Date(proposal.updated_at || proposal.created_at).toLocaleString()}
                </span>
              }
              tabular
            />

            {apiTiming !== null && (
              <StatRow
                label="Measured Settlement Latency"
                value={<span className="text-[13px] text-[var(--ink-faint)] tabular-nums">{apiTiming} ms</span>}
                helper="Reported directly from API telemetry (laptop-to-RPC round trip)"
                tabular
              />
            )}
          </div>

          {/* Block explorer link if on-chain */}
          {!isSimulated && proposal.execution_tx_hash && (
            <div className="pt-3 border-t border-[var(--line)] flex justify-end">
              <Button
                as="a"
                href={`https://testnet.monadvision.com/tx/${proposal.execution_tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="sm"
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          )}
        </Card>

        {/* Audit Timeline Section */}
        <Card className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--amber)]" />
              <h2 className="text-[16px] font-[500] text-[var(--ink)]">
                Full Audit Timeline &amp; Provenance
              </h2>
            </div>
            <span className="text-[12px] text-[var(--ink-faint)] font-mono tabular-nums">
              {timeline.length} logged events
            </span>
          </div>

          <AuditTimeline timeline={timeline} proposalHash={proposal.proposal_hash} />
        </Card>

        {/* Quick action: Return to Dashboard */}
        <div className="flex justify-center pt-2">
          <Button
            as="a"
            href="/app/dashboard"
            variant="ghost"
            size="md"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
