'use client';

import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';

export default function Members() {
  const miniStats = [
    { value: '248', label: 'Total', color: 'accent' },
    { value: '197', label: 'Active', color: 'success' },
    { value: '23', label: 'Expiring', color: 'accent' },
    { value: '28', label: 'Expired', color: 'accent2' },
    { value: '12', label: 'New This Month', color: 'accent3' },
  ];

  const members = [
    {
      name: 'Maria Santos',
      id: '#0241',
      avatar: 'MS',
      gradientFrom: '#e8ff47',
      gradientTo: '#b8cc00',
      plan: 'Basic',
      status: 'active',
      phone: '+63 917 123 4567',
      joined: 'Dec 10, 2024',
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
      phone: '+63 910 987 6543',
      joined: 'Nov 15, 2024',
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
      phone: '+63 908 765 4321',
      joined: 'Oct 22, 2024',
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
      phone: '+63 920 456 7890',
      joined: 'Dec 28, 2024',
      expiry: 'Dec 28, 2026',
      attendance: 60,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="MEMBER MANAGEMENT" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">

        <div className="p-3 sm:p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text">Member Management</h2>
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <select className="px-2 sm:px-3 py-1.5 sm:py-2 bg-transparent border border-border rounded-lg text-8px sm:text-xs font-display text-muted hover:text-text transition-colors cursor-pointer">
                <option>All Plans</option>
                <option>Basic</option>
                <option>Premium</option>
                <option>VIP</option>
              </select>
              <select className="px-2 sm:px-3 py-1.5 sm:py-2 bg-transparent border border-border rounded-lg text-8px sm:text-xs font-display text-muted hover:text-text transition-colors cursor-pointer">
                <option>All Status</option>
                <option>Active</option>
                <option>Expiring</option>
                <option>Expired</option>
              </select>
              <Button size="sm">+ Add</Button>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3 border border-border rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-6">
            {miniStats.map((stat, idx) => (
              <div key={idx} className="px-2 sm:px-3 md:px-4.5 py-2 sm:py-2.5 md:py-3.5 text-center border-r border-border last:border-r-0 md:border-b-0">
                <div className={`font-bebas text-xl sm:text-2xl md:text-3xl tracking-tight leading-none ${stat.color === 'success' ? 'text-success' : stat.color === 'accent2' ? 'text-accent2' : stat.color === 'accent3' ? 'text-accent3' : 'text-accent'}`}>
                  {stat.value}
                </div>
                <div className="text-8px sm:text-9px md:text-10px text-muted font-mono uppercase tracking-tighter mt-0.5 sm:mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Members Table / Card View */}
          <Card
            title="All Members"
            action={
              <Button variant="ghost" size="sm">
                ↓ CSV
              </Button>
            }
          >
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Member</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Plan</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Status</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Phone</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Joined</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Expiry</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Attendance</th>
                    <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, idx) => (
                    <tr key={idx} className="hover:bg-white/1.5 transition-colors">
                      <td className="py-3 px-4 border-b border-border/60">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7.5 h-7.5 rounded-full flex items-center justify-center font-bold text-xs text-black flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})`,
                            }}
                          >
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{member.name}</div>
                            <div className="text-10px text-muted">ID {member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-border/60">
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
                      <td className="py-3 px-4 border-b border-border/60">
                        <Badge type={member.status === 'active' ? 'active' : 'expiring'}>
                          {member.status === 'active' ? 'Active' : 'Expiring'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 border-b border-border/60 text-sm">{member.phone}</td>
                      <td className="py-3 px-4 border-b border-border/60 text-sm">{member.joined}</td>
                      <td className="py-3 px-4 border-b border-border/60 font-mono text-10px text-muted">{member.expiry}</td>
                      <td className="py-3 px-4 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-surface2 rounded-full overflow-hidden flex-shrink-0">
                            <div
                              className={`h-full rounded-full ${member.attendance >= 70 ? 'bg-accent' : member.attendance >= 50 ? 'bg-accent3' : 'bg-accent2'}`}
                              style={{ width: `${member.attendance}%` }}
                            ></div>
                          </div>
                          <span className="text-10px text-muted">{member.attendance}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-border/60">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {members.map((member, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg hover:bg-white/1.5 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-black flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})`,
                        }}
                      >
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{member.name}</div>
                        <div className="text-9px text-muted">ID {member.id}</div>
                      </div>
                    </div>
                    <Badge type={member.status === 'active' ? 'active' : 'expiring'}>
                      {member.status === 'active' ? 'Active' : 'Exp'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-8px text-muted font-mono uppercase tracking-tighter">Plan</div>
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
                    </div>
                    <div>
                      <div className="text-8px text-muted font-mono uppercase tracking-tighter">Expiry</div>
                      <div className="text-9px font-mono text-text">{member.expiry}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-8px text-muted font-mono uppercase tracking-tighter mb-1">Attendance</div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-surface2 rounded-full overflow-hidden flex-shrink-0">
                        <div
                          className={`h-full rounded-full ${member.attendance >= 70 ? 'bg-accent' : member.attendance >= 50 ? 'bg-accent3' : 'bg-accent2'}`}
                          style={{ width: `${member.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-9px text-muted">{member.attendance}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      View
                    </Button>
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
