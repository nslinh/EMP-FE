import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import EmployeeForm from './EmployeeForm';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import { Employee, EmployeeResponse } from '../../types/employee';
import { 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
// import useScreenData, { ScreenData } from '../../hooks/useScreenData';

interface EmployeeFilters {
  search: string;
  department: string;
  position: string;
  gender: string;
  salaryMin: string;
  salaryMax: string;
  startDateFrom: string;
  startDateTo: string;
  page: number;
  limit: number;
}

const Employees = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  // const { savedData, updateScreenData } = useScreenData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: '',
    department: '',
    position: '',
    gender: '',
    salaryMin: '',
    salaryMax: '',
    startDateFrom: '',
    startDateTo: '',
    page: 1,
    limit: 10
  });

  const { data, isLoading, refetch } = useQuery<EmployeeResponse>({
    queryKey: ['employees', filters],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      return api.get(`/employees?${queryParams.toString()}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Employee>) => api.post('/employees', data),
    onSuccess: () => {
      success('Thêm nhân viên thành công');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      handleCloseForm();
      refetch();
    },
    onError: (err: any) => {
      error(err.message || 'Thêm nhân viên thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      api.put(`/employees/${id}`, data),
    onSuccess: () => {
      success('Cập nhật nhân viên thành công');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      handleCloseForm();
      refetch();
    },
    onError: (err: any) => {
      error(err.message || 'Cập nhật nhân viên thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/employees/${id}`),
    onSuccess: () => {
      success('Xóa nhân viên thành công');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDeleteOpen(false);
      refetch();
    },
    onError: (err: any) => {
      error(err.message || 'Xóa nhân viên thất bại');
    },
  });

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedEmployee(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (values: Partial<Employee>) => {
    if (selectedEmployee) {
      await updateMutation.mutateAsync({
        id: selectedEmployee._id,
        data: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý nhân viên
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý thông tin nhân viên trong công ty
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Thêm nhân viên
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Bộ lọc tìm kiếm</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value, page: 1 }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              <option value="">Tất cả phòng ban</option>
              {/* Thêm options từ API departments */}
            </select>
            <select
              value={filters.position}
              onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value, page: 1 }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              <option value="">Tất cả chức vụ</option>
              {/* Thêm options từ API positions */}
            </select>
            <select
              value={filters.gender}
              onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value, page: 1 }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              <option value="">Tất cả giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lương tối thiểu
                </label>
                <input
                  id="salaryMin"
                  type="number"
                  placeholder="0"
                  value={filters.salaryMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, salaryMin: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lương tối đa
                </label>
                <input
                  id="salaryMax"
                  type="number"
                  placeholder="0"
                  value={filters.salaryMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, salaryMax: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="startDateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Từ ngày
                </label>
                <input
                  id="startDateFrom"
                  type="date"
                  value={filters.startDateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDateFrom: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="startDateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Đến ngày
                </label>
                <input
                  id="startDateTo"
                  type="date"
                  value={filters.startDateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDateTo: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Avatar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phòng ban
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Chức vụ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data?.employees.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {employee.avatarUrl ? (
                      <img
                        src={employee.avatarUrl}
                        alt={`Avatar of ${employee.fullName}`}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://www.gravatar.com/avatar/?d=mp';
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                          {employee.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {employee.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {employee.userId.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {employee.department.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {employee.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(employee)}
                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between rounded-lg shadow sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            disabled={data?.pagination.page === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Trước
          </button>
          <button
            disabled={data?.pagination.page === data?.pagination.totalPages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Trang <span className="font-medium">{data?.pagination.page}</span> / <span className="font-medium">{data?.pagination.totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                disabled={data?.pagination.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                disabled={data?.pagination.page === data?.pagination.totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EmployeeForm
        open={isFormOpen}
        employee={selectedEmployee}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
      
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => selectedEmployee && deleteMutation.mutate(selectedEmployee._id)}
        title="Xóa nhân viên"
        message={`Bạn có chắc chắn muốn xóa nhân viên ${selectedEmployee?.fullName}?`}
      />
    </div>
  );
};

export default Employees; 