import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';

const Attendance = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const { data: attendanceReport, isLoading } = useQuery({
    queryKey: ['attendance-report-all', { month, year, department: selectedDepartment }],
    queryFn: () => api.get(`/attendance/report/all?month=${month}&year=${year}${selectedDepartment ? `&department=${selectedDepartment}` : ''}`)
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments')
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Quản lý chấm công
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex space-x-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border-gray-300"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border-gray-300"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="">Tất cả phòng ban</option>
            {departments?.map((dept: any) => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Tổng nhân viên</h3>
            <p className="mt-2 text-3xl font-semibold">{attendanceReport?.totalSummary.totalEmployees}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Giờ làm trung bình</h3>
            <p className="mt-2 text-3xl font-semibold">{attendanceReport?.totalSummary.avgWorkingHours}h</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Tăng ca trung bình</h3>
            <p className="mt-2 text-3xl font-semibold">{attendanceReport?.totalSummary.avgOvertime}h</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Số lần đi muộn</h3>
            <p className="mt-2 text-3xl font-semibold">{attendanceReport?.totalSummary.totalLateCount}</p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nhân viên</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phòng ban</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày làm việc</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày nghỉ</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày phép</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tổng giờ làm</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tăng ca</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Đi muộn (phút)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4">Đang tải...</td>
                    </tr>
                  ) : (
                    attendanceReport?.details.map((record: any) => (
                      <tr key={record._id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{record.employeeName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.department}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.presentDays}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.absentDays}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.leaveDays}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.totalWorkingHours}h</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.totalOvertimeHours}h</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.totalLateMinutes}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance; 