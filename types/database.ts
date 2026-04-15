// Member types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  join_date: string;
  membership_type: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'suspended';
  expiry_date: string;
  attendance_rate: number;
  created_at: string;
  updated_at: string;
}

// Transaction types
export interface Transaction {
  id: string;
  member_id: string;
  amount: number;
  payment_method: 'online' | 'cash';
  transaction_type: 'membership' | 'renewal' | 'walk_in' | 'merchandise' | 'drink_sale';
  status: 'paid' | 'pending' | 'failed';
  created_at: string;
  updated_at: string;
}

// Attendance types
export interface Attendance {
  id: string;
  member_id: string;
  check_in_time: string;
  check_out_time: string | null;
  date: string;
  created_at: string;
}

// Class types
export interface GymClass {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled_count: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

// Admin/Staff types
export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  created_at: string;
  updated_at: string;
}

// Dashboard stats
export interface DashboardStats {
  total_members: number;
  active_members: number;
  expiring_soon: number;
  monthly_revenue: number;
  pending_payments: number;
}

// Inventory types
export interface InventoryItem {
  id: string;
  name: string;
  category: 'water' | 'sports_drink' | 'juice' | 'energy_drink' | 'other';
  quantity: number;
  unit_price: number;
  supplier: string;
  reorder_level: number;
  expiry_date: string | null;
  last_restocked: string;
  created_at: string;
  updated_at: string;
}

// Inventory transaction types
export interface InventoryTransaction {
  id: string;
  inventory_item_id: string;
  transaction_type: 'restock' | 'sale' | 'adjustment' | 'damage';
  quantity: number;
  notes: string;
  created_by: string;
  created_at: string;
}
