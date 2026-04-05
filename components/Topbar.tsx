'use client';

import { useState, useEffect } from 'react';

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const [date, setDate] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setDate(formatted);
  }, []);

  return (
    <div className="sticky top-0 z-100 bg-bg/92 backdrop-blur-lg border-b border-border px-4 sm:px-8 py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="mt-8 sm:mt-0">
        <div className="font-bebas text-lg sm:text-2xl tracking-widest text-text">{title}</div>
        <div className="font-mono text-8px sm:text-10px text-muted hidden sm:block">{date}</div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:ml-auto">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-52 bg-surface border border-border rounded-lg px-3 py-2 text-xs sm:text-sm text-text placeholder-muted font-display outline-none transition-colors focus:border-accent/40"
        />
        <button className="px-3 sm:px-4 py-2 bg-accent text-black rounded-lg font-display text-xs sm:text-sm font-semibold tracking-wide transition-all hover:bg-yellow-400 active:translate-y-0.5 whitespace-nowrap">
          + New
        </button>
      </div>
    </div>
  );
}
