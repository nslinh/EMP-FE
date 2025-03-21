import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/date';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ActivityLogs = () => {
  const api = useApi();
  const [filters, setFilters] = useState({
    userId: '',
    entityType: '',
    action: '',
    startDate: null,
    endDate: null,
    page: 1
  });

  const { data: activityData, isLoading } = useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: () => api.get('/logs', { params: filters })
  });

  const { data: summaryData } = useQuery({
    queryKey: ['activity-summary'],
    queryFn: () => api.get('/logs/summary')
  });

  const actionColors = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800'
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Lịch sử hoạt động
          </h1>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Tổng người dùng</h3>
          <p className="mt-2 text-3xl font-semibold">{summaryData?.totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Tổng hoạt động</h3>
          <p className="mt-2 text-3xl font-semibold">{summaryData?.totalActions}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Hoạt động hôm nay</h3>
          <p className="mt-2 text-3xl font-semibold">
            {activityData?.logs.filter(log => 
              new Date(log.createdAt).toDateString() === new Date().toDateString()
            ).length}
          </p>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="mt-8 flex flex-wrap gap-4">
        <DatePicker
          selected={filters.startDate}
          onChange={date => setFilters(prev => ({ ...prev, startDate: date }))}
          placeholderText="Từ ngày"
          className="rounded-md border-gray-300"
        />
        <DatePicker
          selected={filters.endDate}
          onChange={date => setFilters(prev => ({ ...prev, endDate: date }))}
          placeholderText="Đến ngày"
          className="rounded-md border-gray-300"
        />
        <select
          value={filters.action}
          onChange={e => setFilters(prev => ({ ...prev, action: e.target.value }))}
          className="rounded-md border-gray-300"
        >
          <option value="">Tất cả hành động</option>
          <option value="create">Thêm mới</option>
          <option value="update">Cập nhật</option>
          <option value="delete">Xóa</option>
        </select>
        <select
          value={filters.entityType}
          onChange={e => setFilters(prev => ({ ...prev, entityType: e.target.value }))}
          className="rounded-md border-gray-300"
        >
          <option value="">Tất cả đối tượng</option>
          <option value="employee">Nhân viên</option>
          <option value="department">Phòng ban</option>
          <option value="attendance">Chấm công</option>
        </select>
      </div>

      {/* Bảng lịch sử */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Thời gian
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Người dùng
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Hành động
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Đối tượng
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activityData?.logs.map((log: any) => (
                  <tr key={log._id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {log.userId.fullName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${actionColors[log.action]}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {log.entityType}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <pre className="text-xs">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Phân trang */}
      {activityData?.pagination && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={filters.page === 1}
              className="btn-secondary"
            >
              Trước
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page === activityData.pagination.totalPages}
              className="btn-primary"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{(filters.page - 1) * 20 + 1}</span> đến{' '}
                <span className="font-medium">
                  {Math.min(filters.page * 20, activityData.pagination.total)}
                </span>{' '}
                trong số <span className="font-medium">{activityData.pagination.total}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                {Array.from({ length: activityData.pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      filters.page === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs; 