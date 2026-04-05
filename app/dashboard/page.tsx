'use client';

import StatCard from '@/components/StatCard';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function Dashboard() {
  const stats = [
    {
      label: 'Total Members',
      value: '248',
      change: '12 this month',
      changeType: 'up' as const,
      color: 'yellow' as const,
    },
    {
      label: 'Active Plans',
      value: '197',
      change: '8 from last month',
      changeType: 'up' as const,
      color: 'green' as const,
    },
    {
      label: 'Expiring Soon',
      value: '23',
      change: 'within 7 days',
      changeType: 'down' as const,
      color: 'red' as const,
    },
    {
      label: 'Monthly Revenue',
      value: '₱98K',
      change: '14% vs last month',
      changeType: 'up' as const,
      color: 'blue' as const,
    },
  ];

  const memberTableData = [
    {
      name: 'Maria Santos',
      id: '#0241',
      avatar: 'MS',
      gradientFrom: '#e8ff47',
      gradientTo: '#b8cc00',
      plan: 'Basic',
      status: 'active',
      expiry: 'Jan 31, 2026',
      attendance: 85,
    },
    {
      name: 'Carlo Reyes',
      id: '#0238',
      avatar: 'CR',
      gradientFrom: '#47c4ff',
      gradientTo: '#0080aa',
      plan: 'Premium',
      status: 'active',
      expiry: 'Feb 14, 2026',
      attendance: 70,
    },
    {
      name: 'Ana Lim',
      id: '#0235',
      avatar: 'AL',
      gradientFrom: '#ff9999',
      gradientTo: '#cc4444',
      plan: 'Premium',
      status: 'expiring',
      expiry: 'Jan 03, 2026',
      attendance: 30,
    },
    {
      name: 'Derek Cruz',
      id: '#0248',
      avatar: 'DC',
      gradientFrom: '#47ff9b',
      gradientTo: '#00aa55',
      plan: 'VIP',
      status: 'active',
      expiry: 'Dec 28, 2026',
      attendance: 60,
    },
  ];

  const activityItems = [
    {
      name: 'Maria Santos',
      action: 'checked in',
      time: '2 mins ago',
      detail: 'Basic Plan',
      dot: 'green',
    },
    {
      name: 'Carlo Reyes',
      action: 'renewed Premium plan',
      time: '14 mins ago',
      detail: '₱2,500',
      dot: 'yellow',
    },
    {
      name: 'Ana Lim',
      action: 'plan expires in 2 days',
      time: 'AI Alert · Reminder sent',
      detail: '',
      dot: 'red',
    },
    {
      name: 'Derek Cruz',
      action: 'New VIP member registered',
      time: '1 hr ago',
      detail: '₱5,000',
      dot: 'blue',
    },
  ];

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
                <span className="font-bebas text-2xl sm:text-3xl md:text-4xl text-accent">₱98,450</span>
                <span className="text-9px sm:text-10px text-success ml-2">↑ 14% vs March</span>
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
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#e8ff47" strokeWidth="4" strokeDasharray="44 56" strokeDashoffset="25" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#47c4ff" strokeWidth="4" strokeDasharray="32 68" strokeDashoffset="-19" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#ff4747" strokeWidth="4" strokeDasharray="12 88" strokeDashoffset="-51" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="font-bebas text-lg sm:text-2xl text-text">248</div>
                      <div className="text-8px text-muted">TOTAL</div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 justify-center">
                    <div className="flex items-center gap-2 text-9px sm:text-xs">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent flex-shrink-0"></div>
                      <span>Basic — 44%</span>
                    </div>
                    <div className="flex items-center gap-2 text-9px sm:text-xs">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent3 flex-shrink-0"></div>
                      <span>Premium — 32%</span>
                    </div>
                    <div className="flex items-center gap-2 text-9px sm:text-xs">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent2 flex-shrink-0"></div>
                      <span>VIP — 12%</span>
                    </div>
                    <div className="flex items-center gap-2 text-9px sm:text-xs">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-muted flex-shrink-0"></div>
                      <span>Walk-in — 12%</span>
                    </div>
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
