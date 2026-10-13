import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string | null;
}

export default function Input({
  label,
  hint,
  error,
  id,
  className = '',
  disabled,
  ...rest
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[12px] font-[500] uppercase tracking-[0.12em] text-[var(--ink-faint)] select-none"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        disabled={disabled}
        className={`w-full h-[48px] px-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)] text-[15px] text-[var(--ink)] placeholder-[var(--ink-faint)] transition-all duration-200 focus:outline-none focus:border-[#FFC933] focus:ring-1 focus:ring-[#FFC933] disabled:opacity-45 disabled:cursor-not-allowed ${
          error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]' : ''
        } ${className}`}
        {...rest}
      />

      {hint && !error && (
        <p className="text-[12px] text-[var(--ink-faint)]">{hint}</p>
      )}

      {error && (
        <p className="text-[12px] text-[var(--danger)] flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
