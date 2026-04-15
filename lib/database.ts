import { supabase, supabaseServer } from './supabase';
import type { Member, Transaction, Attendance, DashboardStats, InventoryItem, InventoryTransaction } from '@/types/database';

// MEMBERS
export async function getMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Member[];
}

export async function getMemberById(id: string) {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Member;
}

export async function createMember(member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('members')
    .insert([member])
    .select()
    .single();

  if (error) throw error;
  return data as Member;
}

export async function updateMember(id: string, updates: Partial<Member>) {
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Member;
}

export async function deleteMember(id: string) {
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// TRANSACTIONS
export async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

export async function getTransactionsByMember(memberId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ATTENDANCE
export async function logAttendance(memberId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('attendance')
    .insert([{
      member_id: memberId,
      check_in_time: new Date().toISOString(),
      date: today,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Attendance;
}

export async function getAttendanceByMember(memberId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('attendance')
    .select('*')
    .eq('member_id', memberId);

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) throw error;
  return data as Attendance[];
}

export async function updateAttendance(id: string, updates: Partial<Attendance>) {
  const { data, error } = await supabase
    .from('attendance')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Attendance;
}

export async function deleteAttendance(id: string) {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// DASHBOARD STATS
export async function getDashboardStats(): Promise<DashboardStats> {
  // Get total members
  const { count: totalMembers } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true });

  // Get active members
  const { count: activeMembers } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get expiring soon (within 7 days)
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { count: expiringMoon } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .lt('expiry_date', sevenDaysFromNow);

  // Get monthly revenue
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount')
    .eq('status', 'paid')
    .gte('created_at', firstDayOfMonth);

  const monthlyRevenue = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

  // Get pending payments
  const { count: pendingPayments } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return {
    total_members: totalMembers || 0,
    active_members: activeMembers || 0,
    expiring_soon: expiringMoon || 0,
    monthly_revenue: monthlyRevenue,
    pending_payments: pendingPayments || 0,
  };
}

// INVENTORY
export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data as InventoryItem[];
}

export async function getInventoryItemById(id: string) {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
  const { data, error } = await supabase
    .from('inventory_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// INVENTORY TRANSACTIONS
export async function getInventoryTransactions(itemId?: string) {
  let query = supabase
    .from('inventory_transactions')
    .select('*');

  if (itemId) {
    query = query.eq('inventory_item_id', itemId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as InventoryTransaction[];
}

export async function createInventoryTransaction(transaction: Omit<InventoryTransaction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('inventory_transactions')
    .insert([transaction])
    .select()
    .single();

  if (error) throw error;

  // Update inventory quantity
  const transaction_data = data as InventoryTransaction;
  if (transaction_data.transaction_type === 'restock') {
    const currentItem = await getInventoryItemById(transaction_data.inventory_item_id);
    await updateInventoryItem(transaction_data.inventory_item_id, {
      quantity: currentItem.quantity + transaction_data.quantity,
      last_restocked: new Date().toISOString().split('T')[0],
    });
  } else {
    const currentItem = await getInventoryItemById(transaction_data.inventory_item_id);
    await updateInventoryItem(transaction_data.inventory_item_id, {
      quantity: Math.max(0, currentItem.quantity - transaction_data.quantity),
    });
  }

  return transaction_data;
}
