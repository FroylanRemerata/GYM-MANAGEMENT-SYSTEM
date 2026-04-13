'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Badge from '@/components/Badge';

export default function Reminders() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  const reminders = [
    {
      type: 'warn',
      icon: '⚠️',
      name: 'Ana Lim',
      desc: 'Premium plan expires in 2 days',
    },
    {
      type: 'danger',
      icon: '🔴',
      name: 'Ben Marasigan',
      desc: 'Payment pending for 5 days',
    },
    {
      type: 'info',
      icon: 'ℹ️',
      name: 'Maria Santos',
      desc: 'Low attendance this month (28%)',
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="AI REMINDERS" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">

        <div className="p-3 sm:p-4 md:p-8">
          <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text mb-4 sm:mb-6">AI-Powered Reminders</h2>

          {/* AI Banner */}
          <Card className="bg-gradient-to-br from-accent/6 to-accent3/4 border-accent/15 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 sm:gap-4">
              <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">🤖</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base text-text mb-1">Intelligent Member Alerts</div>
                <div className="text-8px sm:text-xs text-muted">
                  AI automatically monitors member activity and generates reminders for expirations, payment issues, and engagement patterns.
                </div>
              </div>
            </div>
          </Card>

          {/* Reminders List */}
          <Card title="Active Reminders" action={<Badge type="active">5 Active</Badge>}>
            <div className="space-y-2 sm:space-y-3">
              {reminders.map((reminder, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border ${
                    reminder.type === 'warn'
                      ? 'bg-accent/5 border-accent/20'
                      : reminder.type === 'danger'
                        ? 'bg-accent2/5 border-accent2/20'
                        : 'bg-accent3/5 border-accent3/20'
                  }`}
                >
                  <div className="text-lg sm:text-xl md:text-2xl flex-shrink-0">{reminder.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{reminder.name}</div>
                    <div className="text-8px sm:text-xs text-muted">{reminder.desc}</div>
                  </div>
                  <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-8px sm:text-xs font-semibold bg-accent text-black rounded-lg hover:bg-yellow-400 transition-all flex-shrink-0 whitespace-nowrap">
                    Action
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
        </main>
      </div>
    </div>
  );
}
