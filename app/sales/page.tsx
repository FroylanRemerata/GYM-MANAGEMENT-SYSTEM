'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import ProgressBar from '@/components/ProgressBar';

interface SalesData {
  totalRevenue: number;
  transactionCount: number;
  typeBreakdown: Record<string, number>;
  methodBreakdown: Record<string, number>;
  topTransactions: any[];
  dailyBreakdown: Record<string, number>;
}

export default function Sales() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [data, setData] = useState<SalesData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login');
      } else {
        fetchSalesData();
      }
    }
  }, [user, loading, isAdmin, router]);

  const fetchSalesData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch('/api/sales/summary');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  // Calculate payment types from typeBreakdown
  const paymentTypes = [
    {
      icon: '💳',
      name: 'Memberships',
      value: `₱${((data?.typeBreakdown['Membership'] || 0) + (data?.typeBreakdown['Renewal'] || 0)).toLocaleString('en-US', {maximumFractionDigits: 0})}`,
    },
    {
      icon: '🚶',
      name: 'Walk-ins',
      value: `₱${(data?.typeBreakdown['Walk-in'] || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`,
    },
    {
      icon: '🛒',
      name: 'Other',
      value: `₱${(
        Object.entries(data?.typeBreakdown || {})
          .filter(([k]) => !['Membership', 'Renewal', 'Walk-in'].includes(k))
          .reduce((sum, [, v]: [string, any]) => sum + v, 0) || 0
      ).toLocaleString('en-US', {maximumFractionDigits: 0})}`,
    },
  ];

  // Calculate payment methods
  const methodBreakdown = data?.methodBreakdown || {};
  const totalRevenue = data?.totalRevenue || 1;
  const paymentMethods = Object.entries(methodBreakdown).map(([method, amount]: [string, any]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    amount: `₱${amount.toLocaleString('en-US', {maximumFractionDigits: 0})}`,
    percentage: Math.round((amount / totalRevenue) * 100),
    color: method === 'online' ? ('accent' as const) : ('accent3' as const),
  }));

  const transactions = (data?.topTransactions || []).map((txn: any) => ({
    id: txn.id?.slice(0, 8).toUpperCase() || '#TXN-0000',
    member: txn.member_name || 'Unknown',
    type: txn.type || 'Other',
    amount: `₱${parseFloat(txn.amount).toLocaleString('en-US', {maximumFractionDigits: 0})}`,
    method: txn.payment_method?.charAt(0).toUpperCase() + (txn.payment_method?.slice(1) || '') || 'Cash',
    date: new Date(txn.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}),
    status: txn.status || 'paid',
  })).slice(0, 4);

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
                      <span className={method.color === 'accent' ? 'text-accent' : 'text-accent3'}>
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
