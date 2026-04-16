'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface DashboardData {
  stats: {
    totalMembers: number;
    activeMembers: number;
    expiringMembers: number;
    monthlyRevenue: number;
  };
  recentMembers: any[];
  recentActivity: any[];
  planDistribution: Record<string, number>;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login');
      } else {
        // Fetch dashboard data
        fetchDashboardData();
      }
    }
  }, [user, loading, isAdmin, router]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch('/api/dashboard/live-stats');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  const stats = [
    {
      label: 'Total Members',
      value: (data?.stats.totalMembers || 0).toString(),
      change: `${Math.max(0, data?.stats.totalMembers ? Math.floor(data.stats.totalMembers * 0.05) : 0)} this month`,
      changeType: 'up' as const,
      color: 'yellow' as const,
    },
    {
      label: 'Active Plans',
      value: (data?.stats.activeMembers || 0).toString(),
      change: `${data?.stats.activeMembers || 0} active members`,
      changeType: 'up' as const,
      color: 'green' as const,
    },
    {
      label: 'Expiring Soon',
      value: (data?.stats.expiringMembers || 0).toString(),
      change: 'within 7 days',
      changeType: (data?.stats.expiringMembers && data.stats.expiringMembers > 5 ? 'down' : 'up') as 'up' | 'down',
      color: 'red' as const,
    },
    {
      label: 'Monthly Revenue',
      value: `₱${(data?.stats.monthlyRevenue || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`,
      change: `Total this month`,
      changeType: 'up' as const,
      color: 'blue' as const,
    },
  ];

  const memberTableData = (data?.recentMembers || []).map((member: any) => {
    const initials = (member.name || 'N/A')
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
    const colors = ['#e8ff47', '#47c4ff', '#ff9999', '#47ff9b', '#ffb347'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return {
      name: member.name || 'Unknown',
      id: member.id?.slice(0, 4).toUpperCase() || '#0000',
      avatar: initials,
      gradientFrom: randomColor,
      gradientTo: randomColor,
      plan: member.membership_type?.charAt(0).toUpperCase() + (member.membership_type?.slice(1) || ''),
      status: member.renewal_date && new Date(member.renewal_date) > new Date() ? 'active' : 'expiring',
      expiry: new Date(member.renewal_date || new Date()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      attendance: Math.floor(Math.random() * 100),
    };
  });

  const activityItems = (data?.recentActivity || []).map((activity: any) => ({
    name: activity.members?.name || 'Unknown Member',
    action: 'checked in',
    time: new Date(activity.attended_at).toLocaleTimeString(),
    detail: 'Attended',
    dot: 'green',
  })).slice(0, 5);

  // Calculate plan distribution percentages
  const planStats = Object.entries(data?.planDistribution || {}).map(([plan, count]: [string, any]) => ({
    plan: plan.charAt(0).toUpperCase() + plan.slice(1),
    count,
    percentage: Math.round((count / (data?.stats.totalMembers || 1)) * 100),
  }));

  const planColors = ['#e8ff47', '#47c4ff', '#ff4747', '#47ff9b', '#ffb347'];

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="DASHBOARD" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">

        {/* Main Content */}
        <div className="p-3 sm:p-4 md:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-7">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-1.4fr-1fr gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5">
            {/* Revenue Chart Card */}
            <Card
              title="Monthly Revenue"
              subtitle="2025 · Membership + Walk-in fees"
              action={<Badge type="active">LIVE</Badge>}
            >
              <div className="mb-3.5">
                <span className="font-bebas text-2xl sm:text-3xl md:text-4xl text-accent">₱{(data?.stats.monthlyRevenue || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                <span className="text-9px sm:text-10px text-success ml-2">↑ Current month</span>
              </div>
              {/* Bar Chart */}
              <div className="flex items-end gap-1 sm:gap-1.5 h-20 sm:h-24 px-0.5 sm:px-1 overflow-x-auto">
                {[40, 55, 48, 62, 70, 58, 75, 80, 68, 85, 78, 100].map((height, idx) => (
                  <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center gap-0.5">
                    <div
                      className={`w-full rounded-t transition-all cursor-pointer ${
                        idx === 11 ? 'bg-accent border-accent' : 'bg-accent/15 border border-accent/20'
                      }`}
                      style={{ height: `${height * 2}px` }}
                    ></div>
                    <span className={`font-mono text-7px sm:text-8px ${idx === 11 ? 'text-accent' : 'text-muted'}`}>
                      {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right Column */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
              {/* Plan Distribution */}
              <Card title="Plan Distribution">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                  {/* Donut Chart SVG */}
                  <div className="relative w-20 sm:w-24 h-20 sm:h-24 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#18181f" strokeWidth="4" />
                      {planStats.map((stat: any, idx: number) => {
                        const circumference = 88;
                        const offset = circumference * (1 - stat.percentage / 100);
                        let dashOffsetValue = -offset;
                        
                        if (idx > 0) {
                          dashOffsetValue = dashOffsetValue - planStats.slice(0, idx).reduce((sum: number, s: any) => {
                            return sum - (circumference * (1 - s.percentage / 100));
                          }, 0);
                        }

                        return (
                          <circle
                            key={idx}
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke={planColors[idx]}
                            strokeWidth="4"
                            strokeDasharray={`${circumference * (stat.percentage / 100)} ${circumference}`}
                            strokeDashoffset={dashOffsetValue}
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="font-bebas text-lg sm:text-2xl text-text">{data?.stats.totalMembers || 0}</div>
                      <div className="text-8px text-muted">TOTAL</div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 justify-center">
                    {planStats.map((stat: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-9px sm:text-xs">
                        <div
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: planColors[idx] }}
                        ></div>
                        <span>{stat.plan} — {stat.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Live Activity */}
              <Card title="Live Activity" action={<div className="w-2 h-2 bg-accent2 rounded-full animate-pulse"></div>} className="flex-1">
                <div className="space-y-0 max-h-48 sm:max-h-64 overflow-y-auto">
                  {activityItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3 py-2 sm:py-2.75 px-2 -mx-2 border-b border-border/40 last:border-b-0 hover:bg-white/5 rounded">
                      <div
                        className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                          item.dot === 'green'
                            ? 'bg-success shadow-lg shadow-success/50'
                            : item.dot === 'yellow'
                              ? 'bg-accent shadow-lg shadow-accent/50'
                              : item.dot === 'red'
                                ? 'bg-accent2 shadow-lg shadow-accent2/50'
                                : 'bg-accent3 shadow-lg shadow-accent3/50'
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-9px sm:text-xs leading-tight">
                          <strong className="break-words">{item.name}</strong> {item.action}
                        </div>
                        <div className="text-8px text-muted mt-0.5">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Members Table */}
          <Card
            title="Recent Members"
            action={
              <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-transparent border border-border text-muted text-9px sm:text-xs font-semibold rounded-lg hover:text-text hover:border-muted transition-all">
                View All
              </button>
            }
          >
            <div className="overflow-x-auto -mx-5 px-4 sm:mx-0 sm:px-0">
              <table className="w-full border-collapse text-9px sm:text-sm">
                <thead>
                  <tr>
                    <th className="text-left font-mono text-8px sm:text-9px text-muted uppercase tracking-widest pb-2 sm:pb-3 px-1 sm:px-4 border-b border-border whitespace-nowrap">Member</th>
                    <th className="text-left font-mono text-8px sm:text-9px text-muted uppercase tracking-widest pb-2 sm:pb-3 px-1 sm:px-4 border-b border-border whitespace-nowrap">Plan</th>
                    <th className="text-left font-mono text-8px sm:text-9px text-muted uppercase tracking-widest pb-2 sm:pb-3 px-1 sm:px-4 border-b border-border whitespace-nowrap">Status</th>
                    <th className="text-left font-mono text-8px sm:text-9px text-muted uppercase tracking-widest pb-2 sm:pb-3 px-1 sm:px-4 border-b border-border whitespace-nowrap">Expiry</th>
                    <th className="text-left font-mono text-8px sm:text-9px text-muted uppercase tracking-widest pb-2 sm:pb-3 px-1 sm:px-4 border-b border-border whitespace-nowrap">Attend</th>
                    <th className="text-left font-mono text-8px sm:text-9px text-muted uppercase tracking-widest pb-2 sm:pb-3 px-1 sm:px-4 border-b border-border whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {memberTableData.map((member, idx) => (
                    <tr key={idx} className="hover:bg-white/1.5 transition-colors">
                      <td className="py-2 sm:py-3 px-1 sm:px-4 border-b border-border/60">
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                          <div
                            className="w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center font-bold text-8px sm:text-xs text-black flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})`,
                            }}
                          >
                            {member.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-9px sm:text-sm truncate">{member.name}</div>
                            <div className="text-8px text-muted truncate">ID {member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-4 border-b border-border/60">
                        <Badge
                          type={
                            member.plan === 'Basic'
                              ? 'basic'
                              : member.plan === 'Premium'
                                ? 'premium'
                                : 'vip'
                          }
                        >
                          {member.plan}
                        </Badge>
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-4 border-b border-border/60">
                        <Badge type={member.status === 'active' ? 'active' : 'expiring'}>
                          {member.status === 'active' ? 'Active' : 'Exp'}
                        </Badge>
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-4 border-b border-border/60 font-mono text-8px sm:text-10px text-muted whitespace-nowrap">{member.expiry}</td>
                      <td className="py-2 sm:py-3 px-1 sm:px-4 border-b border-border/60">
                        <span className="text-8px sm:text-10px text-muted">{member.attendance}%</span>
                      </td>
                      <td className="py-2 sm:py-3 px-1 sm:px-4 border-b border-border/60">
                        <button className="px-2 py-1 bg-transparent border border-border text-muted text-8px sm:text-xs font-semibold rounded-lg hover:text-text hover:border-muted transition-all whitespace-nowrap">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        </main>
      </div>
    </div>
  );
}
