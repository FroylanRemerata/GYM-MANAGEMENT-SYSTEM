'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';

export default function Settings() {
  const router = useRouter();
  const { user, loading, isSuperAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isSuperAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, isSuperAdmin, router]);

  if (loading || !user || !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  const systemSettings = [
    {
      category: 'Gym Information',
      settings: [
        { key: 'gymName', label: 'Gym Name', value: 'Astral Gym', type: 'text' },
        { key: 'gymEmail', label: 'Gym Email', value: 'info@astralgym.com', type: 'email' },
        { key: 'gymPhone', label: 'Gym Phone', value: '+63 xxx xxxx xxx', type: 'tel' },
        { key: 'gymAddress', label: 'Gym Address', value: 'Manila, Philippines', type: 'text' },
      ],
    },
    {
      category: 'Membership',
      settings: [
        { key: 'basicPrice', label: 'Basic Plan Price (₱)', value: '1500', type: 'number' },
        { key: 'premiumPrice', label: 'Premium Plan Price (₱)', value: '2500', type: 'number' },
        { key: 'vipPrice', label: 'VIP Plan Price (₱)', value: '5000', type: 'number' },
        { key: 'renewalDays', label: 'Renewal Reminder (days)', value: '7', type: 'number' },
      ],
    },
    {
      category: 'System',
      settings: [
        { key: 'maintenanceMode', label: 'Maintenance Mode', value: 'Off', type: 'toggle' },
        { key: 'autoBackup', label: 'Auto Backup', value: 'Daily 2:00 AM', type: 'text' },
        { key: 'sessionTimeout', label: 'Session Timeout (minutes)', value: '30', type: 'number' },
      ],
    },
  ];

  const recentActivity = [
    { timestamp: '2026-04-15 14:23', action: 'Member Created', user: 'admin@gym.com', target: 'John Doe' },
    { timestamp: '2026-04-15 13:15', action: 'Transaction Updated', user: 'admin@gym.com', target: 'Transaction #234' },
    { timestamp: '2026-04-15 12:00', action: 'Member Deleted', user: 'super@gym.com', target: 'Jane Smith' },
    { timestamp: '2026-04-14 09:45', action: 'Setting Changed', user: 'super@gym.com', target: 'Basic Plan Price' },
    { timestamp: '2026-04-14 08:30', action: 'Admin Login', user: 'super@gym.com', target: '-' },
  ];

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="SETTINGS" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">
          <div className="p-3 sm:p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text">System Settings</h2>
              <p className="text-muted text-sm mt-2">Super Admin Access Only - Manage system configuration and permissions</p>
            </div>

            {/* User Info Card */}
            <Card title="Your Account" className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-display text-muted uppercase tracking-tighter">Email</div>
                  <div className="text-text font-semibold mt-1">{user.email}</div>
                </div>
                <div>
                  <div className="text-sm font-display text-muted uppercase tracking-tighter">Role</div>
                  <div className="mt-1">
                    <Badge type="premium">Super Admin</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-display text-muted uppercase tracking-tighter">User ID</div>
                  <div className="text-text font-mono text-sm mt-1">{user.id.slice(0, 12)}...</div>
                </div>
                <div>
                  <div className="text-sm font-display text-muted uppercase tracking-tighter">Access Level</div>
                  <div className="text-accent font-semibold mt-1">Full System Access</div>
                </div>
              </div>
            </Card>

            {/* System Settings */}
            {systemSettings.map((section, idx) => (
              <Card key={idx} title={section.category} className="mb-6">
                <div className="space-y-4">
                  {section.settings.map((setting, sidx) => (
                    <div key={sidx} className="flex items-center justify-between pb-4 border-b border-border last:border-b-0 last:pb-0">
                      <div>
                        <div className="text-sm font-display text-text">{setting.label}</div>
                        <div className="text-9px text-muted mt-0.5">{setting.category}</div>
                      </div>
                      {setting.type === 'toggle' ? (
                        <input
                          type="checkbox"
                          defaultChecked={setting.value === 'On'}
                          className="w-5 h-5 rounded border-border bg-surface2 cursor-pointer"
                        />
                      ) : (
                        <input
                          type={setting.type}
                          defaultValue={setting.value}
                          disabled
                          className="px-3 py-1.5 bg-surface2 border border-border rounded text-text text-sm w-32 text-right opacity-60"
                        />
                      )}
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <Button size="sm">Save Changes</Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Security & Permissions */}
            <Card title="Security & Permissions" className="mb-6">
              <div className="space-y-4">
                <div className="p-4 bg-surface2 rounded-lg border border-border">
                  <h4 className="text-sm font-display text-text mb-3">Super Admin Permissions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-text">Manage all members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-text">Delete members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-text">Manage transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-text">Delete transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-text">Manage admin users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-text">Access audit logs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-text">System settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      <span className="text-sm text-text">View audit logs</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface2 rounded-lg border border-border">
                  <h4 className="text-sm font-display text-text mb-2">Admin Permissions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                      <span className="text-sm text-text">Create members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                      <span className="text-sm text-text">Edit members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent2 rounded-full"></div>
                      <span className="text-sm text-text">Delete members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                      <span className="text-sm text-text">View transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent2 rounded-full"></div>
                      <span className="text-sm text-text">Access settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-accent2 rounded-full"></div>
                      <span className="text-sm text-text">View audit logs</span>
                    </div>
                  </div>
                  <div className="text-9px text-muted mt-3">Green = Allowed | Red = Denied</div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity Log">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-3 border-b border-border">Timestamp</th>
                      <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-3 border-b border-border">Action</th>
                      <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-3 border-b border-border">User</th>
                      <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-3 border-b border-border">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity, idx) => (
                      <tr key={idx} className="hover:bg-white/1.5 transition-colors">
                        <td className="py-3 px-3 border-b border-border/60 font-mono text-10px text-muted">{activity.timestamp}</td>
                        <td className="py-3 px-3 border-b border-border/60 text-sm">
                          <Badge type={
                            activity.action.includes('Deleted') ? 'expiring' : 'active'
                          }>
                            {activity.action}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 border-b border-border/60 text-sm">{activity.user}</td>
                        <td className="py-3 px-3 border-b border-border/60 text-sm">{activity.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm">View Full Audit Log</Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
