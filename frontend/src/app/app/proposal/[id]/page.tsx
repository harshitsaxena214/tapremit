'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { Proposal, User } from '@/lib/types';
import PolicyEvaluationCard from '@/components/PolicyEvaluationCard';
import ExpiryCountdown from '@/components/ExpiryCountdown';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Bot,
  UserCheck,
  Hash,
  AlertTriangle,
  Lock,
  Ban,
  Clock,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export default function ProposalReviewPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [recipientName, setRecipientName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmNewRecipient, setConfirmNewRecipient] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.push('/app');
      return;
    }
    setUser(stored);

    if (proposalId) {
      loadProposal(proposalId);
    }
  }, [proposalId, router]);

  const loadProposal = async (id: string, preserveError: boolean = false) => {
    setLoading(true);
    if (!preserveError) {
      setError(null);
    }
    try {
      const data = await api.getProposal(id);
      setProposal(data);

      // Resolve recipient display name
      if (data.recipient_handle) {
        api
          .lookupUser(data.recipient_handle)
          .then((res) => setRecipientName(res.display_name))
          .catch(() => setRecipientName(data.recipient_handle));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load proposal details.');
    } finally {
      setLoading(false);
    }
  };

  const requiresFirstTimeConfirmation =
    proposal?.policy_reasons?.some(
      (r) => r.rule === 'KNOWN_CONTACT_POLICY' && r.decision === 'REQUIRE_APPROVAL'
    ) || false;

  const handleApprove = async () => {
    if (!proposal) return;
    setActionLoading(true);
    setError(null);

    if (requiresFirstTimeConfirmation && !confirmNewRecipient) {
      setError('Please check the confirmation box: "I confirm this is a first-time recipient" before approving.');
      setActionLoading(false);
      return;
    }

    try {
      await api.approveProposal(proposal.id, proposal.proposal_hash, confirmNewRecipient);
      router.push(`/app/receipt/${proposal.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to approve proposal.');
      loadProposal(proposal.id, true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!proposal) return;
    setActionLoading(true);
    setError(null);

    try {
      await api.rejectProposal(proposal.id, 'Explicit human rejection from dashboard review screen');
      loadProposal(proposal.id);
    } catch (err: any) {
      setError(err.message || 'Failed to reject proposal.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (error && !proposal) {
    return (
      <div className="flex-1 flex flex-col">
        <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F87171]/10 border border-[#F87171]/30 flex items-center justify-center mx-auto text-[#F87171]">
              <XCircle className="w-6 h-6" />
            </div>
            <h2 className="text-[20px] font-[500] tracking-[-0.02em] text-[var(--ink)]">
              Proposal Not Available
            </h2>
            <p className="text-[14px] text-[var(--ink-muted)]">{error}</p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => router.push('/app/dashboard')}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (!proposal) return null;

  const isAwaiting = proposal.status === 'awaiting_approval';
  const isSettled = ['confirmed', 'simulated_confirmed', 'submitted'].includes(proposal.status);
  const isDenied = proposal.status === 'denied';
  const isRejected = proposal.status === 'rejected';
  const isExpired = proposal.status === 'expired';

  // Stepper state calculation
  const getStepState = (stepIndex: number) => {
    // 0: Proposed, 1: Policy Check, 2: Human Approval, 3: Settled
    if (isSettled) {
      if (stepIndex <= 2) return 'completed';
      if (proposal.status === 'submitted') return 'current';
      return 'completed';
    }
    if (isAwaiting) {
      if (stepIndex < 2) return 'completed';
      if (stepIndex === 2) return 'current';
      return 'future';
    }
    if (isDenied) {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'blocked';
      return 'future';
    }
    if (isRejected || isExpired) {
      if (stepIndex <= 1) return 'completed';
      if (stepIndex === 2) return 'blocked';
      return 'future';
    }
    return 'future';
  };

  const steps = [
    { label: 'Proposed', hint: 'AI Agent' },
    { label: 'Policy Check', hint: 'Deterministic' },
    { label: 'Human Approval', hint: 'Cryptographic' },
    { label: 'Settled', hint: 'On-chain' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 anim-app-fade">
        {/* Page Header with Back Action & Expiry Countdown */}
        <PageHeader
          title="Proposal Review"
          subtitle="Inspect deterministic policy checks and cryptographically authorize transfer"
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
            isAwaiting ? (
              <ExpiryCountdown
                expiresAt={proposal.expires_at}
                onExpire={() => loadProposal(proposal.id)}
              />
            ) : (
              <Badge
                variant={
                  isSettled ? 'success' : isDenied || isRejected || isExpired ? 'danger' : 'amber'
                }
              >
                Status: <span className="uppercase font-mono ml-1">{proposal.status}</span>
              </Badge>
            )
          }
        />

        {/* Horizontal State Stepper */}
        <Card className="p-5 sm:p-6">
          <div className="relative">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((st, idx) => {
                const state = getStepState(idx);
                const isCompleted = state === 'completed';
                const isCurrent = state === 'current';
                const isBlocked = state === 'blocked';

                return (
                  <div key={st.label} className="flex flex-col items-center text-center relative group">
                    {/* Connecting line to next step */}
                    {idx < steps.length - 1 && (
                      <div
                        aria-hidden="true"
                        className={`absolute top-4 left-[50%] w-full h-[1px] pointer-events-none z-0 ${
                          isCompleted ? 'bg-[var(--amber)]' : 'bg-[var(--line)]'
                        }`}
                      />
                    )}

                    {/* Step circle indicator */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-[600] transition-all duration-200 ${
                        isCompleted
                          ? 'bg-[var(--amber)] text-[#1A1200] shadow-[0_0_10px_rgba(245,179,1,0.35)]'
                          : isCurrent
                          ? 'border-2 border-[#FFC933] bg-[#F5B301]/20 text-[#FFC933] shadow-[0_0_14px_rgba(245,179,1,0.4)] animate-pulse motion-reduce:animate-none'
                          : isBlocked
                          ? 'border border-[#F87171] bg-[#F87171]/20 text-[#F87171]'
                          : 'border border-[var(--line-strong)] bg-white/[0.04] text-[var(--ink-faint)]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : isBlocked ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Labels */}
                    <div className="mt-2.5 space-y-0.5">
                      <span
                        className={`block text-[12px] font-[500] uppercase tracking-[0.06em] ${
                          isCurrent
                            ? 'text-[var(--ink)] font-[600]'
                            : isCompleted
                            ? 'text-[var(--ink)]'
                            : 'text-[var(--ink-faint)]'
                        }`}
                      >
                        {st.label}
                      </span>
                      <span className="hidden sm:block text-[11px] text-[var(--ink-faint)]">
                        {st.hint}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Terminal State Banners */}
        {isDenied && (
          <div className="p-4 rounded-[14px] bg-[#F87171]/10 border border-[#F87171]/30 text-[#FCA5A5] text-[13px] space-y-1">
            <div className="flex items-center gap-2 font-[600] text-[#F87171]">
              <Ban className="w-4 h-4 shrink-0" />
              Proposal Denied by Deterministic Policy Engine
            </div>
            <p className="text-[var(--ink-muted)] text-[12px] leading-relaxed">
              This instruction violated safety limits (e.g. per-transaction or rolling 24-hour daily budget). It is permanently terminal and cannot be approved.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="p-4 rounded-[14px] bg-white/[0.04] border border-[var(--line)] text-[var(--ink-muted)] text-[13px] space-y-1">
            <div className="flex items-center gap-2 font-[600] text-[var(--ink)]">
              <XCircle className="w-4 h-4 shrink-0 text-[var(--ink-faint)]" />
              Proposal Rejected by User
            </div>
            <p className="text-[var(--ink-faint)] text-[12px]">
              You chose to reject this payment proposal. No funds were transferred.
            </p>
          </div>
        )}

        {isExpired && (
          <div className="p-4 rounded-[14px] bg-[#F87171]/10 border border-[#F87171]/30 text-[#FCA5A5] text-[13px] space-y-1">
            <div className="flex items-center gap-2 font-[600] text-[#FCA5A5]">
              <Clock className="w-4 h-4 shrink-0" />
              Proposal Expired (TTL Timeout)
            </div>
            <p className="text-[var(--ink-muted)] text-[12px]">
              This proposal was not approved within the validity window. Create a fresh proposal to try again.
            </p>
          </div>
        )}

        {isSettled && (
          <div className="p-4 rounded-[14px] bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] text-[13px] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-[#4ADE80]" />
              <span>This proposal was already approved and settled.</span>
            </div>
            <Button
              as="a"
              href={`/app/receipt/${proposal.id}`}
              variant="primary"
              size="sm"
            >
              View Receipt
            </Button>
          </div>
        )}

        {/* Error message if action failed */}
        {error && (
          <div className="p-3.5 rounded-[12px] bg-[#F87171]/10 border border-[#F87171]/30 text-[#FCA5A5] text-[13px] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#F87171]" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Proposal Review Card */}
        <Card className="space-y-6">
          {/* Header origin */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[var(--line)]">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-[10px] bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--amber)]">
                <Bot className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-[16px] font-[500] text-[var(--ink)]">Review Payment Proposal</h2>
                <p className="text-[12px] text-[var(--ink-faint)]">
                  Origin: <span className="text-[var(--amber)] font-[500]">Proposed by AI agent</span>
                </p>
              </div>
            </div>

            <Badge variant={isAwaiting ? 'warning' : isSettled ? 'success' : 'default'}>
              {proposal.status}
            </Badge>
          </div>

          {/* Amount & Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount (large 40px weight 500 tabular-nums) */}
            <div className="p-5 rounded-[16px] bg-[var(--surface-2)] border border-[var(--line)] space-y-1">
              <span className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--ink-faint)] block">
                Payment Amount
              </span>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-[40px] font-[500] tabular-nums tracking-[-0.035em] text-[var(--ink)] leading-none">
                  {proposal.display_amount}
                </span>
                <span className="text-[16px] font-[600] text-[var(--amber)]">
                  {proposal.asset}
                </span>
              </div>
              <p className="text-[12px] text-[var(--ink-faint)] pt-2">
                Network: <strong className="text-[var(--ink-muted)] font-[500]">{proposal.network}</strong>
              </p>
            </div>

            {/* Recipient */}
            <div className="p-5 rounded-[16px] bg-[var(--surface-2)] border border-[var(--line)] space-y-2">
              <span className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--ink-faint)] block">
                Resolved Recipient
              </span>
              <div className="flex items-start gap-2.5 pt-1">
                <UserCheck className="w-5 h-5 text-[var(--amber)] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-[16px] font-[600] text-[var(--ink)]">@{proposal.recipient_handle}</div>
                  <div className="text-[13px] text-[var(--ink-muted)]">{recipientName || 'Resolved User'}</div>
                  {proposal.recipient_wallet && (
                    <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-[var(--ink-muted)] bg-black/40 px-2.5 py-1 rounded-[8px] border border-[var(--line)] w-fit">
                      <span>{proposal.recipient_wallet.slice(0, 6)}...{proposal.recipient_wallet.slice(-4)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(proposal.recipient_wallet!);
                          setCopiedAddress(true);
                          setTimeout(() => setCopiedAddress(false), 2000);
                        }}
                        title="Copy recipient address"
                        className="text-[var(--ink-faint)] hover:text-white transition"
                      >
                        {copiedAddress ? <Check className="w-3 h-3 text-[var(--success)]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Explanation Text in Quote-Style Block */}
          {proposal.purpose && (
            <div className="pl-4 border-l-2 border-[var(--amber)] py-2 bg-white/[0.01] rounded-r-lg space-y-1">
              <div className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                AI Natural-Language Intent
              </div>
              <p className="text-[15px] italic text-[var(--ink-muted)] leading-[1.6]">
                &ldquo;{proposal.purpose}&rdquo;
              </p>
            </div>
          )}

          {/* Cryptographic Proposal Hash */}
          <div className="p-4 rounded-[14px] bg-[var(--surface-2)] border border-[var(--line)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--ink-faint)] flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[var(--amber)]" />
                Cryptographic Proposal Hash
              </span>
              <span className="text-[11px] text-[var(--ink-faint)] font-mono">SHA-256</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-mono text-[12px] text-[var(--ink)] break-all bg-black/40 p-2.5 rounded-[10px] border border-[var(--line)] select-all flex-1">
                {proposal.proposal_hash}
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(proposal.proposal_hash);
                  setCopiedHash(true);
                  setTimeout(() => setCopiedHash(false), 2000);
                }}
                title="Copy proposal hash"
                className="p-2 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-muted)] hover:text-white transition shrink-0"
              >
                {copiedHash ? <Check className="w-4 h-4 text-[var(--success)]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[12px] text-[var(--ink-faint)] leading-relaxed">
              <Lock className="w-3 h-3 inline mr-1 text-[var(--amber)]" />
              Approving sends this exact hash to the server. If any parameter (amount, recipient, network) was mutated after creation, the transaction is rejected instantly.
            </p>
          </div>

          {/* Deterministic Policy Evaluation Breakdown */}
          <PolicyEvaluationCard
            decision={proposal.policy_decision}
            reasons={proposal.policy_reasons || []}
          />

          {/* First-Time Recipient Confirmation Checkbox */}
          {requiresFirstTimeConfirmation && isAwaiting && (
            <div className="p-4 rounded-[14px] bg-[#F5B301]/10 border border-[#F5B301]/30 flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm_first_time"
                checked={confirmNewRecipient}
                onChange={(e) => {
                  setConfirmNewRecipient(e.target.checked);
                  if (e.target.checked) setError(null);
                }}
                className="mt-1 h-4 w-4 rounded border-[#F5B301] bg-black text-[#F5B301] focus:ring-2 focus:ring-[#FFC933] cursor-pointer"
              />
              <label
                htmlFor="confirm_first_time"
                className="text-[13px] text-[#FFC933] cursor-pointer select-none leading-relaxed"
              >
                <span className="font-[600] text-[#FFD34D] block mb-0.5">
                  I confirm this is a first-time recipient
                </span>
                You have not transferred funds to this recipient before. Please verify the recipient handle and wallet address before authorizing the transaction.
              </label>
            </div>
          )}

          {/* Action Buttons (Approve & Reject) */}
          {isAwaiting && (
            <div className="pt-4 border-t border-[var(--line)] space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  type="button"
                  variant="danger"
                  size="lg"
                  onClick={handleReject}
                  disabled={actionLoading}
                  loading={actionLoading}
                  className="w-full sm:w-1/3"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Reject Proposal
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleApprove}
                  disabled={actionLoading || (requiresFirstTimeConfirmation && !confirmNewRecipient)}
                  loading={actionLoading}
                  className="w-full sm:w-2/3"
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Approve & Sign Hash ({proposal.display_amount} {proposal.asset})
                </Button>
              </div>

              <p className="text-center text-[12px] text-[var(--ink-faint)]">
                Nothing is sent until you approve
              </p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
