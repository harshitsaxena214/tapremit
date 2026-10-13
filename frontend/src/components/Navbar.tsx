'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, SystemStatus } from '@/lib/types';
import { api } from '@/lib/api';
import { getStoredUser, removeAuthToken } from '@/lib/auth';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LogOut, AlertOctagon } from 'lucide-react';

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user: propUser }: NavbarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [user, setUser] = useState<User | null>(propUser ?? null);

  useEffect(() => {
    if (propUser !== undefined) {
      setUser(propUser);
    } else {
      setUser(getStoredUser());
    }
  }, [propUser, pathname]);

  useEffect(() => {
    const handleStorage = () => {
      if (propUser === undefined) {
        setUser(getStoredUser());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [propUser]);

  useEffect(() => {
    api
      .getSystemStatus()
      .then(setSystemStatus)
      .catch(() => {});
  }, []);

  const handleSignOut = () => {
    removeAuthToken();
    setUser(null);
    router.push('/app');
  };

  const isPaused = systemStatus?.limits?.pauseRealTransfers;
  const isRealChain = systemStatus?.isRealChain;

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Emergency pause banner */}
      {isPaused && (
        <div className="w-full bg-rose-600/90 text-white font-[600] text-xs py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-lg backdrop-blur-md">
          <AlertOctagon className="w-4 h-4 shrink-0 animate-bounce" />
          <span>
            Real on-chain transfers are PAUSED by operator (PAUSE_REAL_TRANSFERS=true). Approvals will return 503 and remain safe.
          </span>
        </div>
      )}

      {/* Main Nav Bar */}
      <nav className="w-full h-[64px] bg-[rgba(15,15,16,0.72)] backdrop-blur-[14px] border-b border-[var(--line)]">
        <div className="max-w-[1100px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Shared Logo */}
          <div className="flex items-center gap-4">
            <Logo
              href={user ? '/app/dashboard' : '/app'}
              wordmarkSize="text-[22px]"
              tileSize="w-[32px] h-[32px]"
            />

            {/* Testnet pill */}
            <Badge variant={isRealChain ? 'success' : 'amber'} className="hidden sm:inline-flex">
              {isRealChain ? 'Monad Testnet (Live)' : 'Monad Testnet (Mock)'}
            </Badge>
          </div>

          {/* Center / Navigation Links if signed in */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/app/dashboard"
                className={`text-[15px] font-[500] transition-colors relative py-1 ${
                  pathname === '/app/dashboard'
                    ? 'text-white after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--amber)] after:rounded-full'
                    : 'text-[var(--ink-muted)] hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            </div>
          )}

          {/* Right: User Context & Sign Out */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* User chip */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-[var(--line)] text-xs">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FFC933] to-[#F5B301] text-black font-[600] flex items-center justify-center text-[10px] uppercase">
                    {user.handle.charAt(0)}
                  </span>
                  <span className="font-[500] text-[var(--ink)]">@{user.handle}</span>
                </div>

                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  title="Sign out"
                  className="px-2.5 text-[var(--ink-muted)] hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            ) : (
              <Badge variant="amber">Demo Environment</Badge>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
