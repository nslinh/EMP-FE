import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface OvertimeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: {
    _id: string;
    date: string;
    requestedHours: number;
    reason: string;
  } | null;
}

const validationSchema = Yup.object({
  date: Yup.date()
    .min(new Date(Date.now() - 86400000), 'Ngày làm thêm không thể trong quá khứ')
    .required('Ngày làm thêm là bắt buộc'),
  requestedHours: Yup.number()
    .min(1, 'Số giờ phải lớn hơn 0')
    .max(24, 'Số giờ không thể vượt quá 24')
    .required('Số giờ là bắt buộc'),
  reason: Yup.string()
    .required('Lý do là bắt buộc')
    .min(10, 'Lý do phải có ít nhất 10 ký tự'),
});

const OvertimeForm = ({ open, onClose, onSubmit, initialValues }: OvertimeFormProps) => {
  const formik = useFormik({
    initialValues: initialValues || {
      date: '',
      requestedHours: 1,
      reason: '',
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div className="mt-3 sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {initialValues ? 'Cập nhật yêu cầu làm thêm giờ' : 'Tạo yêu cầu làm thêm giờ mới'}
                  </Dialog.Title>
                  <div className="mt-6">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                          Ngày làm thêm
                        </label>
                        <input
                          type="date"
                          id="date"
                          {...formik.getFieldProps('date')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {formik.touched.date && formik.errors.date && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.date}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="requestedHours" className="block text-sm font-medium text-gray-700">
                          Số giờ làm thêm
                        </label>
                        <input
                          type="number"
                          id="requestedHours"
                          min="1"
                          max="24"
                          {...formik.getFieldProps('requestedHours')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {formik.touched.requestedHours && formik.errors.requestedHours && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.requestedHours}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                          Lý do
                        </label>
                        <textarea
                          id="reason"
                          rows={3}
                          {...formik.getFieldProps('reason')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {formik.touched.reason && formik.errors.reason && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.reason}</p>
                        )}
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          disabled={formik.isSubmitting}
                          className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:col-start-2"
                        >
                          {formik.isSubmitting
                            ? 'Đang xử lý...'
                            : initialValues
                            ? 'Cập nhật'
                            : 'Tạo mới'}
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default OvertimeForm; 