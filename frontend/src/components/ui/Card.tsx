import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

export default function Card({
  hover = false,
  glass = false,
  className = '',
  children,
  ...rest
}: CardProps) {
  const bgClass = glass
    ? 'bg-[rgba(10,10,12,0.72)] backdrop-blur-[18px] border-[var(--line-strong)]'
    : 'bg-[var(--surface)] border-[var(--line)]';

  const hoverClass = hover ? 'hover:border-white/20 transition-colors duration-200' : '';

  return (
    <div
      className={`rounded-[20px] border p-6 sm:p-7 ${bgClass} ${hoverClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
