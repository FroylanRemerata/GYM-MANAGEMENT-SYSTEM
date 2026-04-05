import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function Card({ title, subtitle, children, header, action, className = '' }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-xl overflow-hidden ${className}`}>
      {(title || header) && (
        <>
          <div className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border-b border-border flex items-center justify-between gap-2">
            {header ? (
              header
            ) : (
              <div className="min-w-0">
                <div className="font-semibold text-sm sm:text-base md:text-lg text-text break-words">{title}</div>
                {subtitle && <div className="text-8px sm:text-xs text-muted mt-0.5">{subtitle}</div>}
              </div>
            )}
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </>
      )}
      <div className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4">{children}</div>
    </div>
  );
}
