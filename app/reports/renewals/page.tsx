'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';

interface RenewalMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership_type: string;
  renewal_date: string;
  daysUntilExpiry: number;
  status: 'expired' | 'expiring' | 'active';
}

interface RenewalStats {
  total: number;
  active: number;
  expiring: number;
  expired: number;
}

export default function RenewalTracking() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [members, setMembers] = useState<RenewalMember[]>([]);
  const [stats, setStats] = useState<RenewalStats>({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0,
  });
  const [loadingData, setLoadingData] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    fetchRenewals();
  }, [statusFilter]);

  const fetchRenewals = async () => {
    try {
      setLoadingData(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(
        `/api/members/renewals?${params.toString()}`
      );
      const result = await response.json();
      setMembers(result.members || []);
      setStats(result.stats);
    } catch (error) {
      console.error('Failed to fetch renewals:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusColor = (status: string): 'expired' | 'expiring' | 'active' | 'pending' => {
    switch (status) {
      case 'expired':
        return 'expired';
      case 'expiring':
        return 'expiring';
      case 'active':
        return 'active';
      default:
        return 'pending';
    }
  };

  const handleSendReminder = async (memberId: string) => {
    try {
      await fetch('/api/reminders/send-renewal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });
      alert('Reminder sent successfully');
    } catch (error) {
      alert('Failed to send reminder');
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="RENEWAL TRACKING" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">
          <div className="p-3 sm:p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text">
                Member Renewal Tracking
              </h2>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="ghost" size="sm">
                  ↓ Export
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
              <div
                className="cursor-pointer transition-all hover:ring-2 hover:ring-accent"
                onClick={() => setStatusFilter('all')}
              >
                <Card className={statusFilter === 'all' ? 'ring-2 ring-accent' : ''}>
                  <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">
                    Total Members
                  </div>
                  <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-text">
                    {stats.total}
                  </div>
                </Card>
              </div>
              <div
                className="cursor-pointer transition-all hover:ring-2 hover:ring-success"
                onClick={() => setStatusFilter('active')}
              >
                <Card className={statusFilter === 'active' ? 'ring-2 ring-success' : ''}>
                  <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">
                    Active
                  </div>
                  <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-success">
                    {stats.active}
                  </div>
                </Card>
              </div>
              <div
                className="cursor-pointer transition-all hover:ring-2 hover:ring-accent"
                onClick={() => setStatusFilter('expiring')}
              >
                <Card className={statusFilter === 'expiring' ? 'ring-2 ring-accent' : ''}>
                  <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">
                    Expiring Soon
                  </div>
                  <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-accent">
                    {stats.expiring}
                  </div>
                </Card>
              </div>
              <div
                className="cursor-pointer transition-all hover:ring-2 hover:ring-accent3"
                onClick={() => setStatusFilter('expired')}
              >
                <Card className={statusFilter === 'expired' ? 'ring-2 ring-accent3' : ''}>
                  <div className="text-8px sm:text-9px text-muted font-mono uppercase mb-1">
                    Expired
                  </div>
                  <div className="font-bebas text-xl sm:text-2xl md:text-3xl text-accent3">
                    {stats.expired}
                  </div>
                </Card>
              </div>
            </div>

            {/* Members List */}
            <Card title="Renewal Status">
              {loadingData ? (
                <div className="text-center text-muted py-4">Loading members...</div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left font-mono text-9px text-muted uppercase pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">
                            Name
                          </th>
                          <th className="text-left font-mono text-9px text-muted uppercase pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">
                            Email
                          </th>
                          <th className="text-left font-mono text-9px text-muted uppercase pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">
                            Plan
                          </th>
                          <th className="text-left font-mono text-9px text-muted uppercase pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">
                            Renewal Date
                          </th>
                          <th className="text-left font-mono text-9px text-muted uppercase pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">
                            Days Left
                          </th>
                          <th className="text-left font-mono text-9px text-muted uppercase pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">
                            Status
                          </th>
                          <th className="text-left font-mono text-9px text-muted uppercase pb-3 px-2 sm:px-4 border-b border-border sticky top-0 bg-surface">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member) => (
                          <tr key={member.id} className="hover:bg-white/1.5">
                            <td className="py-3 px-2 sm:px-4 border-b border-border/60 font-semibold text-sm">
                              {member.name}
                            </td>
                            <td className="py-3 px-2 sm:px-4 border-b border-border/60 text-9px text-muted">
                              {member.email}
                            </td>
                            <td className="py-3 px-2 sm:px-4 border-b border-border/60 text-sm">
                              <span className="inline-flex px-2 py-1 bg-surface2 text-muted border border-border text-9px rounded font-mono">
                                {member.membership_type}
                              </span>
                            </td>
                            <td className="py-3 px-2 sm:px-4 border-b border-border/60 font-mono text-10px text-muted">
                              {new Date(member.renewal_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-2 sm:px-4 border-b border-border/60 font-semibold text-sm">
                              {member.daysUntilExpiry > 0 ? (
                                <span className="text-text">
                                  {member.daysUntilExpiry} days
                                </span>
                              ) : (
                                <span className="text-accent3">
                                  {Math.abs(member.daysUntilExpiry)} days ago
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2 sm:px-4 border-b border-border/60">
                              <Badge type={getStatusColor(member.status)}>
                                {member.status.charAt(0).toUpperCase() +
                                  member.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 sm:px-4 border-b border-border/60">
                              <Button
                                size="sm"
                                onClick={() => handleSendReminder(member.id)}
                              >
                                Send Reminder
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="p-3 border border-border rounded-lg hover:bg-white/1.5"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="font-semibold text-sm">{member.name}</div>
                            <div className="text-8px text-muted">{member.email}</div>
                          </div>
                          <Badge type={getStatusColor(member.status)}>
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <div className="text-8px text-muted font-mono uppercase mb-0.5">
                              Plan
                            </div>
                            <span className="inline-flex px-2 py-0.5 bg-surface2 text-muted border border-border text-8px rounded font-mono">
                              {member.membership_type}
                            </span>
                          </div>
                          <div>
                            <div className="text-8px text-muted font-mono uppercase mb-0.5">
                              Days Left
                            </div>
                            <div className="font-semibold text-sm">
                              {member.daysUntilExpiry > 0 ? (
                                <span className="text-text">
                                  {member.daysUntilExpiry}d
                                </span>
                              ) : (
                                <span className="text-accent3">
                                  -{Math.abs(member.daysUntilExpiry)}d
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-8px text-muted font-mono mb-3">
                          {new Date(member.renewal_date).toLocaleDateString()}
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleSendReminder(member.id)}
                        >
                          Send Reminder
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
