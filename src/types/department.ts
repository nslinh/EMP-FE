export interface Department {
  _id: string;
  name: string;
  description: string;
  manager?: {
    _id: string;
    fullName: string;
  };
  isActive: boolean;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentEmployee {
  _id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  department: string;
  position: string;
  salary: number;
  startDate: string;
  avatarUrl: string;
}

export interface DepartmentDetail {
  department: Department;
  employees: DepartmentEmployee[];
} 