import React from 'react';
import Link from 'next/link';
import Spinner from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button' | 'a' | React.ElementType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  showAmberTile?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  href,
  target,
  rel,
  leadingIcon,
  trailingIcon,
  showAmberTile = false,
  disabled = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Sizing tokens
  const sizeClasses = isSm
    ? 'min-h-[36px] h-[36px] px-[14px] text-[13px] rounded-[10px]'
    : isLg
    ? 'min-h-[56px] h-[56px] px-[24px] text-[16px] rounded-[14px]'
    : 'min-h-[48px] h-[48px] px-[20px] text-[15px] rounded-[12px]';

  // Variant styling
  let variantClasses = '';
  let inlineStyles: React.CSSProperties = {};

  if (variant === 'primary') {
    variantClasses =
      'text-[#1A1200] font-[600] border border-[rgba(255,200,40,0.6)] shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_24px_-8px_rgba(245,179,1,0.45)] hover:-translate-y-[1px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.4),0_12px_28px_-6px_rgba(245,179,1,0.55)] active:translate-y-0 active:scale-[0.985]';
    inlineStyles = {
      background: 'linear-gradient(180deg, #FFD34D 0%, #F5B301 100%)',
      boxShadow:
        'inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(245,179,1,0.45)',
    };
  } else if (variant === 'secondary') {
    variantClasses =
      'bg-[rgba(8,8,10,0.9)] border border-[var(--line-strong)] text-[var(--ink)] font-[500] hover:border-white/30 hover:-translate-y-[1px] hover:bg-white/[0.04] active:translate-y-0 active:scale-[0.985]';
  } else if (variant === 'ghost') {
    variantClasses =
      'bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] active:scale-[0.985]';
  } else if (variant === 'danger') {
    variantClasses =
      'bg-transparent border border-[rgba(248,113,113,0.45)] text-[#FCA5A5] font-[500] hover:bg-[rgba(248,113,113,0.10)] hover:border-[rgba(248,113,113,0.7)] active:scale-[0.985]';
  }

  const baseClasses =
    'relative inline-flex items-center justify-center gap-[10px] whitespace-nowrap select-none transition-all duration-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-[#FFC933] focus-visible:outline-offset-[3px]';
  const stateClasses = disabled || loading ? 'opacity-45 pointer-events-none cursor-not-allowed shadow-none' : 'cursor-pointer';

  const fullClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${stateClasses} ${className}`;

  const content = (
    <>
      {loading && <Spinner size={isSm ? 14 : 16} className="text-current" />}
      {!loading && showAmberTile && (
        <span className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-[#FFC933] to-[#F5B301] flex items-center justify-center shrink-0">
          <span className="w-2 h-2 rounded-[2px] bg-[#B07A00]" />
        </span>
      )}
      {!loading && leadingIcon}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
      {!loading && trailingIcon}
    </>
  );

  if (href && !disabled) {
    if (href.startsWith('http') || target === '_blank') {
      return (
        <a
          href={href}
          target={target}
          rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
          className={fullClasses}
          style={inlineStyles}
          onClick={onClick as any}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={fullClasses} style={inlineStyles} onClick={onClick as any}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={fullClasses}
      style={inlineStyles}
      onClick={onClick}
      {...rest}
    >
      {content}
    </button>
  );
}
