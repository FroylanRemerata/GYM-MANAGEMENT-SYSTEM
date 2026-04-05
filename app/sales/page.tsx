'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';

export default function Sales() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }
  const paymentTypes = [
    { icon: '💳', name: 'Memberships', value: '₱72,400' },
    { icon: '🚶', name: 'Walk-ins', value: '₱14,600' },
    { icon: '🛒', name: 'Merchandise', value: '₱11,450' },
  ];

  const paymentMethods = [
    { name: 'GCash', amount: '₱41,200', percentage: 42, color: 'accent' as const },
    { name: 'Cash', amount: '₱32,800', percentage: 33, color: 'accent3' as const },
    { name: 'Maya', amount: '₱15,600', percentage: 16, color: 'success' as const },
    { name: 'Card', amount: '₱8,850', percentage: 9, color: 'accent2' as const },
  ];

  const transactions = [
    {
      id: '#TXN-2248',
      member: 'Derek Cruz',
      type: 'VIP Membership',
      amount: '₱5,000',
      method: 'GCash',
      date: 'Dec 28, 2025',
      status: 'paid',
    },
    {
      id: '#TXN-2247',
      member: 'Carlo Reyes',
      type: 'Renewal',
      amount: '₱2,500',
      method: 'Maya',
      date: 'Dec 27, 2025',
      status: 'paid',
    },
    {
      id: '#TXN-2246',
      member: 'Rina Dela Cruz',
      type: 'Walk-in',
      amount: '₱150',
      method: 'Cash',
      date: 'Dec 27, 2025',
      status: 'paid',
    },
    {
      id: '#TXN-2245',
      member: 'Ben Marasigan',
      type: 'Premium',
      amount: '₱2,000',
      method: 'GCash',
      date: 'Dec 26, 2025',
      status: 'pending',
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="SALES & PAYMENTS" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">

        <div className="p-3 sm:p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text">Sales & Payments</h2>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm">
                ↓ Export
              </Button>
              <Button size="sm">+ Record</Button>
            </div>
          </div>

          {/* Payment Type Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            {paymentTypes.map((type, idx) => (
              <Card key={idx}>
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2">{type.icon}</div>
                <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">{type.name}</div>
                <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-accent">{type.value}</div>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-1.4fr-1fr gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6">
            {/* Payment Methods Breakdown */}
            <Card title="Payment Method Breakdown" subtitle="December 2025">
              <div className="space-y-3 sm:space-y-4">
                {paymentMethods.map((method, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1 sm:mb-1.5 text-8px sm:text-xs">
                      <span>{method.name}</span>
                      <span className={method.color === 'accent' ? 'text-accent' : method.color === 'success' ? 'text-success' : method.color === 'accent3' ? 'text-accent3' : 'text-accent2'}>
                        {method.amount} · {method.percentage}%
                      </span>
                    </div>
                    <ProgressBar value={method.percentage} max={100} color={method.color} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Revenue Trend */}
            <Card title="Revenue Trend">
              <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-2 sm:mb-2.5">DAILY · LAST 7 DAYS</div>
              <div className="flex items-end gap-1 sm:gap-1.5 h-20 sm:h-24">
                {[55, 70, 45, 80, 65, 95, 40].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1">
                    <div
                      className={`w-full rounded-t transition-all cursor-pointer ${
                        idx === 5 ? 'bg-accent border-accent' : 'bg-accent/15 border border-accent/20'
                      }`}
                      style={{ height: `${height * 2.5}px` }}
                    ></div>
                    <span className={`font-mono text-7px sm:text-8px ${idx === 5 ? 'text-accent' : 'text-muted'}`}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card
            title="Recent Transactions"
            action={<Badge type="pending">24 pending</Badge>}
          >
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">ID</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">Member</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">Type</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">Amount</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">Method</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">Date</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">Status</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr key={idx} className="hover:bg-white/1.5 transition-colors">
                      <td className="py-3 px-2 sm:px-4 border-b border-border/60 font-mono text-10px text-muted">{txn.id}</td>
                      <td className="py-3 px-2 sm:px-4 border-b border-border/60 font-semibold text-sm">{txn.member}</td>
                      <td className="py-3 px-2 sm:px-4 border-b border-border/60">
                        <span className="inline-flex px-2 py-1 bg-surface2 text-muted border border-border text-10px rounded font-mono">
                          {txn.type}
                        </span>
                      </td>
                      <td className={`py-3 px-2 sm:px-4 border-b border-border/60 font-semibold text-sm ${txn.status === 'paid' ? 'text-success' : 'text-accent'}`}>
                        {txn.amount}
                      </td>
                      <td className="py-3 px-2 sm:px-4 border-b border-border/60 text-sm">{txn.method}</td>
                      <td className="py-3 px-2 sm:px-4 border-b border-border/60 font-mono text-10px text-muted">{txn.date}</td>
                      <td className="py-3 px-2 sm:px-4 border-b border-border/60">
                        <Badge type={txn.status === 'paid' ? 'paid' : 'pending'}>
                          {txn.status === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 sm:px-4 border-b border-border/60">
                        {txn.status === 'pending' ? (
                          <Button variant="accent" size="sm">
                            Confirm
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            Receipt
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {transactions.map((txn, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg hover:bg-white/1.5 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-mono text-8px text-muted mb-0.5">{txn.id}</div>
                      <div className="font-semibold text-sm">{txn.member}</div>
                    </div>
                    <Badge type={txn.status === 'paid' ? 'paid' : 'pending'}>
                      {txn.status === 'paid' ? 'Paid' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-8px text-muted font-mono uppercase tracking-tighter mb-0.5">Type</div>
                      <span className="inline-flex px-2 py-0.5 bg-surface2 text-muted border border-border text-8px rounded font-mono">
                        {txn.type}
                      </span>
                    </div>
                    <div>
                      <div className="text-8px text-muted font-mono uppercase tracking-tighter mb-0.5">Amount</div>
                      <div className={`font-semibold text-xs ${txn.status === 'paid' ? 'text-success' : 'text-accent'}`}>
                        {txn.amount}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-8px text-muted font-mono uppercase tracking-tighter mb-0.5">Method</div>
                      <div className="text-9px">{txn.method}</div>
                    </div>
                    <div>
                      <div className="text-8px text-muted font-mono uppercase tracking-tighter mb-0.5">Date</div>
                      <div className="font-mono text-9px text-muted">{txn.date}</div>
                    </div>
                  </div>
                  <div>
                    {txn.status === 'pending' ? (
                      <Button variant="accent" size="sm" className="w-full">
                        Confirm
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="w-full">
                        Receipt
                      </Button>
                    )}
                  </div>
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
