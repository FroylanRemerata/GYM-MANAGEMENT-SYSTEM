'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { signOut } from '@/lib/auth';

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [date, setDate] = useState<string>('');
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="sticky top-0 z-100 bg-bg/92 backdrop-blur-lg border-b border-border px-4 sm:px-8 py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <div className="mt-8 sm:mt-0">
        <div className="font-bebas text-lg sm:text-2xl tracking-widest text-text">{title}</div>
        <div className="font-mono text-8px sm:text-10px text-muted hidden sm:block">{date}</div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:ml-auto">
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-52 bg-surface border border-border rounded-lg px-3 py-2 text-xs sm:text-sm text-text placeholder-muted font-display outline-none transition-colors focus:border-accent/40"
        />
        <button className="px-3 sm:px-4 py-2 bg-accent text-black rounded-lg font-display text-xs sm:text-sm font-semibold tracking-wide transition-all hover:bg-yellow-400 active:translate-y-0.5 whitespace-nowrap">
          + New
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-xs sm:text-sm text-text hover:border-accent/50 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span className="hidden sm:inline">👤</span>
            <span className="truncate">{user?.email?.split('@')[0] || 'User'}</span>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-lg shadow-lg p-2 z-50">
              <div className="px-3 py-2 text-xs text-muted border-b border-border mb-2">
                {user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-xs text-accent2 hover:bg-surface2 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
