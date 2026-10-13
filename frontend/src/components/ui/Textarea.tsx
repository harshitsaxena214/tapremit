import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string | null;
}

export default function Textarea({
  label,
  hint,
  error,
  id,
  className = '',
  disabled,
  ...rest
}: TextareaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-[12px] font-[500] uppercase tracking-[0.12em] text-[var(--ink-faint)] select-none"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        disabled={disabled}
        className={`w-full min-h-[120px] p-4 rounded-[14px] bg-[var(--surface)] border border-[var(--line)] text-[16px] text-[var(--ink)] placeholder-[var(--ink-faint)] leading-[1.6] transition-all duration-200 resize-y focus:outline-none focus:border-[#FFC933] focus:ring-1 focus:ring-[#FFC933] disabled:opacity-45 disabled:cursor-not-allowed ${
          error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]' : ''
        } ${className}`}
        {...rest}
      />

      {hint && !error && (
        <p className="text-[12px] text-[var(--ink-faint)]">{hint}</p>
      )}

      {error && (
        <p className="text-[12px] text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
}
