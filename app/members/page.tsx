'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import type { Member } from '@/types/database';

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  join_date: string;
  membership_type: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'suspended';
  expiry_date: string;
}

export default function Members() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    email: '',
    phone: '',
    join_date: new Date().toISOString().split('T')[0],
    membership_type: 'basic',
    status: 'active',
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Check auth
  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, isAdmin, router]);

  // Fetch members
  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await fetch('/api/members');
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      setMembers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user && isAdmin) {
      fetchMembers();
    }
  }, [loading, user, isAdmin]);

  // Apply filters
  useEffect(() => {
    let filtered = members;

    if (planFilter !== 'all') {
      filtered = filtered.filter(m => m.membership_type === planFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }

    setFilteredMembers(filtered);
  }, [members, planFilter, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId ? `/api/members?id=${editingId}` : '/api/members';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Refresh members list
      await fetchMembers();
      setShowModal(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save member');
    }
  };

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      join_date: member.join_date,
      membership_type: member.membership_type,
      status: member.status,
      expiry_date: member.expiry_date,
    });
    setEditingId(member.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      setError('');
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      await fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete member');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      join_date: new Date().toISOString().split('T')[0],
      membership_type: 'basic',
      status: 'active',
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  const stats = [
    { value: filteredMembers.length, label: 'Total', color: 'accent' },
    { value: filteredMembers.filter(m => m.status === 'active').length, label: 'Active', color: 'success' },
    { value: filteredMembers.filter(m => m.status === 'inactive').length, label: 'Inactive', color: 'accent2' },
    { value: filteredMembers.filter(m => m.status === 'suspended').length, label: 'Suspended', color: 'accent2' },
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
                <select 
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-transparent border border-border rounded-lg text-8px sm:text-xs font-display text-muted hover:text-text transition-colors cursor-pointer"
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                >
                  <option value="all">All Plans</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
                <select 
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-transparent border border-border rounded-lg text-8px sm:text-xs font-display text-muted hover:text-text transition-colors cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <Button 
                  size="sm"
                  onClick={() => {
                    setEditingId(null);
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  + Add
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-accent2/10 border border-accent2/20 rounded-lg text-accent2 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Mini Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 border border-border rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="px-2 sm:px-3 md:px-4.5 py-2 sm:py-2.5 md:py-3.5 text-center border-r border-border last:border-r-0 md:border-b-0">
                  <div className={`font-bebas text-xl sm:text-2xl md:text-3xl tracking-tight leading-none ${stat.color === 'success' ? 'text-success' : stat.color === 'accent2' ? 'text-accent2' : 'text-accent'}`}>
                    {stat.value}
                  </div>
                  <div className="text-8px sm:text-9px md:text-10px text-muted font-mono uppercase tracking-tighter mt-0.5 sm:mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Members Table */}
            <Card title="All Members">
              {isLoading ? (
                <div className="py-8 text-center text-muted">Loading members...</div>
              ) : filteredMembers.length === 0 ? (
                <div className="py-8 text-center text-muted">No members found</div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Name</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Email</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Phone</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Plan</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Status</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Expiry</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-white/1.5 transition-colors">
                            <td className="py-3 px-4 border-b border-border/60 font-semibold">{member.name}</td>
                            <td className="py-3 px-4 border-b border-border/60 text-sm">{member.email}</td>
                            <td className="py-3 px-4 border-b border-border/60 text-sm">{member.phone}</td>
                            <td className="py-3 px-4 border-b border-border/60">
                              <Badge type={member.membership_type === 'basic' ? 'basic' : member.membership_type === 'premium' ? 'premium' : 'vip'}>
                                {member.membership_type.charAt(0).toUpperCase() + member.membership_type.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 border-b border-border/60">
                              <Badge type={member.status === 'active' ? 'active' : 'expiring'}>
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 border-b border-border/60 font-mono text-10px text-muted">{member.expiry_date}</td>
                            <td className="py-3 px-4 border-b border-border/60">
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEdit(member)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDelete(member.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {filteredMembers.map((member) => (
                      <div key={member.id} className="p-3 border border-border rounded-lg hover:bg-white/1.5 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="font-semibold text-sm">{member.name}</div>
                            <div className="text-9px text-muted">{member.email}</div>
                          </div>
                          <Badge type={member.status === 'active' ? 'active' : 'expiring'}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                            <div className="text-8px text-muted font-mono uppercase tracking-tighter">Plan</div>
                            <Badge type={member.membership_type === 'basic' ? 'basic' : 'premium'}>
                              {member.membership_type.charAt(0).toUpperCase() + member.membership_type.slice(1)}
                            </Badge>
                          </div>
                          <div>
                            <div className="text-8px text-muted font-mono uppercase tracking-tighter">Expiry</div>
                            <div className="text-9px font-mono text-text">{member.expiry_date}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEdit(member)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDelete(member.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bebas tracking-widest text-text mb-4">
              {editingId ? 'Edit Member' : 'Add New Member'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-display text-text mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-accent"
                  placeholder="Member name"
                />
              </div>

              <div>
                <label className="block text-sm font-display text-text mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-accent"
                  placeholder="member@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-display text-text mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:border-accent"
                  placeholder="+63 xxx xxx xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-display text-text mb-1">Membership Type</label>
                <select
                  value={formData.membership_type}
                  onChange={(e) => setFormData({ ...formData, membership_type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-display text-text mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-display text-text mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                >
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
