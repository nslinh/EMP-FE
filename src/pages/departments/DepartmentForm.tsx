import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Department } from '../../types/department';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';

interface DepartmentFormProps {
  open: boolean;
  department: Department | null;
  onClose: () => void;
  onSubmit: (values: Partial<Department>) => Promise<void>;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Tên phòng ban là bắt buộc'),
  description: Yup.string(),
  managerId: Yup.string()
});

const DepartmentForm = ({ open, department, onClose, onSubmit }: DepartmentFormProps) => {
  const api = useApi();

  const { data: managersData } = useQuery({
    queryKey: ['managers'],
    queryFn: async () => {
      const response = await api.get('/employees', { params: { role: 'manager' } });
      return response.data;
    }
  });

  const managers = managersData?.data || [];

  const formik = useFormik({
    initialValues: {
      name: department?.name || '',
      description: department?.description || '',
      managerId: department?.manager?._id || '67d3e6ebe428772abf33f366'
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
      formik.resetForm();
    },
    enableReinitialize: true
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {department ? 'Cập nhật phòng ban' : 'Thêm phòng ban mới'}
                  </Dialog.Title>
                  <div className="mt-6 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Tên phòng ban
                      </label>
                      <input
                        type="text"
                        {...formik.getFieldProps('name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Mô tả
                      </label>
                      <textarea
                        {...formik.getFieldProps('description')}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
                        Quản lý
                      </label>
                      <select
                        {...formik.getFieldProps('managerId')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="">Chọn quản lý</option>
                        {managers.map((manager) => (
                          <option key={manager._id} value={manager._id}>
                            {manager.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
                  >
                    {formik.isSubmitting ? 'Đang lưu...' : department ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DepartmentForm; 