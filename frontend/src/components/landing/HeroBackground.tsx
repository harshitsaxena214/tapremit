import React from 'react';
import Image from 'next/image';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Hero Image with slow settle animation */}
      <Image
        src="/hero/hero.jpg"
        alt="Dusk landscape with golden light arc"
        fill
        priority
        sizes="100vw"
        className="anim-hero-img object-cover object-[70%_50%]"
      />

      {/* 1. Flat wash */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ backgroundColor: 'rgba(5, 6, 10, 0.28)' }}
      />

      {/* 2. Left-to-right gradient for text legibility */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(to right, rgba(5,6,10,0.82) 0%, rgba(5,6,10,0.45) 50%, rgba(5,6,10,0) 100%)',
        }}
      />

      {/* 3. Bottom fade into page background */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background:
            'linear-gradient(to top, rgba(11,11,13,0.75) 0%, rgba(11,11,13,0) 35%)',
        }}
      />
    </div>
  );
}
