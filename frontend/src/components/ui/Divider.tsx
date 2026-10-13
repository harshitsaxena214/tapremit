import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  vertical?: boolean;
}

export default function Divider({
  vertical = false,
  className = '',
  ...rest
}: DividerProps) {
  if (vertical) {
    return (
      <div
        className={`w-[1px] h-full bg-[var(--line)] shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <hr
      className={`w-full h-[1px] border-0 bg-[var(--line)] my-4 ${className}`}
      aria-hidden="true"
      {...rest}
    />
  );
}
