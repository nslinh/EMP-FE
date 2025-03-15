import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Leave, LeaveType } from '../../types';
import { LEAVE_TYPES } from '../../constants';

interface LeaveFormProps {
  open: boolean;
  leave: Leave | null;
  onClose: () => void;
  onSubmit: (values: Partial<Leave>) => Promise<void>;
}

interface LeaveFormValues {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

const validationSchema = Yup.object({
  type: Yup.string()
    .oneOf(Object.keys(LEAVE_TYPES) as LeaveType[], 'Invalid leave type')
    .required('Leave type is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  reason: Yup.string().required('Reason is required'),
});

const LeaveForm = ({ open, leave, onClose, onSubmit }: LeaveFormProps) => {
  const formik = useFormik<LeaveFormValues>({
    initialValues: {
      type: leave?.type || '' as LeaveType,
      startDate: leave?.startDate || '',
      endDate: leave?.endDate || '',
      reason: leave?.reason || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
    enableReinitialize: true,
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {leave ? 'Edit Leave Request' : 'Submit Leave Request'}
                    </Dialog.Title>
                    <div className="mt-6">
                      <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                          <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Leave Type
                          </label>
                          <div className="mt-1">
                            <select
                              id="type"
                              {...formik.getFieldProps('type')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.type && formik.errors.type
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            >
                              <option value="">Select leave type</option>
                              {Object.entries(LEAVE_TYPES).map(([key, value]) => (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              ))}
                            </select>
                            {formik.touched.type && formik.errors.type && (
                              <p className="mt-2 text-sm text-red-600">
                                {formik.errors.type}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Start Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              id="startDate"
                              {...formik.getFieldProps('startDate')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.startDate &&
                                formik.errors.startDate
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.startDate &&
                              formik.errors.startDate && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.startDate}
                                </p>
                              )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="endDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            End Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              id="endDate"
                              {...formik.getFieldProps('endDate')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.endDate && formik.errors.endDate
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.endDate && formik.errors.endDate && (
                              <p className="mt-2 text-sm text-red-600">
                                {formik.errors.endDate}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="reason"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Reason
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="reason"
                              rows={3}
                              {...formik.getFieldProps('reason')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.reason && formik.errors.reason
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.reason && formik.errors.reason && (
                              <p className="mt-2 text-sm text-red-600">
                                {formik.errors.reason}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 sm:col-start-2"
                          >
                            {formik.isSubmitting
                              ? 'Submitting...'
                              : leave
                              ? 'Update'
                              : 'Submit'}
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LeaveForm; 