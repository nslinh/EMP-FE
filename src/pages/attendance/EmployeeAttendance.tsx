import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';

const EmployeeAttendance = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: attendanceReport } = useQuery({
    queryKey: ['attendance-report', { month, year }],
    queryFn: () => api.get(`/attendance/report/me?month=${month}&year=${year}`)
  });

  const checkInMutation = useMutation({
    mutationFn: () => api.post('/attendance/check-in'),
    onSuccess: () => {
      success('Đã check-in thành công');
      queryClient.invalidateQueries({ queryKey: ['attendance-report'] });
    },
    onError: (err: any) => error(err.message || 'Check-in thất bại')
  });

  const checkOutMutation = useMutation({
    mutationFn: () => api.post('/attendance/check-out'),
    onSuccess: () => {
      success('Đã check-out thành công');
      queryClient.invalidateQueries({ queryKey: ['attendance-report'] });
    },
    onError: (err: any) => error(err.message || 'Check-out thất bại')
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Chấm công
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-4">
          <button
            onClick={() => checkInMutation.mutate()}
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Check-in
          </button>
          <button
            onClick={() => checkOutMutation.mutate()}
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Check-out
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="sm:flex sm:items-center mb-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border-gray-300 mr-2"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border-gray-300"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium">Tổng quan tháng {month}/{year}</h3>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Ngày làm việc</dt>
                <dd className="text-xl font-semibold">{attendanceReport?.summary.presentDays || 0}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Ngày nghỉ</dt>
                <dd className="text-xl font-semibold">{attendanceReport?.summary.leaveDays || 0}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Tổng giờ làm</dt>
                <dd className="text-xl font-semibold">{attendanceReport?.summary.totalWorkingHours || 0}h</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Giờ làm thêm</dt>
                <dd className="text-xl font-semibold">{attendanceReport?.summary.totalOvertime || 0}h</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Check-in</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Check-out</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Giờ làm việc</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceReport?.details.map((record: any) => (
                    <tr key={record._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(record.date), 'dd/MM/yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {record.checkIn ? format(new Date(record.checkIn), 'HH:mm') : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {record.checkOut ? format(new Date(record.checkOut), 'HH:mm') : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {record.workingHours || 0}h
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status === 'present' ? 'Có mặt' :
                           record.status === 'absent' ? 'Vắng mặt' : 'Đi muộn'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance; 