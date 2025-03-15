import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { usePagination } from '../../hooks/usePagination';
import { User, PaginatedResponse } from '../../types';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/number';
import EmployeeForm from './EmployeeForm';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import { DEFAULT_PAGE_SIZE } from '../../constants';

const Employees = () => {
  const api = useApi();
  const { notify, success, error } = useNotification();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { page, setPage, limit, setLimit } = usePagination();

  const { data, isLoading } = useQuery<PaginatedResponse<User>>({
    queryKey: ['employees', { page, limit, search }],
    queryFn: () =>
      api.get(`/employees?page=${page}&limit=${limit}&search=${search}`),
  });

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
      handleCloseDeleteConfirm();
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete employee');
    },
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setShowDeleteConfirm(true);
  };

  const handleCloseForm = () => {
    setSelectedEmployee(null);
    setShowForm(false);
  };

  const handleCloseDeleteConfirm = () => {
    setSelectedEmployee(null);
    setShowDeleteConfirm(false);
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

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      await deleteMutation.mutateAsync(selectedEmployee.id);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Employees
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all employees in your company including their name, position,
            department, and other details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleAddEmployee}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add employee
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="flex items-center justify-between bg-white px-6 py-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full max-w-md rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>

              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Start Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Salary
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : data?.data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                      >
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((employee) => (
                      <tr key={employee.id}>
                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {employee.avatar ? (
                                <img
                                  src={employee.avatar}
                                  alt=""
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                  <span className="text-sm font-medium text-gray-600">
                                    {employee.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {employee.name}
                              </div>
                              <div className="text-gray-500">{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {employee.position}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {employee.departmentId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(employee.startDate)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatCurrency(employee.salary)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {data && data.totalPages > 1 && (
                <nav
                  className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                  aria-label="Pagination"
                >
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(page - 1) * limit + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(page * limit, data.total)}
                      </span>{' '}
                      of <span className="font-medium">{data.total}</span> results
                    </p>
                  </div>
                  <div className="flex flex-1 justify-between sm:justify-end">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      <EmployeeForm
        open={showForm}
        employee={selectedEmployee}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmation
        open={showDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.name}? This action cannot be undone.`}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default Employees; 