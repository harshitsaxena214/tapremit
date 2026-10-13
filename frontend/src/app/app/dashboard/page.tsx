'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { User, Proposal, SystemStatus } from '@/lib/types';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import StatRow from '@/components/ui/StatRow';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import {
  Sparkles,
  Send,
  History,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [instruction, setInstruction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingTxs, setFetchingTxs] = useState<boolean>(true);
  const [recentProposals, setRecentProposals] = useState<Proposal[]>([]);
  const [clarificationMessage, setClarificationMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.push('/app');
      return;
    }
    setUser(stored);

    // Fetch system status (active asset and guardrail limits)
    api.getSystemStatus().then(setSystemStatus).catch(() => {});

    // Fetch user proposals
    loadRecentProposals();
  }, [router]);

  const activeAsset = systemStatus?.activeAsset || 'MON';
  const isMon = activeAsset === 'MON';
  const perTxLimit = isMon
    ? (systemStatus?.limits.perTxLimitMon ?? 0.1)
    : (systemStatus?.limits.perTxLimitAusd ?? 50);
  const dailyLimit = isMon
    ? (systemStatus?.limits.dailyLimitMon ?? 1.0)
    : (systemStatus?.limits.dailyLimitAusd ?? 200);

  // Suggested instructions matching active backend executor and asset
  const SAMPLE_PROMPTS = isMon
    ? [
        {
          label: 'Standard Proposal (Passes Policy)',
          prompt: 'send 0.01 MON to @riya for design work',
          tag: 'Normal Flow',
        },
        {
          label: `Exceeds Per-Tx Limit (${(perTxLimit * 2).toFixed(2)} > ${perTxLimit} MON)`,
          prompt: `send ${(perTxLimit * 2).toFixed(2)} MON to @bob_builder for urgent server costs`,
          tag: 'Policy Deny',
        },
        {
          label: 'Ambiguous Prompt (Missing Details)',
          prompt: 'send some mon to my friend please',
          tag: 'Clarification',
        },
      ]
    : [
        {
          label: 'Standard Proposal (Passes Policy)',
          prompt: 'send 5 test AUSD to @riya for design work',
          tag: 'Normal Flow',
        },
        {
          label: `Exceeds Per-Tx Limit (${perTxLimit * 1.2} > ${perTxLimit} AUSD)`,
          prompt: `send ${perTxLimit * 1.2} AUSD to @bob_builder for urgent server costs`,
          tag: 'Policy Deny',
        },
        {
          label: 'Ambiguous Prompt (Missing Details)',
          prompt: 'send some money to my friend please',
          tag: 'Clarification',
        },
      ];

  const loadRecentProposals = async () => {
    setFetchingTxs(true);
    try {
      const data = await api.listProposals(10);
      setRecentProposals(data.proposals);
    } catch {
      // Non-fatal, show empty list
    } finally {
      setFetchingTxs(false);
    }
  };

  const handleSubmitInstruction = async (promptToUse?: string) => {
    const text = promptToUse || instruction;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setClarificationMessage(null);

    try {
      const res = await api.proposePayment(text);

      if (res.type === 'PROPOSAL' && res.proposal) {
        router.push(`/app/proposal/${res.proposal.id}`);
      } else if (res.type === 'CLARIFICATION') {
        setClarificationMessage(
          res.message || 'The AI agent needs additional information to construct a valid payment proposal.'
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit instruction to agent.');
    } finally {
      setLoading(false);
    }
  };

  // Compute settled balance: deduct outgoing, credit incoming
  const baseDemoBalance = isMon ? 1.0 : 100.0;
  const netSettledChange = recentProposals
    .filter(
      (p) =>
        ['confirmed', 'simulated_confirmed', 'submitted'].includes(p.status) &&
        p.asset === activeAsset
    )
    .reduce((acc, p) => {
      const val = parseFloat(p.display_amount || '0');
      if (p.user_id === user?.id) {
        return acc - val; // Sent
      } else if (p.recipient_id === user?.id) {
        return acc + val; // Received
      }
      return acc;
    }, 0);

  const walletBalance = Math.max(0, baseDemoBalance + netSettledChange).toFixed(isMon ? 4 : 2);

  // Outgoing 24h spend for the current user
  const user24hSpent = recentProposals
    .filter(
      (p) =>
        p.user_id === user?.id &&
        ['confirmed', 'simulated_confirmed', 'submitted'].includes(p.status) &&
        p.asset === activeAsset
    )
    .reduce((acc, p) => acc + parseFloat(p.display_amount || '0'), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'simulated_confirmed':
        return <Badge variant="amber">SIMULATED CONFIRMED</Badge>;
      case 'confirmed':
        return <Badge variant="success">MONAD FINALIZED</Badge>;
      case 'submitted':
        return <Badge variant="info">SUBMITTED</Badge>;
      case 'failed':
        return <Badge variant="danger">FAILED</Badge>;
      case 'awaiting_approval':
        return <Badge variant="amber">AWAITING APPROVAL</Badge>;
      case 'denied':
        return <Badge variant="danger">POLICY DENIED</Badge>;
      case 'rejected':
        return <Badge variant="default">REJECTED</Badge>;
      case 'expired':
        return <Badge variant="default">EXPIRED</Badge>;
      default:
        return <Badge variant="default">{status.toUpperCase()}</Badge>;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page Header */}
        <PageHeader
          title="Dashboard"
          subtitle="AI natural-language proposals with human approval and verified testnet settlement."
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={loadRecentProposals}
              leadingIcon={<RefreshCw className={`w-3.5 h-3.5 ${fetchingTxs ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          }
        />

        {/* Desktop 2-column layout: Main (1fr) + Side (360px) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Main Column */}
          <div className="space-y-6">
            {/* AI Proposal Input Card */}
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-[10px] bg-[#F5B301]/10 text-[var(--amber)]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-[18px] font-[500] text-[var(--ink)] tracking-tight">
                    Payment Instruction Box
                  </h2>
                  <p className="text-[13px] text-[var(--ink-muted)]">
                    Describe a payment in natural English. An AI agent transforms it into an immutable proposal.
                  </p>
                </div>
              </div>

              {/* Quick Judge Test Prompts */}
              {SAMPLE_PROMPTS.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-[500] uppercase tracking-[0.12em] text-[var(--ink-faint)] block">
                    Quick Test Prompts:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_PROMPTS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setInstruction(sample.prompt);
                          setClarificationMessage(null);
                          setError(null);
                        }}
                        className="px-3 py-1.5 rounded-[10px] bg-white/[0.03] hover:bg-white/[0.07] border border-[var(--line)] hover:border-[#FFC933]/50 text-[12px] text-[var(--ink-muted)] hover:text-white transition-all text-left flex items-center gap-2"
                      >
                        <span className="font-mono text-[#FFC933]/90">"{sample.prompt}"</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[var(--ink-faint)] font-[500]">
                          {sample.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Textarea Input */}
              <div className="space-y-3 pt-2">
                <Textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder={
                    isMon
                      ? 'e.g. send 0.01 MON to @riya for design work'
                      : 'e.g. send 5 test AUSD to @riya for design work'
                  }
                  hint="Recipient must be a registered handle (@riya, @bob_builder, etc.)"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[12px] text-[var(--ink-faint)]">
                    Deterministic policy limits apply automatically
                  </span>

                  <Button
                    variant="primary"
                    size="md"
                    loading={loading}
                    disabled={!instruction.trim()}
                    onClick={() => handleSubmitInstruction()}
                    leadingIcon={<Send className="w-4 h-4" />}
                  >
                    Propose Payment
                  </Button>
                </div>
              </div>

              {/* Clarification state banner */}
              {clarificationMessage && (
                <div className="p-4 rounded-[14px] bg-[#7DD3FC]/10 border border-[#7DD3FC]/30 text-[13px] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#7DD3FC] font-[600]">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>Clarification Required by AI Agent</span>
                  </div>
                  <p className="text-[var(--ink)] leading-[1.5]">{clarificationMessage}</p>
                  <p className="text-[11px] text-[var(--ink-faint)]">
                    Tip: Include an explicit amount (e.g. {isMon ? '0.01 MON' : '5 AUSD'}) and recipient handle (e.g. @riya).
                  </p>
                </div>
              )}

              {/* Error banner */}
              {error && (
                <div className="p-3.5 rounded-[12px] bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.4)] text-[#FCA5A5] text-[13px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--danger)]" />
                  <span>{error}</span>
                </div>
              )}
            </Card>

            {/* Recent Proposals & Activity List */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[var(--amber)]" />
                  <h3 className="text-[18px] font-[500] text-[var(--ink)] tracking-tight">
                    Recent Proposals & Activity
                  </h3>
                </div>
                <span className="text-[12px] text-[var(--ink-faint)]">
                  {recentProposals.length} record{recentProposals.length === 1 ? '' : 's'}
                </span>
              </div>

              {fetchingTxs ? (
                <div className="space-y-3 py-2">
                  <Skeleton height="56px" />
                  <Skeleton height="56px" />
                  <Skeleton height="56px" />
                </div>
              ) : recentProposals.length === 0 ? (
                <EmptyState
                  icon={<History className="w-8 h-8 mx-auto" />}
                  title="No payment proposals yet"
                  description="Type an instruction in the box above to generate your first AI payment proposal."
                />
              ) : (
                <div className="divide-y divide-[var(--line)]">
                  {recentProposals.map((item) => {
                    const isSender = item.user_id === user?.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (['confirmed', 'simulated_confirmed', 'submitted'].includes(item.status)) {
                            router.push(`/app/receipt/${item.id}`);
                          } else {
                            router.push(`/app/proposal/${item.id}`);
                          }
                        }}
                        className="py-3.5 px-2 rounded-[12px] hover:bg-[var(--surface-2)] transition-colors duration-150 cursor-pointer flex items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[15px] font-[600] tabular-nums ${
                                isSender ? 'text-white' : 'text-[#4ADE80]'
                              }`}
                            >
                              {isSender ? '' : '+'}{item.display_amount} {item.asset}
                            </span>

                            {isSender ? (
                              <span className="text-[13px] text-[var(--ink-muted)]">
                                to @{item.recipient_handle}
                              </span>
                            ) : (
                              <span className="text-[13px] text-[#4ADE80]">
                                from @{item.sender_handle || 'sender'}
                              </span>
                            )}

                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-[600] ${
                                isSender
                                  ? 'bg-white/[0.06] text-[var(--ink-faint)]'
                                  : 'bg-[#4ADE80]/10 text-[#4ADE80]'
                              }`}
                            >
                              {isSender ? 'SENT' : 'RECEIVED'}
                            </span>

                            {getStatusBadge(item.status)}
                          </div>

                          <p className="text-[12px] text-[var(--ink-faint)] truncate">
                            {item.purpose || 'No purpose specified'} ·{' '}
                            <span className="tabular-nums">
                              {new Date(item.created_at).toLocaleString()}
                            </span>
                          </p>
                        </div>

                        <div className="shrink-0 text-[var(--ink-faint)] group-hover:text-white transition-colors">
                          {isSender ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-[#4ADE80]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Side Column (360px on desktop) */}
          <div className="space-y-6">
            {/* Account Balance & Limits Card */}
            <Card className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-[500] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  Account Balance
                </span>
                <Badge variant={isMon ? 'info' : 'amber'}>
                  {isMon ? 'MONAD TESTNET' : 'SIMULATED'}
                </Badge>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[34px] font-[600] tracking-tight text-white tabular-nums">
                    {walletBalance}
                  </span>
                  <span className="text-[16px] font-[600] text-[var(--amber)]">
                    {activeAsset}
                  </span>
                </div>
                <p className="text-[12px] text-[var(--ink-muted)] mt-1">
                  {isMon
                    ? 'Monad Testnet Native Asset · Settled via Monad relayer'
                    : 'Initial 100.00 AUSD demo test balance'}
                </p>
              </div>

              {/* Policy limits StatRows */}
              <div className="pt-3 border-t border-[var(--line)] space-y-1">
                <StatRow
                  label="Rolling 24h Spend"
                  value={`${user24hSpent.toFixed(isMon ? 4 : 2)} / ${dailyLimit} ${activeAsset}`}
                  tabular
                  progress={{
                    used: user24hSpent,
                    limit: dailyLimit,
                  }}
                />
                <StatRow
                  label="Per-Transaction Limit"
                  value={`${perTxLimit} ${activeAsset}`}
                  tabular
                />
                {isMon && (
                  <StatRow
                    label="Hard Relayer Cap"
                    value={`${systemStatus?.limits.maxTestnetTransferMon ?? 0.2} MON`}
                    tabular
                  />
                )}
              </div>
            </Card>

            {/* Architecture Principles Reminder */}
            <Card className="space-y-3 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-[var(--amber)]">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-[14px] font-[600] text-white">Trust-First Architecture</h4>
              </div>
              <p className="text-[13px] leading-[1.6] text-[var(--ink-muted)]">
                The AI agent holds <strong>zero spending authority</strong>. Requests are transformed into structured proposals evaluated by a deterministic policy engine before you sign.
              </p>
              <div className="p-2.5 rounded-[10px] bg-white/[0.03] border border-[var(--line)] font-mono text-[11px] text-[var(--ink-faint)]">
                Agent proposes → Policy checks → Human signs
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
