export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
  membershipType: 'basic' | 'premium' | 'elite';
  status: 'active' | 'inactive' | 'suspended';
}

export interface GymClass {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
