import React from 'react';
import { Inter } from 'next/font/google';
import '@/styles/tokens.css';
import Navbar from '@/components/Navbar';
import AdapterBadges from '@/components/AdapterBadges';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} relative min-h-screen app-chrome-glow text-[var(--ink)] flex flex-col selection:bg-[var(--amber)]/20 selection:text-white`}
    >
      {/* 1. Sticky Navbar at the very top of /app */}
      <Navbar />

      {/* 2. Normal-flow AdapterBadges status strip directly below Navbar */}
      <AdapterBadges />

      {/* 3. Page content */}
      <div className="flex-1 flex flex-col relative z-20">{children}</div>
    </div>
  );
}
