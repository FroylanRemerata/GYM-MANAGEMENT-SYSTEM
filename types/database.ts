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
  payment_method: 'gcash' | 'cash' | 'maya' | 'card';
  transaction_type: 'membership' | 'renewal' | 'walk_in' | 'merchandise';
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
