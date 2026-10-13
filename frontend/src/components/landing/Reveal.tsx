'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: keyof JSX.IntrinsicElements;
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 18,
  as: Component = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-8% 0px -12% 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Before mount (SSR & no-JS fallback), remain visible so content is never hidden
  const isHidden = isMounted && !isVisible;

  const style: React.CSSProperties = {
    opacity: isHidden ? 0 : 1,
    transform: isHidden ? `translateY(${y}px) scale(0.985)` : 'none',
    transition: isMounted
      ? 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1)'
      : 'none',
    transitionDelay: isMounted && delay > 0 ? `${delay}ms` : undefined,
    willChange: isMounted ? 'transform, opacity' : undefined,
  };

  const Tag = Component as any;

  return (
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  );
}
