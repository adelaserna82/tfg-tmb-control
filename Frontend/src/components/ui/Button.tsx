// components/ui/Button.tsx
import { Button as HeadlessButton } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

function Button({
  children,
  onClick,
  className,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  return (
    <HeadlessButton
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
      'inline-flex items-center justify-center',
      'rounded-md px-4 py-2 text-sm font-medium',
      'bg-green-600 text-white hover:bg-green-500',
      'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      !disabled && 'cursor-pointer',
      className
      )}
    >
      {children}
    </HeadlessButton>
  );
}

export { Button };
