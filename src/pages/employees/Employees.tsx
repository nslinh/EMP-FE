import { Key, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import EmployeeForm from './EmployeeForm';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import { User, PaginatedResponse } from '../../types';

interface ExtendedUser extends User {
  status: 'Active' | 'Inactive';
  department: string;
  _id: Key | null
}

interface EmployeesResponse extends PaginatedResponse<ExtendedUser> {
  from: number;
  to: number;
  hasNextPage: boolean;
  employees: ExtendedUser[]
}

const Employees = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ExtendedUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: employeesData, isLoading } = useQuery<EmployeesResponse>({
    queryKey: ['employees', currentPage, pageSize, searchQuery],
    queryFn: () =>
      api.get(`/employees?page=${currentPage}&limit=${pageSize}&search=${searchQuery}`),
  });
  console.log("employeesDataemployeesData", employeesData)

  const createMutation = useMutation({
    mutationFn: (data: Partial<User>) => api.post('/employees', data),
    onSuccess: () => {
      success('Employee created successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      handleCloseForm();
    },
    onError: (err: any) => {
      error(err.message || 'Failed to create employee');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      api.put(`/employees/${id}`, data),
    onSuccess: () => {
      success('Employee updated successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      handleCloseForm();
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update employee');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/employees/${id}`),
    onSuccess: () => {
      success('Employee deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDeleteOpen(false);
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete employee');
    },
  });

  const handleEdit = (employee: ExtendedUser) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = (employee: ExtendedUser) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedEmployee(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (values: Partial<User>) => {
    if (selectedEmployee) {
      await updateMutation.mutateAsync({
        id: selectedEmployee.id,
        data: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  return (
    <div className="main-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Employees</h1>
            <p className="page-description">
              Manage your company's employees and their information.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary"
          >
            Add Employee
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-4 sm:flex sm:items-center sm:justify-between">
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <label htmlFor="search" className="sr-only">
            Search employees
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              placeholder="Search employees..."
            />
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <div className="table-inner">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Position</th>
                  <th className="table-header-cell">Department</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {employeesData?.employees?.map((employee: ExtendedUser) => (
                  <tr key={employee?._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={employee.avatar || 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {employee.name}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{employee.position}</td>
                    <td className="table-cell">{employee.department}</td>
                    <td className="table-cell">
                      <span className={`badge ${employee.status === 'Active' ? 'badge-success' : 'badge-gray'}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(employee)}
                          className="btn btn-secondary btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(employee)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!employeesData?.hasNextPage}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{employeesData?.from || 0}</span> to{' '}
              <span className="font-medium">{employeesData?.to || 0}</span> of{' '}
              <span className="font-medium">{employeesData?.total || 0}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!employeesData?.hasNextPage}
                className="btn btn-secondary"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Employee Form Modal */}
      <EmployeeForm
        open={isFormOpen}
        employee={selectedEmployee}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => selectedEmployee && deleteMutation.mutate(selectedEmployee.id)}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.name}? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default Employees; 