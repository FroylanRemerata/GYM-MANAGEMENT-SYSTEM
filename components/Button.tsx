import React from 'react';

type ButtonVariant = 'accent' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  accent: 'bg-accent text-black hover:bg-yellow-400 active:translate-y-0.5',
  ghost: 'bg-transparent text-muted border border-border hover:text-text hover:border-muted',
  danger: 'bg-accent2/12 text-accent2 border border-accent2/25',
};

const sizeStyles: Record<ButtonSize, string> = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-2.5 py-1 text-xs',
};

export default function Button({
  variant = 'accent',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-display font-semibold tracking-tight transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
