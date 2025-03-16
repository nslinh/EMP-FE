import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Salary, User, PaginatedResponse } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';

interface SalaryFormProps {
  open: boolean;
  salary: Salary | null;
  onClose: () => void;
  onSubmit: (values: Partial<Salary>) => Promise<void>;
}

interface SalaryFormValues {
  employeeId: string;
  baseSalary: number;
  allowance: number;
  bonus: number;
  deductions: number;
  month: number;
  year: number;
  status: 'pending' | 'paid';
}

const validationSchema = Yup.object({
  employeeId: Yup.string().required('Employee is required'),
  baseSalary: Yup.number()
    .required('Base salary is required')
    .min(0, 'Base salary must be greater than or equal to 0'),
  allowance: Yup.number()
    .required('Allowance is required')
    .min(0, 'Allowance must be greater than or equal to 0'),
  bonus: Yup.number()
    .required('Bonus is required')
    .min(0, 'Bonus must be greater than or equal to 0'),
  deductions: Yup.number()
    .required('Deductions is required')
    .min(0, 'Deductions must be greater than or equal to 0'),
  month: Yup.number()
    .required('Month is required')
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12'),
  year: Yup.number()
    .required('Year is required')
    .min(2000, 'Year must be 2000 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  status: Yup.string()
    .oneOf(['pending', 'paid'], 'Invalid status')
    .required('Status is required'),
});

const SalaryForm = ({ open, salary, onClose, onSubmit }: SalaryFormProps) => {
  const api = useApi();

  const { data: employees } = useQuery<PaginatedResponse<User>>({
    queryKey: ['employees'],
    queryFn: () => api.get('/employees'),
  });

  const formik = useFormik<SalaryFormValues>({
    initialValues: {
      employeeId: salary?.employeeId || '',
      baseSalary: salary?.baseSalary || 0,
      allowance: salary?.allowance || 0,
      bonus: salary?.bonus || 0,
      deductions: salary?.deductions || 0,
      month: salary?.month || new Date().getMonth() + 1,
      year: salary?.year || new Date().getFullYear(),
      status: salary?.status || 'pending',
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit({
        ...values,
        totalSalary:
          values.baseSalary +
          values.allowance +
          values.bonus -
          values.deductions,
      });
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
                      {salary ? 'Edit Salary Record' : 'Add Salary Record'}
                    </Dialog.Title>
                    <div className="mt-6">
                      <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                          <label
                            htmlFor="employeeId"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Employee
                          </label>
                          <div className="mt-1">
                            <select
                              id="employeeId"
                              {...formik.getFieldProps('employeeId')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.employeeId &&
                                formik.errors.employeeId
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            >
                              <option value="">Select employee</option>
                              {employees?.data.map((employee: any) => (
                                <option key={employee.id} value={employee.id}>
                                  {employee.name}
                                </option>
                              ))}
                            </select>
                            {formik.touched.employeeId &&
                              formik.errors.employeeId && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.employeeId}
                                </p>
                              )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="baseSalary"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Base Salary
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="baseSalary"
                              min={0}
                              step={0.01}
                              {...formik.getFieldProps('baseSalary')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.baseSalary &&
                                formik.errors.baseSalary
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.baseSalary &&
                              formik.errors.baseSalary && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.baseSalary}
                                </p>
                              )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="allowance"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Allowance
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="allowance"
                              min={0}
                              step={0.01}
                              {...formik.getFieldProps('allowance')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.allowance &&
                                formik.errors.allowance
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.allowance &&
                              formik.errors.allowance && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.allowance}
                                </p>
                              )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="bonus"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bonus
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="bonus"
                              min={0}
                              step={0.01}
                              {...formik.getFieldProps('bonus')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.bonus && formik.errors.bonus
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.bonus && formik.errors.bonus && (
                              <p className="mt-2 text-sm text-red-600">
                                {formik.errors.bonus}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="deductions"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Deductions
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              id="deductions"
                              min={0}
                              step={0.01}
                              {...formik.getFieldProps('deductions')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.deductions &&
                                formik.errors.deductions
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            />
                            {formik.touched.deductions &&
                              formik.errors.deductions && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.deductions}
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="month"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Month
                            </label>
                            <div className="mt-1">
                              <select
                                id="month"
                                {...formik.getFieldProps('month')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.month && formik.errors.month
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                  (month) => (
                                    <option key={month} value={month}>
                                      {month}
                                    </option>
                                  )
                                )}
                              </select>
                              {formik.touched.month && formik.errors.month && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.month}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="year"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Year
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                id="year"
                                min={2000}
                                max={new Date().getFullYear() + 1}
                                {...formik.getFieldProps('year')}
                                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                  formik.touched.year && formik.errors.year
                                    ? 'ring-red-300'
                                    : 'ring-gray-300'
                                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                              />
                              {formik.touched.year && formik.errors.year && (
                                <p className="mt-2 text-sm text-red-600">
                                  {formik.errors.year}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Status
                          </label>
                          <div className="mt-1">
                            <select
                              id="status"
                              {...formik.getFieldProps('status')}
                              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                formik.touched.status && formik.errors.status
                                  ? 'ring-red-300'
                                  : 'ring-gray-300'
                              } focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6`}
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                            </select>
                            {formik.touched.status && formik.errors.status && (
                              <p className="mt-2 text-sm text-red-600">
                                {formik.errors.status}
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
                              : salary
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

export default SalaryForm; 