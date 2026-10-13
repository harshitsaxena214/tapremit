'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CircleCenter {
  x: number;
  y: number;
  radius: number;
}

export default function ProblemSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const stepsBodyRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [stepIndex, setStepIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Initial circle coordinates fallback before ResizeObserver fires
  const [circleCenters, setCircleCenters] = useState<CircleCenter[]>([
    { x: 28, y: 28, radius: 28 },
    { x: 520, y: 168, radius: 28 },
    { x: 28, y: 308, radius: 28 },
    { x: 520, y: 448, radius: 28 },
  ]);

  const phaseLabels = [
    'DRAFT PROPOSAL',
    'POLICY ENGINE',
    'HUMAN SIGNATURE',
    'MONAD SETTLEMENT',
  ];

  // ========================================================
  // No tall track, no sticky pin. Progress comes from where the card's
  // CENTER sits in the viewport, so it does not depend on viewport height
  // or card height (short laptop screens reach step 04 too).
  //   card center at 85% of viewport height  -> p = 0 (step 01)
  //   card center at 45% of viewport height  -> p = 1
  //   step = floor(p * 4), so step 04 is active once the center passes
  //   55% of the viewport, before the card is even centered.
  // Reduced motion only: all 4 steps shown in final active state.
  // Mobile animates exactly like desktop.
  // ========================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStaticMode = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (checkStaticMode()) {
      setIsReducedMotion(true);
      setStepIndex(3);
    }

    let rafId: number | null = null;

    const calculateProgress = () => {
      if (checkStaticMode()) {
        setIsReducedMotion(true);
        setStepIndex(3);
        return;
      }
      setIsReducedMotion(false);

      const cardEl = cardRef.current;
      if (!cardEl) return;

      const cardRect = cardEl.getBoundingClientRect();
      const vh = window.innerHeight;

      const center = cardRect.top + cardRect.height / 2;
      const start = vh * 0.85;
      const end = vh * 0.45;

      const p = Math.min(1, Math.max(0, (start - center) / (start - end)));
      const newIndex = Math.min(3, Math.max(0, Math.floor(p * 4)));

      setStepIndex((prev) => (prev !== newIndex ? newIndex : prev));
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        calculateProgress();
        rafId = null;
      });
    };

    calculateProgress();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  // Measure exact circle centers relative to stepsBody via ResizeObserver
  useEffect(() => {
    const updateGeometry = () => {
      const body = stepsBodyRef.current;
      if (!body) return;

      const bodyRect = body.getBoundingClientRect();
      const centers: CircleCenter[] = [];

      for (let i = 0; i < 4; i++) {
        const el = circleRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          centers.push({
            x: rect.left - bodyRect.left + rect.width / 2,
            y: rect.top - bodyRect.top + rect.height / 2,
            radius: rect.width / 2,
          });
        }
      }

      if (centers.length === 4) {
        setCircleCenters(centers);
      }
    };

    updateGeometry();

    // Fonts change text height, so measure again once they are loaded
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(updateGeometry).catch(() => {});
    }

    const body = stepsBodyRef.current;
    if (!body || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => updateGeometry());
    ro.observe(body);

    window.addEventListener('resize', updateGeometry);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateGeometry);
    };
  }, []);

  // S-curve connector path: from bottom edge of circle i to top edge of circle i+1
  const getConnectorPath = (c1: CircleCenter, c2: CircleCenter) => {
    const startX = c1.x;
    const startY = c1.y + c1.radius;
    const endX = c2.x;
    const endY = c2.y - c2.radius;
    const midY = (startY + endY) / 2;
    return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
  };

  const activeIndex = isReducedMotion ? 3 : stepIndex;
  const isStep2Active = activeIndex >= 1;
  const isStep3Active = activeIndex >= 2;
  const isStep4Active = activeIndex >= 3;
  const connectorActive = [isStep2Active, isStep3Active, isStep4Active];

  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="relative w-full border-t border-[var(--line)] py-[clamp(64px,7vw,112px)]"
    >
      {/* Guide line crosshair corner markers at horizontal border intersection (BORDER SYSTEM - UNTOUCHED) */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute -top-[7px] left-[calc(var(--gutter)-6px)] w-[13px] h-[13px] items-center justify-center text-white/30 text-[11px] font-mono pointer-events-none select-none z-20"
      >
        +
      </div>
      <div
        aria-hidden="true"
        className="hidden md:flex absolute -top-[7px] right-[calc(var(--gutter)-6px)] w-[13px] h-[13px] items-center justify-center text-white/30 text-[11px] font-mono pointer-events-none select-none z-20"
      >
        +
      </div>

      {/* Screen reader text alternative */}
      <div className="sr-only">
        <h3>TapRemit 4-Step Verification Chain:</h3>
        <ol>
          <li>Step 1: Plain language prompt parsed into structured proposal. Status: proposed.</li>
          <li>Step 2: Deterministic policy engine validates per-tx and daily budget caps. Status: policy_checked.</li>
          <li>Step 3: Human reviews canonical SHA-256 hash and signs with passkey. Status: awaiting_approval to approved.</li>
          <li>Step 4: Monad testnet executes settlement with immutable audit receipt. Status: confirmed.</li>
        </ol>
      </div>

      {/* Main Content Grid: 2 columns, centered, full width within gutter lines */}
      <div
        className="w-full max-w-[1680px] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-[clamp(32px,5vw,96px)] items-center px-5 md:px-0"
        style={{
          paddingLeft: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
          paddingRight: 'calc(var(--gutter) + clamp(24px, 2.1vw, 40px))',
        }}
      >
        {/* Left Column: Problem Narrative */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-[12px] tracking-[0.12em] text-[var(--amber)] uppercase">
              01 / The Problem
            </span>
          </div>

          <h2
            id="problem-heading"
            className="text-[clamp(2rem,3.8vw,3.75rem)] font-[500] tracking-[-0.035em] leading-[1.08] text-[var(--ink)]"
          >
            AI should never hold your private keys.
          </h2>

          <p className="text-[15px] text-[var(--ink-muted)] leading-[1.65] max-w-[34rem]">
            Autonomous agents can hallucinate, misinterpret natural-language intent, or exceed
            spending budgets in seconds. Giving an LLM direct signing keys is an avoidable
            catastrophe.
          </p>

          <p className="text-[15px] text-[var(--ink-muted)] leading-[1.65] max-w-[34rem]">
            TapRemit treats the AI model as an untrusted drafter. The agent proposes a payment,
            deterministic policy rules test the bounds, and funds stay locked until you
            cryptographically approve.
          </p>

          {/* Dynamic Step Pill & Label */}
          <div className="pt-2 flex items-center gap-3">
            <span className="font-mono text-[12px] tracking-[0.14em] text-[var(--amber)] bg-[var(--surface-2)] border border-[var(--line)] px-3 py-1.5 rounded-[10px] inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)] animate-pulse motion-reduce:animate-none" />
              <span>PHASE 0{activeIndex + 1} OF 04</span>
            </span>
            <span className="text-[12px] text-[var(--ink-faint)] font-mono">
              {phaseLabels[activeIndex]}
            </span>
          </div>
        </div>

        {/* Right Column: Roomy Card (Height: auto, min-height 600px, max-width 620px) */}
        <div className="w-full flex justify-center md:justify-end">
          <div
            ref={cardRef}
            aria-hidden="true"
            className="w-full max-w-[620px] md:justify-self-end mx-auto md:mx-0 h-auto min-h-[600px] rounded-[20px] border border-[var(--line-strong)] bg-[var(--surface-2)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] p-6 sm:p-9 overflow-hidden flex flex-col justify-between backdrop-blur-md"
          >
            {/* Header row */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--line)] shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--amber)] shrink-0" />
                <span className="font-mono text-[12px] tracking-[0.12em] uppercase text-[var(--ink-faint)]">
                  DETERMINISTIC PROTOCOL STATE
                </span>
              </div>
              <span className="font-mono text-[12px] text-[var(--amber)] tabular-nums font-[600]">
                0{activeIndex + 1} / 04
              </span>
            </div>

            {/* Steps Body: flex: 1, justify-content: space-between, relative */}
            <div
              ref={stepsBodyRef}
              className="relative flex-1 flex flex-col justify-between py-2 min-h-[460px]"
            >
              {/* Absolutely positioned SVG behind HTML steps for curved connectors.
                  pathLength={1} makes the draw-in independent of the real curve length. */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {connectorActive.map((on, i) => (
                  <path
                    key={i}
                    d={getConnectorPath(circleCenters[i], circleCenters[i + 1])}
                    pathLength={1}
                    stroke={on ? (i === 2 ? '#4ADE80' : '#F5B301') : 'rgba(255, 255, 255, 0.16)'}
                    strokeWidth="1.5"
                    strokeDasharray="1"
                    strokeDashoffset={on ? 0 : 1}
                    style={{
                      transition:
                        'stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1), stroke 400ms ease',
                    }}
                  />
                ))}
              </svg>

              {/* STEP 1: Circle on Left, Text on Right */}
              <div className="relative z-10 flex items-center gap-4 transition-all duration-300">
                <div
                  ref={(el) => { circleRefs.current[0] = el; }}
                  className="w-[56px] h-[56px] max-lg:w-[48px] max-lg:h-[48px] rounded-full flex items-center justify-center shrink-0 font-mono text-[14px] font-[600] border-2 border-[var(--amber)] bg-[#151518] text-[var(--amber)] shadow-[0_0_16px_rgba(245,179,1,0.25)]"
                >
                  01
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[18px] font-[500] text-[var(--ink)] leading-[1.3]">
                    Natural-Language Intent
                  </div>
                  <div className="text-[13px] font-mono text-[var(--ink-muted)]">
                    proposed · agent drafts
                  </div>
                </div>
              </div>

              {/* STEP 2: Circle on Right, Text on Left (Zigzag) */}
              <div
                className={`relative z-10 flex items-center justify-end gap-4 text-right transition-all duration-400 ${
                  isStep2Active ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[18px] font-[500] text-[var(--ink)] leading-[1.3]">
                    Deterministic Policy Engine
                  </div>
                  <div className="text-[13px] font-mono text-[var(--ink-muted)]">
                    policy_checked · per-tx limits
                  </div>
                </div>
                <div
                  ref={(el) => { circleRefs.current[1] = el; }}
                  className={`w-[56px] h-[56px] max-lg:w-[48px] max-lg:h-[48px] rounded-full flex items-center justify-center shrink-0 font-mono text-[14px] font-[600] transition-all duration-300 ${
                    isStep2Active
                      ? 'border-2 border-[var(--amber)] bg-[#151518] text-[var(--amber)] shadow-[0_0_16px_rgba(245,179,1,0.25)]'
                      : 'border border-[var(--line-strong)] bg-[#151518] text-[var(--ink-faint)]'
                  }`}
                >
                  02
                </div>
              </div>

              {/* STEP 3: Circle on Left, Text on Right */}
              <div
                className={`relative z-10 flex items-center gap-4 transition-all duration-400 ${
                  isStep3Active ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  ref={(el) => { circleRefs.current[2] = el; }}
                  className={`w-[56px] h-[56px] max-lg:w-[48px] max-lg:h-[48px] rounded-full flex items-center justify-center shrink-0 font-mono text-[14px] font-[600] transition-all duration-300 ${
                    isStep3Active
                      ? 'border-2 border-[var(--amber)] bg-[#151518] text-[var(--amber)] shadow-[0_0_16px_rgba(245,179,1,0.25)]'
                      : 'border border-[var(--line-strong)] bg-[#151518] text-[var(--ink-faint)]'
                  }`}
                >
                  03
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[18px] font-[500] text-[var(--ink)] leading-[1.3]">
                    Human Passkey Approval
                  </div>
                  <div className="text-[13px] font-mono text-[var(--ink-muted)]">
                    awaiting_approval · sha256 hash
                  </div>
                </div>
              </div>

              {/* STEP 4: Circle on Right, Text on Left */}
              <div
                className={`relative z-10 flex items-center justify-end gap-4 text-right transition-all duration-400 ${
                  isStep4Active ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[18px] font-[500] text-[var(--ink)] leading-[1.3]">
                    Monad Testnet Settlement
                  </div>
                  <div className="text-[13px] font-mono text-[var(--ink-muted)]">
                    confirmed · explorer receipt
                  </div>
                </div>
                <div
                  ref={(el) => { circleRefs.current[3] = el; }}
                  className={`w-[56px] h-[56px] max-lg:w-[48px] max-lg:h-[48px] rounded-full flex items-center justify-center shrink-0 font-mono text-[14px] font-[600] transition-all duration-300 ${
                    isStep4Active
                      ? 'border-2 border-[#4ADE80] bg-[#151518] text-[#4ADE80] shadow-[0_0_16px_rgba(74,222,128,0.25)]'
                      : 'border border-[var(--line-strong)] bg-[#151518] text-[var(--ink-faint)]'
                  }`}
                >
                  04
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}