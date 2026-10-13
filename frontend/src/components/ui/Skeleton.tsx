import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

export default function Skeleton({
  width,
  height,
  className = '',
  style = {},
  ...rest
}: SkeletonProps) {
  const inlineStyle: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`}
      style={inlineStyle}
      aria-hidden="true"
      {...rest}
    />
  );
}
