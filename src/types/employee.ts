export interface Employee {
  _id: string;
  userId: {
    _id: string;
    email: string;
    role: string;
  };
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  phoneNumber: string;
  department: {
    _id: string;
    name: string;
  };
  position: string;
  salary: string;
  baseSalary: string;
  startDate: string;
  avatarUrl: string | null;
  overtimeRate: number;
}

export interface EmployeeResponse {
  employees: Employee[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
  stats: {
    _id: string;
    count: number;
    totalBaseSalary: number;
    totalWorkingHours: number;
    totalOvertimeHours: number;
    totalRegularPay: number;
    totalOvertimePay: number;
    totalSalary: number;
  };
} 