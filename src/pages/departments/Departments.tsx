import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Department, DepartmentDetail as DepartmentDetailType } from '../../types/department';
import DepartmentForm from './DepartmentForm';
import DepartmentDetail from './DepartmentDetail';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const Departments = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 10
  });
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const { data: departments, isLoading } = useQuery<Department[]>({
    queryKey: ['departments', filters],
    queryFn: () => api.get('/departments', { params: filters })
  });

  const { data: departmentDetail } = useQuery<DepartmentDetailType>({
    queryKey: ['department', selectedDepartment?._id],
    queryFn: () => api.get(`/departments/${selectedDepartment?._id}`),
    enabled: !!selectedDepartment && showDetail
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Department>) => api.post('/departments', data),
    onSuccess: () => {
      success('Thêm phòng ban thành công');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      handleCloseForm();
    },
    onError: (err: any) => {
      error(err.message || 'Thêm phòng ban thất bại');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) =>
      api.put(`/departments/${id}`, data),
    onSuccess: () => {
      success('Department updated successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      handleCloseForm();
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update department');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/departments/${id}`),
    onSuccess: () => {
      success('Department deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      handleCloseDeleteConfirm();
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete department');
    },
  });

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setShowForm(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowForm(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteConfirm(true);
  };

  const handleCloseForm = () => {
    setSelectedDepartment(null);
    setShowForm(false);
  };

  const handleCloseDeleteConfirm = () => {
    setSelectedDepartment(null);
    setShowDeleteConfirm(false);
  };

  const handleSubmit = async (values: Partial<Department>) => {
    if (selectedDepartment) {
      await updateMutation.mutateAsync({
        id: selectedDepartment.id,
        data: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDepartment) {
      await deleteMutation.mutateAsync(selectedDepartment.id);
    }
  };

  const handleViewDetail = (department: Department) => {
    setSelectedDepartment(department);
    setShowDetail(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Phòng ban
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Danh sách phòng ban và thông tin chi tiết
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleAddDepartment}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            Thêm phòng ban
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Tên phòng ban
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Mô tả
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Quản lý
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Số nhân viên
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departments?.map((department) => (
                  <tr key={department._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {department.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {department.description || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {department.manager?.fullName || '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {department.employeeCount}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(department)}
                        className="text-primary-600 hover:text-primary-900 mr-2"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditDepartment(department)}
                        className="text-primary-600 hover:text-primary-900 mr-2"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DepartmentForm
        open={showForm}
        department={selectedDepartment}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <DepartmentDetail
        open={showDetail}
        data={departmentDetail}
        onClose={() => setShowDetail(false)}
      />

      <DeleteConfirmation
        open={showDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Xóa phòng ban"
        message={`Bạn có chắc chắn muốn xóa phòng ban ${selectedDepartment?.name}?`}
      />
    </div>
  );
};

export default Departments; 