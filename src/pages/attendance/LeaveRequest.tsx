import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';

const validationSchema = Yup.object({
  startDate: Yup.date().required('Vui lòng chọn ngày bắt đầu'),
  endDate: Yup.date().required('Vui lòng chọn ngày kết thúc'),
  type: Yup.string().required('Vui lòng chọn loại nghỉ phép'),
  reason: Yup.string().required('Vui lòng nhập lý do')
});

const LeaveRequest = () => {
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
      type: '',
      reason: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/attendance/leave', values);
        success('Đã gửi đơn xin nghỉ phép');
        formik.resetForm();
      } catch (err: any) {
        error(err.message || 'Gửi đơn thất bại');
      }
    }
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-lg font-medium mb-6">Đơn xin nghỉ phép</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            {...formik.getFieldProps('startDate')}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày kết thúc
          </label>
          <input
            type="date"
            {...formik.getFieldProps('endDate')}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
          {formik.touched.endDate && formik.errors.endDate && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.endDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Loại nghỉ phép
          </label>
          <select
            {...formik.getFieldProps('type')}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="">Chọn loại nghỉ phép</option>
            <option value="annual">Nghỉ phép năm</option>
            <option value="sick">Nghỉ ốm</option>
            <option value="unpaid">Nghỉ không lương</option>
            <option value="other">Khác</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lý do
          </label>
          <textarea
            {...formik.getFieldProps('reason')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
          {formik.touched.reason && formik.errors.reason && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.reason}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {formik.isSubmitting ? 'Đang gửi...' : 'Gửi đơn'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequest; 