'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

const navigationItems = [
  { id: 'dashboard', icon: '⚡', label: 'Dashboard', href: '/' },
  { id: 'members', icon: '👥', label: 'Members', href: '/members' },
  { id: 'sales', icon: '💳', label: 'Sales & Payments', href: '/sales' },
  { id: 'inventory', icon: '🥤', label: 'Drink Inventory', href: '/inventory' },
  { id: 'reminders', icon: '🤖', label: 'AI Reminders', href: '/reminders', badge: 5 },
  { id: 'attendance', icon: '📋', label: 'Attendance', href: '/attendance' },
];

const reportItems = [
  { id: 'financial', icon: '💰', label: 'Financial Reports', href: '/reports/financial' },
  { id: 'renewals', icon: '🔄', label: 'Renewal Tracking', href: '/reports/renewals' },
  { id: 'inventory-reports', icon: '📦', label: 'Inventory Reports', href: '/inventory/reports' },
];

export default function Sidebar() {
  const { isSuperAdmin, role } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-lg hover:bg-surface2 active:scale-95 transition-all"
      >
        <span className="text-accent text-xl">☰</span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-screen w-60 bg-surface border-r border-border flex flex-col relative overflow-hidden transition-transform lg:translate-x-0 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Radial gradient background */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-radial from-accent/7 to-transparent pointer-events-none"></div>

        {/* Logo Block */}
        <div className="px-6 py-7 border-b border-border">
          <div className="font-bebas text-3xl sm:text-4xl tracking-widest text-accent leading-none">ASTRAL</div>
          <div className="font-mono text-9px sm:text-xs text-muted tracking-widest uppercase mt-1">Gym Management · v2.0</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {/* Main Section */}
          <div className="px-3 py-3 text-9px sm:text-xs font-mono text-muted tracking-widest uppercase">Main</div>
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                setActiveItem(item.id);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border text-sm sm:text-sm ${
                activeItem === item.id
                  ? 'bg-accent/8 text-accent border-accent/15'
                  : 'text-muted border-transparent hover:bg-surface2 hover:text-text'
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span className="font-medium tracking-tight text-xs sm:text-sm flex-1">{item.label}</span>
              {item.badge && <span className="ml-auto bg-accent2 text-white text-9px font-mono px-1.5 py-0.5 rounded-full flex-shrink-0">{item.badge}</span>}
            </Link>
          ))}

          {/* Reports Section */}
          <div className="px-3 py-3 text-9px sm:text-xs font-mono text-muted tracking-widest uppercase mt-2">Reports</div>
          {reportItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                setActiveItem(item.id);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border text-sm sm:text-sm ${
                activeItem === item.id
                  ? 'bg-accent/8 text-accent border-accent/15'
                  : 'text-muted border-transparent hover:bg-surface2 hover:text-text'
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span className="font-medium tracking-tight text-xs sm:text-sm flex-1">{item.label}</span>
            </Link>
          ))}

          {/* Admin Section - Super Admin Only */}
          {isSuperAdmin && (
            <>
              <div className="px-3 py-3 text-9px sm:text-xs font-mono text-accent tracking-widest uppercase mt-2">Admin</div>
              <Link
                href="/settings"
                onClick={() => {
                  setActiveItem('settings');
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border text-sm sm:text-sm ${
                  activeItem === 'settings'
                    ? 'bg-accent/8 text-accent border-accent/15'
                    : 'text-muted border-transparent hover:bg-surface2 hover:text-text'
                }`}
              >
                <span className="text-base w-5 text-center flex-shrink-0">⚙️</span>
                <span className="font-medium tracking-tight text-xs sm:text-sm flex-1">Settings</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Card Footer */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2.5 p-2.5 bg-surface2 rounded-lg border border-border">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-yellow-600 rounded-full flex items-center justify-center font-bold text-9px sm:text-xs text-black flex-shrink-0">
              JR
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <div className="text-9px sm:text-xs font-semibold leading-tight">James Reyes</div>
              <div className="text-8px text-muted">{role === 'super_admin' ? 'Super Admin' : 'Admin'}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
