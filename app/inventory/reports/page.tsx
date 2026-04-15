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
import type { InventoryItem } from '@/types/database';

export default function InventoryReports() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Calculate statistics
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const lowStockCount = items.filter(item => item.quantity <= item.reorder_level).length;

  // Category breakdown
  const categoryStats = Object.entries(
    items.reduce((acc, item) => {
      const cat = item.category.replace('_', ' ');
      if (!acc[cat]) acc[cat] = { count: 0, value: 0, quantity: 0 };
      acc[cat].count += 1;
      acc[cat].quantity += item.quantity;
      acc[cat].value += item.quantity * item.unit_price;
      return acc;
    }, {} as Record<string, any>)
  ).map(([name, stats]) => ({ name, ...stats }));

  // Expiry status
  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const expiredItems = items.filter(item => {
    const days = getDaysUntilExpiry(item.expiry_date);
    return days !== null && days < 0;
  });

  const expiringItems = items.filter(item => {
    const days = getDaysUntilExpiry(item.expiry_date);
    return days !== null && days >= 0 && days <= 30;
  });

  // Top 5 items by value
  const topValueItems = [...items]
    .sort((a, b) => (b.quantity * b.unit_price) - (a.quantity * a.unit_price))
    .slice(0, 5);

  // Low stock items
  const lowStockItems = items
    .filter(item => item.quantity <= item.reorder_level)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  // Supplier breakdown
  const supplierStats = Object.entries(
    items.reduce((acc, item) => {
      const supplier = item.supplier || 'Unknown';
      if (!acc[supplier]) acc[supplier] = { count: 0, value: 0 };
      acc[supplier].count += 1;
      acc[supplier].value += item.quantity * item.unit_price;
      return acc;
    }, {} as Record<string, any>)
  ).map(([name, stats]) => ({ name, ...stats }));

  const categoryColors = {
    'water': 'accent',
    'sports_drink': 'success',
    'juice': 'accent3',
    'energy_drink': 'accent2',
    'other': 'muted'
  } as Record<string, string>;

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <Topbar title="INVENTORY REPORTS" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-bg w-full">
          <div className="p-3 sm:p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
              <h2 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-widest text-text">Inventory Analytics</h2>
              <Button 
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => router.push('/inventory')}
              >
                ← Back to Inventory
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-accent2/10 border border-accent2/20 rounded-lg text-accent2 text-sm mb-4">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="py-12 text-center text-muted">Loading reports...</div>
            ) : (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <Card title="Total Items">
                    <div className="text-3xl font-bebas text-accent">{totalItems}</div>
                  </Card>
                  <Card title="Total Quantity">
                    <div className="text-3xl font-bebas text-success">{totalQuantity}</div>
                  </Card>
                  <Card title="Inventory Value">
                    <div className="text-2xl font-bebas text-accent3">₱{totalValue.toFixed(2)}</div>
                  </Card>
                  <Card title="Low Stock Alerts">
                    <div className={`text-3xl font-bebas ${lowStockCount > 0 ? 'text-accent2' : 'text-success'}`}>
                      {lowStockCount}
                    </div>
                  </Card>
                </div>

                {/* Alerts */}
                {(expiredItems.length > 0 || expiringItems.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {expiredItems.length > 0 && (
                      <Card title="Expired Items" className="border-2 border-accent/30">
                        <div className="space-y-2">
                          {expiredItems.slice(0, 3).map(item => (
                            <div key={item.id} className="p-2 bg-accent/5 rounded border border-accent/20">
                              <div className="font-semibold text-sm">{item.name}</div>
                              <div className="text-9px text-muted">{item.expiry_date} · {item.quantity} units</div>
                            </div>
                          ))}
                          {expiredItems.length > 3 && (
                            <div className="text-9px text-muted font-semibold">+{expiredItems.length - 3} more</div>
                          )}
                        </div>
                      </Card>
                    )}

                    {expiringItems.length > 0 && (
                      <Card title="Expiring Soon (30 days)" className="border-2 border-accent2/30">
                        <div className="space-y-2">
                          {expiringItems.slice(0, 3).map(item => {
                            const days = getDaysUntilExpiry(item.expiry_date);
                            return (
                              <div key={item.id} className="p-2 bg-accent2/5 rounded border border-accent2/20">
                                <div className="font-semibold text-sm">{item.name}</div>
                                <div className="text-9px text-muted">{days} days · {item.quantity} units</div>
                              </div>
                            );
                          })}
                          {expiringItems.length > 3 && (
                            <div className="text-9px text-muted font-semibold">+{expiringItems.length - 3} more</div>
                          )}
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* Category Breakdown */}
                <Card title="Inventory by Category" className="mb-6">
                  <div className="space-y-4">
                    {categoryStats.map((cat) => {
                      const percentage = (cat.count / totalItems) * 100;
                      return (
                        <div key={cat.name}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm capitalize">{cat.name}</span>
                            <span className="text-9px text-muted">{cat.count} items · ₱{cat.value.toFixed(2)}</span>
                          </div>
                          <ProgressBar value={percentage} max={100} color={categoryColors[cat.name] || 'accent'} />
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* Top Value Items */}
                  <Card title="Top 5 by Value">
                    <div className="space-y-3">
                      {topValueItems.map((item, idx) => {
                        const value = item.quantity * item.unit_price;
                        const percentage = (value / totalValue * 100);
                        return (
                          <div key={item.id}>
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex-1">
                                <div className="text-sm font-semibold">{idx + 1}. {item.name}</div>
                                <div className="text-9px text-muted">{item.quantity} × ₱{item.unit_price.toFixed(2)}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-sm">₱{value.toFixed(2)}</div>
                                <div className="text-9px text-muted">{percentage.toFixed(1)}%</div>
                              </div>
                            </div>
                            <ProgressBar value={percentage} max={100} color="accent" />
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Low Stock Alert */}
                  <Card title={`Low Stock Items (${lowStockItems.length})`}>
                    <div className="space-y-3">
                      {lowStockItems.length > 0 ? (
                        lowStockItems.map((item, idx) => {
                          const stockLevel = (item.quantity / item.reorder_level) * 100;
                          return (
                            <div key={item.id} className="p-2 bg-accent2/5 rounded border border-accent2/20">
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex-1">
                                  <div className="text-sm font-semibold">{item.name}</div>
                                  <div className="text-9px text-muted">{item.quantity} / {item.reorder_level} units</div>
                                </div>
                                <Badge type="expiring">REORDER</Badge>
                              </div>
                              <ProgressBar value={Math.min(stockLevel, 100)} max={100} color="accent2" />
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-muted">All items have sufficient stock</div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Supplier Breakdown */}
                {supplierStats.length > 0 && (
                  <Card title="Inventory by Supplier">
                    <div className="space-y-3">
                      {supplierStats
                        .sort((a, b) => b.value - a.value)
                        .map((supplier) => {
                          const percentage = (supplier.value / totalValue) * 100;
                          return (
                            <div key={supplier.name}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm">{supplier.name}</span>
                                <span className="text-9px text-muted">{supplier.count} items</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ProgressBar value={percentage} max={100} color="accent3" />
                                <span className="text-9px text-muted font-mono w-12 text-right">
                                  ₱{supplier.value.toFixed(0)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
