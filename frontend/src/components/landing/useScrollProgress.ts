'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }

    let rafId: number | null = null;

    const calculate = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) {
        setProgress(1);
        return;
      }

      // Exact track formula: clamp(-rect.top / (rect.height - window.innerHeight), 0, 1)
      const scrolled = -rect.top;
      const p = Math.min(1, Math.max(0, scrolled / totalScrollable));
      setProgress(p);
    };

    // Calculate immediately on mount so mid-scroll refresh reflects correct step
    calculate();

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        calculate();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return { ref, progress };
}
