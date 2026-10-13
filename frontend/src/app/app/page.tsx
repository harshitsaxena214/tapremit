'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DEMO_USERS, getStoredUser } from '@/lib/auth';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { ArrowRight, Check, AlertCircle, Shield } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [selectedHandle, setSelectedHandle] = useState<string>('alice_agent');
  const [customHandle, setCustomHandle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleSignIn = async (handleToUse?: string) => {
    const target = handleToUse || (customHandle.trim() ? customHandle.trim() : selectedHandle);
    if (!target) return;

    setLoading(true);
    setError(null);

    try {
      await api.loginDemo(target);
      router.push('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify the handle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[var(--bg)]">
      {/* Full-bleed Hero Image backdrop with landing overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/hero/hero.jpg"
          alt="Backdrop"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_50%]"
        />
        <div className="absolute inset-0 bg-[#0F0F10]/80" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(5,6,10,0.85) 0%, rgba(5,6,10,0.5) 50%, rgba(5,6,10,0.85) 100%)',
          }}
        />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-8">
        {/* Monad Testnet Demo Pill above Card */}
        <div className="mb-4 anim-app-fade">
          <Badge variant="amber">Monad testnet demo</Badge>
        </div>

        {/* Centered Glass Card */}
        <div className="w-full max-w-[440px] rounded-[20px] bg-[rgba(10,10,12,0.72)] backdrop-blur-[18px] border border-[var(--line-strong)] p-[clamp(24px,4vw,36px)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] space-y-6 anim-app-fade anim-app-stagger-1">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <Logo href="/app" wordmarkSize="text-[24px]" tileSize="w-[36px] h-[36px]" />
            </div>
            <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-[500] tracking-[-0.035em] leading-[1.1] text-white">
              Sign In
            </h1>
            <p className="text-[14px] leading-[1.5] text-[var(--ink-muted)]">
              Select a seeded demo account to test the AI payment proposal flow without hardware passkeys.
            </p>
          </div>

          {/* Active session shortcut */}
          {currentUser && (
            <div className="p-3.5 rounded-[14px] bg-white/[0.04] border border-[var(--line)] flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-[500] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                  Active Session
                </span>
                <p className="text-[14px] font-[600] text-white">@{currentUser.handle}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/app/dashboard')}
                trailingIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Dashboard
              </Button>
            </div>
          )}

          {/* Error alert */}
          {error && (
            <div className="p-3.5 rounded-[12px] bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.4)] text-[#FCA5A5] text-[13px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--danger)]" />
              <span>{error}</span>
            </div>
          )}

          {/* Seeded 1-click accounts */}
          <div className="space-y-2.5">
            <span className="text-[12px] font-[500] uppercase tracking-[0.12em] text-[var(--ink-faint)] block">
              1-Click Demo Accounts
            </span>

            <div className="space-y-2">
              {DEMO_USERS.map((user) => {
                const isSelected = selectedHandle === user.handle && !customHandle;
                return (
                  <button
                    key={user.handle}
                    type="button"
                    onClick={() => {
                      setSelectedHandle(user.handle);
                      setCustomHandle('');
                    }}
                    className={`w-full min-h-[56px] text-left p-3 rounded-[14px] border transition-all duration-200 flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[var(--surface-2)] border-[#F5B301] shadow-[0_0_12px_rgba(245,179,1,0.2)]'
                        : 'bg-white/[0.02] border-[var(--line)] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar circle */}
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-[600] text-[12px] uppercase shrink-0 ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#FFC933] to-[#F5B301] text-black'
                            : 'bg-white/[0.08] text-[var(--ink)]'
                        }`}
                      >
                        {user.handle.charAt(0)}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-[600] text-white text-[14px] truncate">
                            @{user.handle}
                          </span>
                          <span className="text-[12px] text-[var(--ink-faint)] truncate">
                            ({user.name})
                          </span>
                          {user.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-[600] bg-[#F5B301]/15 text-[#FFC933] border border-[#F5B301]/30">
                              {user.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--ink-muted)] truncate">
                          {user.description}
                        </p>
                      </div>
                    </div>

                    {/* Radio indicator */}
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#FFC933] bg-[#F5B301] text-black'
                          : 'border-[var(--line)]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom handle option */}
          <div className="pt-2 border-t border-[var(--line)] space-y-2">
            <Input
              label="Or Enter Custom Handle"
              placeholder="custom_handle"
              value={customHandle}
              onChange={(e) => {
                setCustomHandle(e.target.value);
                setError(null);
              }}
            />
          </div>

          {/* Submit action */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            onClick={() => handleSignIn()}
          >
            Sign In as @{customHandle.trim() || selectedHandle}
          </Button>

          {/* Honest disclaimer */}
          <p className="text-[11px] text-[var(--ink-faint)] text-center leading-relaxed flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 inline text-[var(--ink-faint)]" />
            Hackathon prototype. Mock auth bypasses passkeys. Demo wallets only.
          </p>
        </div>
      </main>
    </div>
  );
}
