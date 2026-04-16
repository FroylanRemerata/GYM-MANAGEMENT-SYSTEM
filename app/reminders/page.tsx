'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

export default function Reminders() {
  const router = useRouter();
  const { user, loading, isSuperAdmin, authToken } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'renewal' | 'inactive' | 'low-stock' | 'promotion'>('renewal');
  const [isLoading, setIsLoading] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [dryRun, setDryRun] = useState(true);

  // Promotion form state
  const [promotionData, setPromotionData] = useState({
    title: '',
    details: '',
    expiresOn: '',
    allMembers: true,
  });

  useEffect(() => {
    if (!loading) {
      if (!user || !isSuperAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, isSuperAdmin, router]);

  const fetchMemberCount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reminders/${activeTab}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setMemberCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching member count:', error);
    }
  };

  useEffect(() => {
    if (authToken && activeTab) {
      fetchMemberCount();
    }
  }, [activeTab, authToken]);

  const handleSendReminders = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === 'renewal' ? 'renewal' : activeTab === 'inactive' ? 'inactive' : 'low-stock';
      
      let body: any = { dryRun };
      
      if (activeTab === 'renewal') {
        body.daysUntilExpiry = 7;
      } else if (activeTab === 'inactive') {
        body.inactiveDays = 30;
      } else if (activeTab === 'low-stock') {
        body.staffEmails = [user?.email || ''];
        body.threshold = 50;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reminders/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✓ ${data.message}\nSent: ${data.sent}, Failed: ${data.failed}, Total: ${data.total}`);
      } else {
        alert(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Failed to send reminders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPromotion = async () => {
    if (!promotionData.title || !promotionData.details || !promotionData.expiresOn) {
      alert('Please fill in all promotion details');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reminders/promotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          promotionTitle: promotionData.title,
          promotionDetails: promotionData.details,
          expiresOn: promotionData.expiresOn,
          allMembers: promotionData.allMembers,
          dryRun,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✓ ${data.message}\nSent: ${data.sent}, Failed: ${data.failed}`);
        setPromotionData({ title: '', details: '', expiresOn: '', allMembers: true });
        setShowModal(false);
      } else {
        alert(`✗ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending promotion:', error);
      alert('Failed to send promotion');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user || !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="REMINDERS & NOTIFICATIONS" />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">
          <div className="p-3 sm:p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text mb-4">
                Reminders & Notifications
              </h2>
              <p className="text-muted text-sm">Manage member renewal reminders, inactive alerts, low-stock notifications, and promotions</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {(['renewal', 'inactive', 'low-stock', 'promotion'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded font-mono text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-accent text-black'
                      : 'bg-surface2 border border-border text-text hover:border-accent'
                  }`}
                >
                  {tab === 'renewal' && '📅 Renewal'}
                  {tab === 'inactive' && '😴 Inactive'}
                  {tab === 'low-stock' && '📦 Low Stock'}
                  {tab === 'promotion' && '🎉 Promotion'}
                </button>
              ))}
            </div>

            {/* Dry Run Toggle */}
            <Card className="mb-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="dryRun"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="dryRun" className="cursor-pointer text-sm">
                  <strong>Dry Run Mode</strong> - Preview without sending actual emails
                </label>
              </div>
            </Card>

            {/* Content by Tab */}
            {activeTab === 'renewal' && (
              <Card title="Renewal Reminders" subtitle="Send membership renewal notifications">
                <div className="space-y-4">
                  <div className="text-sm text-muted">
                    <p className="mb-2">This will send renewal reminder emails to members whose memberships expire within the next 7 days.</p>
                    <p className="font-mono text-8px text-muted uppercase">Members to notify: <strong className="text-accent">{memberCount}</strong></p>
                  </div>
                  <Button
                    onClick={handleSendReminders}
                    disabled={isLoading || memberCount === 0}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : `Send Renewal Reminders (${memberCount} members)`}
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'inactive' && (
              <Card title="Inactive Member Alerts" subtitle="Re-engage members who haven't visited recently">
                <div className="space-y-4">
                  <div className="text-sm text-muted">
                    <p className="mb-2">This will send engagement emails to members who haven't attended in the last 30 days.</p>
                    <p className="font-mono text-8px text-muted uppercase">Members to notify: <strong className="text-accent">{memberCount}</strong></p>
                  </div>
                  <Button
                    onClick={handleSendReminders}
                    disabled={isLoading || memberCount === 0}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : `Send Inactive Alerts (${memberCount} members)`}
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'low-stock' && (
              <Card title="Low Stock Alerts" subtitle="Notify staff about inventory running low">
                <div className="space-y-4">
                  <div className="text-sm text-muted">
                    <p className="mb-2">This will send low-stock notifications to staff for items below the reorder level.</p>
                    <p className="font-mono text-8px text-muted uppercase">Items to report: <strong className="text-accent">{memberCount}</strong></p>
                  </div>
                  <Button
                    onClick={handleSendReminders}
                    disabled={isLoading || memberCount === 0}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : `Send Low-Stock Alerts (${memberCount} items)`}
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'promotion' && (
              <div className="space-y-4">
                <Card title="Send Promotion" subtitle="Create and send special offers to members">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="promotionTitle" className="block text-sm font-mono text-muted mb-1 uppercase">Promotion Title</label>
                      <input
                        id="promotionTitle"
                        name="promotionTitle"
                        type="text"
                        value={promotionData.title}
                        onChange={(e) => setPromotionData({ ...promotionData, title: e.target.value })}
                        placeholder="e.g., Spring Membership Special"
                        className="w-full px-3 py-2 border border-border rounded bg-surface text-text text-sm focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="promotionDetails" className="block text-sm font-mono text-muted mb-1 uppercase">Promotion Details</label>
                      <textarea
                        id="promotionDetails"
                        name="promotionDetails"
                        value={promotionData.details}
                        onChange={(e) => setPromotionData({ ...promotionData, details: e.target.value })}
                        placeholder="e.g., Get 20% off on annual memberships this month only!"
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded bg-surface text-text text-sm focus:outline-none focus:border-accent resize-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="expiresOn" className="block text-sm font-mono text-muted mb-1 uppercase">Expires On</label>
                      <input
                        id="expiresOn"
                        name="expiresOn"
                        type="date"
                        value={promotionData.expiresOn}
                        onChange={(e) => setPromotionData({ ...promotionData, expiresOn: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded bg-surface text-text text-sm focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="allMembers"
                        checked={promotionData.allMembers}
                        onChange={(e) => setPromotionData({ ...promotionData, allMembers: e.target.checked })}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="allMembers" className="cursor-pointer text-sm">
                        Send to all active members
                      </label>
                    </div>

                    <Button
                      onClick={handleSendPromotion}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Sending...' : 'Send Promotion'}
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Info Box */}
            <Card className="mt-6 bg-accent/10 border-accent/30">
              <div className="text-sm">
                <p className="font-semibold text-accent mb-2">💡 Tips:</p>
                <ul className="space-y-1 text-muted text-8px">
                  <li>• Use Dry Run mode to preview before sending actual emails</li>
                  <li>• Ensure valid email configuration in .env.local (RESEND_API_KEY)</li>
                  <li>• All reminders are logged for audit purposes</li>
                  <li>• Staff alerts are sent to the admin's email address</li>
                </ul>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

