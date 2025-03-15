import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Department, User } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';

interface DepartmentFormProps {
  open: boolean;
  department: Department | null;
  onClose: () => void;
  onSubmit: (values: Partial<Department>) => Promise<void>;
}

interface ManagersResponse {
  data: User[];
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  managerId: Yup.string(),
});

const DepartmentForm = ({
  open,
  department,
  onClose,
  onSubmit,
}: DepartmentFormProps) => {
  const api = useApi();

  const { data: managers } = useQuery<ManagersResponse>({
    queryKey: ['managers'],
    queryFn: () => api.get('/employees?role=manager'),
  });

  const formik = useFormik({
    initialValues: {
      name: department?.name || '',
      description: department?.description || '',
      managerId: department?.managerId || '',
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
                      {department ? 'Edit Department' : 'Add Department'}
                    </Dialog.Title>
                    <div className="mt-6">
                      <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="name"
                              {...formik.getFieldProps('name')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.name && formik.errors.name
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.name && formik.errors.name && (
                              <p className="mt-2 text-sm text-red-600">
                                {formik.errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="description"
                              rows={3}
                              {...formik.getFieldProps('description')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.description &&
                                formik.errors.description
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.description &&
                              formik.errors.description && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.description}
                                </p>
                              )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="managerId"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Manager
                          </label>
                          <div className="mt-1">
                            <select
                              id="managerId"
                              {...formik.getFieldProps('managerId')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.managerId &&
                                formik.errors.managerId
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            >
                              <option value="">Select manager</option>
                              {managers?.data.map((manager) => (
                                <option key={manager.id} value={manager.id}>
                                  {manager.name}
                                </option>
                              ))}
                            </select>
                            {formik.touched.managerId &&
                              formik.errors.managerId && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.managerId}
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
                              ? 'Saving...'
                              : department
                              ? 'Update'
                              : 'Create'}
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

export default DepartmentForm; 