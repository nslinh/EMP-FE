import { formatDate } from '../../../utils/date';

interface ActivityLogTableProps {
  data: any;
  isLoading: boolean;
  filters: {
    page: number;
  };
  setFilters: (filters: any) => void;
}

const ActivityLogTable = ({ data, isLoading, filters, setFilters }: ActivityLogTableProps) => {
  const actionColors = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800'
  };

  return (
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
                  Người thực hiện
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
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Đang tải...</td>
                </tr>
              ) : (
                data?.logs.map((log: any) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      {data?.pagination && (
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
              disabled={filters.page === data.pagination.totalPages}
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
                  {Math.min(filters.page * 20, data.pagination.total)}
                </span>{' '}
                trong số <span className="font-medium">{data.pagination.total}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                {Array.from({ length: data.pagination.totalPages }, (_, i) => (
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

export default ActivityLogTable; 