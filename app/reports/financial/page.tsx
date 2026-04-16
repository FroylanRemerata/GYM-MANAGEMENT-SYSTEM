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

interface FinancialData {
  totalRevenue: number;
  transactionCount: number;
  averageTransaction: number;
  byPaymentMethod: Record<string, number>;
  byType: Record<string, number>;
  dailyBreakdown: Array<{ date: string; amount: number }>;
  transactions: any[];
}

export default function FinancialReports() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [data, setData] = useState<FinancialData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('all');

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, paymentMethod]);

  const fetchReport = async () => {
    try {
      setLoadingData(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (paymentMethod) params.append('paymentMethod', paymentMethod);

      const response = await fetch(
        `/api/reports/financial?${params.toString()}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setPaymentMethod('all');
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  const revenueByType = data?.byType || {};
  const totalByType = Object.values(revenueByType).reduce(
    (sum: number, val: any) => sum + val,
    0
  );

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="FINANCIAL REPORTS" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">
          <div className="p-3 sm:p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text">
                Financial Reports
              </h2>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  ↻ Reset
                </Button>
                <Button size="sm">↓ Export</Button>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <label className="text-8px text-muted font-mono uppercase tracking-tighter mb-1.5 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-8px text-muted font-mono uppercase tracking-tighter mb-1.5 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-8px text-muted font-mono uppercase tracking-tighter mb-1.5 block">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text"
                  >
                    <option value="all">All Methods</option>
                    <option value="online">Online</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>
            </Card>

            {loadingData ? (
              <div className="text-center text-muted">Loading report...</div>
            ) : (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                  <Card>
                    <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">
                      Total Revenue
                    </div>
                    <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-accent">
                      ₱{(data?.totalRevenue || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </Card>
                  <Card>
                    <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">
                      Transactions
                    </div>
                    <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-accent2">
                      {data?.transactionCount || 0}
                    </div>
                  </Card>
                  <Card>
                    <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">
                      Avg Transaction
                    </div>
                    <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-accent3">
                      ₱{(data?.averageTransaction || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </Card>
                  <Card>
                    <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">
                      Period
                    </div>
                    <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-success">
                      {startDate && endDate ? 'Custom' : 'All Time'}
                    </div>
                  </Card>
                </div>

                {/* Revenue Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6">
                  {/* By Payment Method */}
                  <Card title="Revenue by Payment Method">
                    <div className="space-y-3 sm:space-y-4">
                      {Object.entries(data?.byPaymentMethod || {}).map(
                        ([method, amount]: [string, any]) => {
                          const percentage =
                            ((amount / (data?.totalRevenue || 1)) * 100).toFixed(
                              1
                            ) + '%';
                          const methodLabel =
                            method.charAt(0).toUpperCase() + method.slice(1);
                          return (
                            <div key={method}>
                              <div className="flex justify-between items-center mb-1 sm:mb-1.5 text-8px sm:text-xs">
                                <span>{methodLabel}</span>
                                <span className="text-accent">
                                  ₱
                                  {amount.toLocaleString('en-US', {
                                    minimumFractionDigits: 0,
                                  })}
                                  · {percentage}
                                </span>
                              </div>
                              <ProgressBar
                                value={parseFloat(percentage)}
                                max={100}
                                color="accent"
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </Card>

                  {/* By Transaction Type */}
                  <Card title="Revenue by Type">
                    <div className="space-y-3 sm:space-y-4">
                      {Object.entries(revenueByType)
                        .sort(
                          (a: any, b: any) => b[1] - a[1]
                        )
                        .slice(0, 5)
                        .map(([type, amount]: [string, any]) => {
                          const percentage =
                            ((amount / (totalByType || 1)) * 100).toFixed(1) +
                            '%';
                          return (
                            <div key={type}>
                              <div className="flex justify-between items-center mb-1 sm:mb-1.5 text-8px sm:text-xs">
                                <span>{type}</span>
                                <span className="text-accent">
                                  ₱
                                  {amount.toLocaleString('en-US', {
                                    minimumFractionDigits: 0,
                                  })}
                                  · {percentage}
                                </span>
                              </div>
                              <ProgressBar
                                value={parseFloat(percentage)}
                                max={100}
                                color="accent2"
                              />
                            </div>
                          );
                        })}
                    </div>
                  </Card>
                </div>

                {/* Daily Breakdown */}
                <Card title="Daily Breakdown" subtitle={`Last ${data?.dailyBreakdown.length || 0} days`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left font-mono text-9px text-muted uppercase pb-2 px-2 border-b border-border">
                            Date
                          </th>
                          <th className="text-right font-mono text-9px text-muted uppercase pb-2 px-2 border-b border-border">
                            Amount
                          </th>
                          <th className="text-right font-mono text-9px text-muted uppercase pb-2 px-2 border-b border-border">
                            % of Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.dailyBreakdown.map((day: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white/1.5">
                            <td className="py-2 px-2 border-b border-border/60 text-sm">
                              {day.date}
                            </td>
                            <td className="py-2 px-2 border-b border-border/60 text-right text-sm font-semibold">
                              ₱
                              {day.amount.toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                              })}
                            </td>
                            <td className="py-2 px-2 border-b border-border/60 text-right text-sm text-accent">
                              {(
                                ((day.amount / (data?.totalRevenue || 1)) * 100)
                              ).toFixed(1)}
                              %
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
