import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import OvertimeForm from './OvertimeForm';
import { DeleteConfirmation } from '../../components/DeleteConfirmation';
import { 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface User {
  _id: string;
  isAdmin: boolean;
}

interface OvertimeRequest {
  _id: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  date: string;
  requestedHours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
}

interface OvertimeResponse {
  requests: OvertimeRequest[];
  summary: {
    totalRequests: number;
    approvedRequests: number;
    pendingRequests: number;
    rejectedRequests: number;
    totalHours: number;
  };
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

interface RequestParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  page?: number;
  limit?: number;
}

const Overtime = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10
  });

  const { user: reduxUser } = useSelector((state: RootState) => state.auth);

  // Tính toán ngày bắt đầu và kết thúc của tháng được chọn
  const startDate = format(startOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');
  const { data, isLoading, refetch } = useQuery<OvertimeResponse>({
    queryKey: ['overtime-requests', filters, startDate, endDate, user?._id],
    queryFn: () => {
      const params: RequestParams = {
        ...filters,
        startDate,
        endDate,
        employeeId: isAdmin ? undefined : user?._id
      };
      return api.get('/overtime/requests', { params });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<OvertimeRequest>) => api.post('/overtime/request', data),
    onSuccess: () => {
      success('Tạo yêu cầu làm thêm giờ thành công');
      queryClient.invalidateQueries({ queryKey: ['overtime-requests'] });
      handleCloseForm();
      refetch();
    },
    onError: (err: any) => {
      error(err.message || 'Tạo yêu cầu thất bại');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/overtime/approve/${id}`),
    onSuccess: () => {
      success('Phê duyệt yêu cầu thành công');
      queryClient.invalidateQueries({ queryKey: ['overtime-requests'] });
      refetch();
    },
    onError: (err: any) => {
      error(err.message || 'Phê duyệt yêu cầu thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/overtime/request/${id}`),
    onSuccess: () => {
      success('Xóa yêu cầu thành công');
      queryClient.invalidateQueries({ queryKey: ['overtime-requests'] });
      setIsDeleteOpen(false);
      refetch();
    },
    onError: (err: any) => {
      error(err.message || 'Xóa yêu cầu thất bại');
    },
  });

  const handleEdit = (request: OvertimeRequest) => {
    if (!isAdmin && request.employeeId._id !== user?._id) return;
    setSelectedRequest(request);
    setIsFormOpen(true);
  };

  const handleDelete = (request: OvertimeRequest) => {
    if (!isAdmin && request.employeeId._id !== user?._id) return;
    setSelectedRequest(request);
    setIsDeleteOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedRequest(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (values: Partial<OvertimeRequest>) => {
    await createMutation.mutateAsync(values);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Quản lý làm thêm giờ
          </h1>
        </div>
        <div className="mt-4 sm:ml-10 sm:mt-0 sm:flex space-x-4">
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
          {reduxUser?.role === 'employee' && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Tạo mới
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Tổng yêu cầu</h3>
            <p className="mt-2 text-3xl font-semibold">{data?.summary?.totalRequests || 0}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Đã duyệt</h3>
            <p className="mt-2 text-3xl font-semibold">
              {data?.summary?.approvedRequests || 0}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Chờ duyệt</h3>
            <p className="mt-2 text-3xl font-semibold">
              {data?.summary?.pendingRequests || 0}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Tổng giờ tăng ca</h3>
            <p className="mt-2 text-3xl font-semibold">
              {data?.summary?.totalHours || 0}h
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {isAdmin && (
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nhân viên</th>
                    )}
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ngày</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Số giờ</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lý do</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                    {isAdmin && (
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Người duyệt</th>
                    )}
                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 5} className="text-center py-4">Đang tải...</td>
                    </tr>
                  ) : data?.requests && data.requests.length > 0 ? (
                    data.requests.map((request) => (
                      <tr key={request._id}>
                        {isAdmin && (
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {`${request.employeeId.firstName} ${request.employeeId.lastName}`}
                          </td>
                        )}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(request.date), 'dd/MM/yyyy')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.requestedHours}h
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {request.reason}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status === 'approved' ? 'Đã duyệt' :
                             request.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {request.approvedBy ? 
                              `${request.approvedBy.firstName} ${request.approvedBy.lastName}` : 
                              '-'}
                          </td>
                        )}
                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                          {isAdmin && request.status === 'pending' && (
                            <button
                              onClick={() => approveMutation.mutate(request._id)}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              Duyệt
                            </button>
                          )}
                          {(isAdmin || request.employeeId._id === user?._id) && (
                            <>
                              <button
                                onClick={() => handleEdit(request)}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(request)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 5} className="text-center py-4">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OvertimeForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialValues={selectedRequest}
      />
      
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => selectedRequest && deleteMutation.mutate(selectedRequest._id)}
        title="Xóa yêu cầu"
        message={`Bạn có chắc chắn muốn xóa yêu cầu làm thêm giờ này?`}
      />
    </div>
  );
};

export default Overtime; 