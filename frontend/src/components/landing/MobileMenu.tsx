'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { NavLink } from './content';

interface MobileMenuProps {
  links: NavLink[];
  ctaLabel: string;
}

export default function MobileMenu({ links, ctaLabel }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative min-[900px]:hidden" ref={menuRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3.5 py-2 rounded-lg bg-[rgba(8,8,10,0.85)] border border-white/[0.14] text-white text-[15px] font-[500] hover:border-white/[0.30] transition focus:outline-none focus-visible:outline-2 focus-visible:outline-[#FFC933]"
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {isOpen && (
        <div
          id="mobile-nav-panel"
          className="absolute right-0 top-[calc(100%+12px)] w-[240px] p-5 rounded-2xl bg-[#0F0F10]/95 backdrop-blur-xl border border-white/[0.12] shadow-2xl flex flex-col gap-4 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-[16px] font-[500] text-[rgba(237,237,239,0.7)] hover:text-white transition py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/[0.08]">
            <Link
              href="/app"
              onClick={() => setIsOpen(false)}
              className="w-full h-[46px] rounded-xl bg-gradient-to-r from-[#FFC933] to-[#F5B301] text-black font-[600] text-[15px] flex items-center justify-center shadow-md hover:brightness-105 transition"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
