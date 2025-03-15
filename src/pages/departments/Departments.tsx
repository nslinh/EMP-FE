import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { usePagination } from '../../hooks/usePagination';
import { Department, PaginatedResponse } from '../../types';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import DepartmentForm from './DepartmentForm';
import { DEFAULT_PAGE_SIZE } from '../../constants';

const Departments = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { page, setPage, limit, setLimit } = usePagination();

  const { data, isLoading } = useQuery<PaginatedResponse<Department>>({
    queryKey: ['departments', { page, limit, search }],
    queryFn: () =>
      api.get(`/departments?page=${page}&limit=${limit}&search=${search}`),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Department>) => api.post('/departments', data),
    onSuccess: () => {
      success('Department created successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      handleCloseForm();
    },
    onError: (err: any) => {
      error(err.message || 'Failed to create department');
    },
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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Departments
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all departments in your company including their name,
            description, and manager.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleAddDepartment}
            className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add department
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
                    placeholder="Search departments..."
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
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Manager
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
                        colSpan={4}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : data?.data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                      >
                        No departments found
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((department) => (
                      <tr key={department.id}>
                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                          {department.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {department.description || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {department.managerId || '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditDepartment(department)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(department)}
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

      <DepartmentForm
        open={showForm}
        department={selectedDepartment}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmation
        open={showDeleteConfirm}
        title="Delete Department"
        message={`Are you sure you want to delete ${selectedDepartment?.name}? This action cannot be undone.`}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default Departments; 