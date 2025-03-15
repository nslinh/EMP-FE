import { GENDER } from '../constants';

export interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  departmentId: string;
  gender: typeof GENDER[keyof typeof GENDER];
  birthDate: string;
  startDate: string;
  salary: number;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Salary {
  id: string;
  employeeId: string;
  baseSalary: number;
  allowance: number;
  bonus: number;
  deductions: number;
  month: number;
  year: number;
  totalSalary: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = 'annual' | 'sick' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
}

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface RootState {
  auth: AuthState;
  notification: NotificationState;
  theme: ThemeState;
} 