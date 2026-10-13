import React from 'react';
import Logo, { LogoProps } from '@/components/ui/Logo';

export default function LandingLogo({ className = '' }: LogoProps) {
  return (
    <Logo
      href="/"
      className={className}
      wordmarkSize="text-[30px]"
      tileSize="w-[40px] h-[40px]"
    />
  );
}
