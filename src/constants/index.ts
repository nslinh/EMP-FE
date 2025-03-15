export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half-day',
} as const;

export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  UNPAID: 'unpaid',
} as const;

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const SALARY_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
} as const;

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export const DATE_FORMAT = {
  FULL: 'MMMM dd, yyyy',
  SHORT: 'MM/dd/yyyy',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm:ss',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

export const TIME_FORMAT = 'HH:mm:ss';
export const DATETIME_FORMAT = `${DATE_FORMAT.ISO} ${TIME_FORMAT}`;

export const ITEMS_PER_PAGE = 10;

export const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  DEPARTMENTS: '/departments',
  ATTENDANCE: '/attendance',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  EMPLOYEES: '/employees',
  DEPARTMENTS: '/departments',
  ATTENDANCE: '/attendance',
  REPORTS: '/reports',
  SALARY: {
    BASE: '/salary',
    DETAIL: (id: string) => `/salary/${id}`,
    EMPLOYEE: (id: string) => `/salary/employee/${id}`,
  },
  LEAVES: {
    BASE: '/leaves',
    DETAIL: (id: string) => `/leaves/${id}`,
    APPROVE: (id: string) => `/leaves/${id}/approve`,
    REJECT: (id: string) => `/leaves/${id}/reject`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    DETAIL: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
  },
  ACTIVITY_LOGS: {
    BASE: '/activity-logs',
  },
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export const DEFAULT_PAGE_SIZE = 10; 