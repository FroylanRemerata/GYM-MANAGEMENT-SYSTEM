'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import type { InventoryItem } from '@/types/database';

interface InventoryFormData {
  name: string;
  category: 'water' | 'sports_drink' | 'juice' | 'energy_drink' | 'other';
  quantity: number;
  unit_price: number;
  supplier: string;
  reorder_level: number;
  expiry_date: string;
}

export default function Inventory() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<'sale' | 'restock' | 'adjustment' | 'damage'>('sale');
  const [transactionQty, setTransactionQty] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    category: 'water',
    quantity: 0,
    unit_price: 0,
    supplier: '',
    reorder_level: 5,
    expiry_date: '',
  });

  // Check auth
  useEffect(() => {
    if (!loading) {
      if (!user || !isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, isAdmin, router]);

  // Fetch items
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await fetch('/api/inventory');
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user && isAdmin) {
      fetchItems();
    }
  }, [loading, user, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId ? `/api/inventory?id=${editingId}` : '/api/inventory';
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

      await fetchItems();
      setShowModal(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit_price: item.unit_price,
      supplier: item.supplier,
      reorder_level: item.reorder_level,
      expiry_date: item.expiry_date || '',
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setError('');
      const res = await fetch(`/api/inventory?id=${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedItem || !transactionQty) {
      setError('Please select an item and enter quantity');
      return;
    }

    try {
      const res = await fetch('/api/inventory/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory_item_id: selectedItem,
          transaction_type: transactionType,
          quantity: parseInt(transactionQty),
          notes: transactionNotes,
          created_by: user?.email || 'system',
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      await fetchItems();
      setSelectedItem('');
      setTransactionQty('');
      setTransactionNotes('');
      setTransactionType('sale');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record transaction');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'water',
      quantity: 0,
      unit_price: 0,
      supplier: '',
      reorder_level: 5,
      expiry_date: '',
    });
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text">Loading...</div>
      </div>
    );
  }

  const lowStockItems = items.filter(item => item.quantity <= item.reorder_level);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  // Helper function to get days until expiry
  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Helper function to get expiry status
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const days = getDaysUntilExpiry(expiryDate);
    if (!days) return null;
    if (days < 0) return 'expired';
    if (days <= 7) return 'expiring-soon';
    if (days <= 30) return 'expiring';
    return 'ok';
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Unit Price', 'Total Value', 'Supplier', 'Reorder Level', 'Expiry Date', 'Days Until Expiry'];
    const rows = items.map(item => [
      item.name,
      item.category.replace('_', ' '),
      item.quantity,
      item.unit_price.toFixed(2),
      (item.quantity * item.unit_price).toFixed(2),
      item.supplier || 'N/A',
      item.reorder_level,
      item.expiry_date || 'N/A',
      item.expiry_date ? getDaysUntilExpiry(item.expiry_date) : 'N/A'
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="INVENTORY MANAGEMENT" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">
          <div className="p-3 sm:p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text">Drink Inventory</h2>
              <div className="flex gap-2 ml-auto">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/inventory/reports')}
                >
                  📊 Reports
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                >
                  ↓ Export CSV
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setEditingId(null);
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  + Add Item
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-accent2/10 border border-accent2/20 rounded-lg text-accent2 text-sm mb-4">
                {error}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6">
              <Card title="Total Items">
                <div className="text-3xl font-bebas text-accent">{items.length}</div>
              </Card>
              <Card title="Low Stock Items">
                <div className="text-3xl font-bebas text-accent2">{lowStockItems.length}</div>
              </Card>
              <Card title="Inventory Value">
                <div className="text-2xl font-bebas text-success">₱{totalValue.toFixed(2)}</div>
              </Card>
            </div>

            {/* Transaction Form */}
            <Card title="Record Transaction" className="mb-6">
              <form onSubmit={handleTransaction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-display text-text mb-1">Item</label>
                    <select
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    >
                      <option value="">Select item...</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Qty: {item.quantity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-display text-text mb-1">Type</label>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    >
                      <option value="sale">Sale</option>
                      <option value="restock">Restock</option>
                      <option value="adjustment">Adjustment</option>
                      <option value="damage">Damage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-display text-text mb-1">Quantity</label>
                    <input
                      type="number"
                      value={transactionQty}
                      onChange={(e) => setTransactionQty(e.target.value)}
                      min="1"
                      className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-display text-text mb-1">Notes</label>
                  <input
                    type="text"
                    value={transactionNotes}
                    onChange={(e) => setTransactionNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                    placeholder="Optional notes..."
                  />
                </div>

                <Button type="submit">Record Transaction</Button>
              </form>
            </Card>

            {/* Inventory Items Table */}
            <Card title="Inventory Items">
              {isLoading ? (
                <div className="py-8 text-center text-muted">Loading inventory...</div>
              ) : items.length === 0 ? (
                <div className="py-8 text-center text-muted">No items in inventory</div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Name</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Category</th>
                          <th className="text-right font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Quantity</th>
                          <th className="text-right font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Price</th>
                          <th className="text-right font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Value</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Supplier</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Expiry</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Status</th>
                          <th className="text-left font-mono text-9px text-muted uppercase tracking-widest pb-3 px-4 border-b border-border sticky top-0 bg-surface">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => {
                          const isLowStock = item.quantity <= item.reorder_level;
                          const expiryStatus = getExpiryStatus(item.expiry_date);
                          const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
                          return (
                            <tr key={item.id} className={`hover:bg-white/1.5 transition-colors ${isLowStock ? 'bg-accent2/5' : ''} ${expiryStatus === 'expired' ? 'bg-accent/10' : expiryStatus === 'expiring-soon' ? 'bg-accent2/10' : ''}`}>
                              <td className="py-3 px-4 border-b border-border/60 font-semibold">{item.name}</td>
                              <td className="py-3 px-4 border-b border-border/60 text-sm capitalize">{item.category.replace('_', ' ')}</td>
                              <td className="py-3 px-4 border-b border-border/60 text-right font-mono">{item.quantity}</td>
                              <td className="py-3 px-4 border-b border-border/60 text-right font-mono">₱{item.unit_price.toFixed(2)}</td>
                              <td className="py-3 px-4 border-b border-border/60 text-right font-semibold">₱{(item.quantity * item.unit_price).toFixed(2)}</td>
                              <td className="py-3 px-4 border-b border-border/60 text-sm">{item.supplier}</td>
                              <td className="py-3 px-4 border-b border-border/60 text-sm">
                                {item.expiry_date ? (
                                  <div>
                                    <div className="font-mono text-10px">{item.expiry_date}</div>
                                    <div className={`text-9px font-semibold ${
                                      expiryStatus === 'expired' ? 'text-accent' :
                                      expiryStatus === 'expiring-soon' ? 'text-accent2' :
                                      expiryStatus === 'expiring' ? 'text-accent3' : 'text-success'
                                    }`}>
                                      {daysUntilExpiry === 0 ? 'Today' : 
                                       daysUntilExpiry && daysUntilExpiry < 0 ? `${Math.abs(daysUntilExpiry)}d ago` :
                                       `${daysUntilExpiry}d left`}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted">No date</span>
                                )}
                              </td>
                              <td className="py-3 px-4 border-b border-border/60">
                                {expiryStatus === 'expired' && (
                                  <Badge type="accent">Expired</Badge>
                                )}
                                {expiryStatus === 'expiring-soon' && (
                                  <Badge type="expiring">Expiring!</Badge>
                                )}
                                {expiryStatus === 'expiring' && (
                                  <Badge type="pending">Soon</Badge>
                                )}
                                {isLowStock && expiryStatus !== 'expired' && expiryStatus !== 'expiring-soon' && (
                                  <Badge type="expiring">Low Stock</Badge>
                                )}
                                {!isLowStock && !expiryStatus && (
                                  <Badge type="active">OK</Badge>
                                )}
                              </td>
                              <td className="py-3 px-4 border-b border-border/60">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {items.map((item) => {
                      const isLowStock = item.quantity <= item.reorder_level;
                      const expiryStatus = getExpiryStatus(item.expiry_date);
                      const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
                      return (
                        <div key={item.id} className={`p-3 border border-border rounded-lg hover:bg-white/1.5 transition-colors ${isLowStock ? 'bg-accent2/5' : ''} ${expiryStatus === 'expired' ? 'bg-accent/10' : expiryStatus === 'expiring-soon' ? 'bg-accent2/10' : ''}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-sm">{item.name}</div>
                            <div className="flex gap-1">
                              {expiryStatus === 'expired' && <Badge type="accent">Exp</Badge>}
                              {expiryStatus === 'expiring-soon' && <Badge type="expiring">!</Badge>}
                              {isLowStock && <Badge type="expiring">Low</Badge>}
                              {!isLowStock && !expiryStatus && <Badge type="active">OK</Badge>}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-3 text-9px text-muted">
                            <div>Qty: {item.quantity}</div>
                            <div>Price: ₱{item.unit_price.toFixed(2)}</div>
                            <div>Value: ₱{(item.quantity * item.unit_price).toFixed(2)}</div>
                            <div>Category: {item.category}</div>
                          </div>
                          {item.expiry_date && (
                            <div className="mb-3 p-2 bg-surface/50 rounded text-9px">
                              <div className="font-mono text-muted">Expires: {item.expiry_date}</div>
                              <div className={`font-semibold ${
                                expiryStatus === 'expired' ? 'text-accent' :
                                expiryStatus === 'expiring-soon' ? 'text-accent2' :
                                'text-success'
                              }`}>
                                {daysUntilExpiry === 0 ? 'TODAY' : 
                                 daysUntilExpiry && daysUntilExpiry < 0 ? `${Math.abs(daysUntilExpiry)}d ago` :
                                 `${daysUntilExpiry} days left`}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-display text-text mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="Item name"
                />
              </div>

              <div>
                <label className="block text-sm font-display text-text mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                >
                  <option value="water">Water</option>
                  <option value="sports_drink">Sports Drink</option>
                  <option value="juice">Juice</option>
                  <option value="energy_drink">Energy Drink</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-display text-text mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display text-text mb-1">Unit Price (₱)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-display text-text mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  placeholder="Supplier name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-display text-text mb-1">Reorder Level</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.reorder_level}
                    onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 bg-surface2 border border-border rounded-lg text-text focus:outline-none focus:border-accent"
                  />
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
