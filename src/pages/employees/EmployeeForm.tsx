import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { useFileUpload } from '../../hooks/useFileUpload';
import { GENDER } from '../../constants';

interface EmployeeFormProps {
  open: boolean;
  employee: User | null;
  onClose: () => void;
  onSubmit: (values: Partial<User>) => Promise<void>;
}

interface Department {
  id: string;
  name: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  position: Yup.string().required('Position is required'),
  departmentId: Yup.string().required('Department is required'),
  gender: Yup.string()
    .oneOf(Object.values(GENDER), 'Invalid gender')
    .required('Gender is required'),
  birthDate: Yup.date().required('Birth date is required'),
  startDate: Yup.date().required('Start date is required'),
  salary: Yup.number()
    .min(0, 'Salary must be greater than 0')
    .required('Salary is required'),
  phone: Yup.string(),
  address: Yup.string(),
});

const EmployeeForm = ({ open, employee, onClose, onSubmit }: EmployeeFormProps) => {
  const api = useApi();
  const { handleFileSelect, files, previews, clearFiles } = useFileUpload({
    multiple: false,
  });

  const { data: departments } = useQuery< Department[]>({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments'),
  });

  const formik = useFormik({
    initialValues: {
      name: employee?.name || '',
      email: employee?.email || '',
      position: employee?.position || '',
      departmentId: employee?.departmentId || '',
      gender: employee?.gender || '',
      birthDate: employee?.birthDate || '',
      startDate: employee?.startDate || '',
      salary: employee?.salary || 0,
      phone: employee?.phone || '',
      address: employee?.address || '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        let avatarUrl = employee?.avatar;

        if (files.length > 0) {
          // TODO: Replace with actual file upload API call
          const formData = new FormData();
          formData.append('file', files[0]);
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          avatarUrl = data.url;
        }

        await onSubmit({
          ...values,
          avatar: avatarUrl,
          gender: values.gender as typeof GENDER[keyof typeof GENDER],
        });
        clearFiles();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
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
                      {employee ? 'Edit Employee' : 'Add Employee'}
                    </Dialog.Title>
                    <div className="mt-6">
                      <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="avatar"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Avatar
                            </label>
                            <div className="mt-1 flex items-center space-x-4">
                              <div className="h-12 w-12 overflow-hidden rounded-full">
                                {previews[0] || employee?.avatar ? (
                                  <img
                                    src={previews[0] || employee?.avatar}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                    <span className="text-sm font-medium text-gray-600">
                                      No image
                                    </span>
                                  </div>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                              />
                            </div>
                          </div>

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
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email
                            </label>
                            <div className="mt-1">
                              <input
                                type="email"
                                id="email"
                                {...formik.getFieldProps('email')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.email && formik.errors.email
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              />
                              {formik.touched.email && formik.errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.email}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="position"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Position
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="position"
                                {...formik.getFieldProps('position')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.position && formik.errors.position
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              />
                              {formik.touched.position &&
                                formik.errors.position && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {formik.errors.position}
                                  </p>
                                )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="departmentId"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Department
                            </label>
                            <div className="mt-1">
                              <select
                                id="departmentId"
                                {...formik.getFieldProps('departmentId')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.departmentId &&
                                  formik.errors.departmentId
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              >
                                <option value="">Select department</option>
                                {departments?.map((dept) => (
                                  <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                  </option>
                                ))}
                              </select>
                              {formik.touched.departmentId &&
                                formik.errors.departmentId && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {formik.errors.departmentId}
                                  </p>
                                )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="gender"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Gender
                            </label>
                            <div className="mt-1">
                              <select
                                id="gender"
                                {...formik.getFieldProps('gender')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.gender && formik.errors.gender
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              >
                                <option value="">Select gender</option>
                                {Object.entries(GENDER).map(([key, value]) => (
                                  <option key={value} value={value}>
                                    {key.charAt(0) + key.slice(1).toLowerCase()}
                                  </option>
                                ))}
                              </select>
                              {formik.touched.gender && formik.errors.gender && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.gender}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="birthDate"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Birth Date
                            </label>
                            <div className="mt-1">
                              <input
                                type="date"
                                id="birthDate"
                                {...formik.getFieldProps('birthDate')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.birthDate &&
                                  formik.errors.birthDate
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              />
                              {formik.touched.birthDate &&
                                formik.errors.birthDate && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {formik.errors.birthDate}
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
                                } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
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
                              htmlFor="salary"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Salary
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                id="salary"
                                {...formik.getFieldProps('salary')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.salary && formik.errors.salary
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              />
                              {formik.touched.salary && formik.errors.salary && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.salary}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Phone
                            </label>
                            <div className="mt-1">
                              <input
                                type="tel"
                                id="phone"
                                {...formik.getFieldProps('phone')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.phone && formik.errors.phone
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              />
                              {formik.touched.phone && formik.errors.phone && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Address
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="address"
                                rows={3}
                                {...formik.getFieldProps('address')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.address && formik.errors.address
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              />
                              {formik.touched.address &&
                                formik.errors.address && (
                                  <p className="mt-2 text-sm text-red-600">
                                    {formik.errors.address}
                                  </p>
                                )}
                            </div>
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
                              : employee
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

export default EmployeeForm; 