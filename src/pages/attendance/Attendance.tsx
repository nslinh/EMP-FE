import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { usePagination } from '../../hooks/usePagination';
import { Attendance as AttendanceType, PaginatedResponse } from '../../types';
import { formatDate, formatTime } from '../../utils/date';
import { ATTENDANCE_STATUS } from '../../constants';

const Attendance = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { page, setPage, limit, setLimit } = usePagination();

  const { data, isLoading } = useQuery<PaginatedResponse<AttendanceType>>({
    queryKey: ['attendance', { page, limit, date }],
    queryFn: () =>
      api.get(`/attendance?page=${page}&limit=${limit}&date=${date}`),
  });

  const checkInMutation = useMutation({
    mutationFn: (userId: string) =>
      api.post('/attendance/check-in', { userId, date }),
    onSuccess: () => {
      success('Check-in recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => {
      error(err.message || 'Failed to record check-in');
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: (userId: string) =>
      api.post('/attendance/check-out', { userId, date }),
    onSuccess: () => {
      success('Check-out recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (err: any) => {
      error(err.message || 'Failed to record check-out');
    },
  });

  const handleCheckIn = async (userId: string) => {
    await checkInMutation.mutateAsync(userId);
  };

  const handleCheckOut = async (userId: string) => {
    await checkOutMutation.mutateAsync(userId);
  };

  const getStatusColor = (status: keyof typeof ATTENDANCE_STATUS) => {
    switch (status) {
      case 'PRESENT':
        return 'text-green-800 bg-green-100';
      case 'ABSENT':
        return 'text-red-800 bg-red-100';
      case 'LATE':
        return 'text-yellow-800 bg-yellow-100';
      case 'HALF_DAY':
        return 'text-orange-800 bg-orange-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Attendance
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage employee attendance records.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="flex items-center justify-between bg-white px-6 py-3">
                <div className="flex-1" />
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
                      Employee
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Check In
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Check Out
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Note
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
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((record) => (
                      <tr key={record.id}>
                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {record.userId ? (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                  <span className="text-sm font-medium text-gray-600">
                                    {record.userId
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {record.userId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {record.checkIn
                            ? formatTime(record.checkIn)
                            : 'Not checked in'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {record.checkOut
                            ? formatTime(record.checkOut)
                            : 'Not checked out'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                              record.status as keyof typeof ATTENDANCE_STATUS
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {record.note || '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                          {!record.checkIn ? (
                            <button
                              onClick={() => handleCheckIn(record.userId)}
                              disabled={checkInMutation.isPending}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              Check In
                            </button>
                          ) : !record.checkOut ? (
                            <button
                              onClick={() => handleCheckOut(record.userId)}
                              disabled={checkOutMutation.isPending}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Check Out
                            </button>
                          ) : null}
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
    </div>
  );
};

export default Attendance; 