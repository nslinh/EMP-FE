import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from "moment";
import { Employee } from '../../types/employee';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';

interface EmployeeFormProps {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const createValidationSchema = Yup.object({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  fullName: Yup.string().required('Họ tên là bắt buộc'),
  dateOfBirth: Yup.date().required('Ngày sinh là bắt buộc'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ')
    .required('Giới tính là bắt buộc'),
  address: Yup.string().required('Địa chỉ là bắt buộc'),
  phoneNumber: Yup.string().required('Số điện thoại là bắt buộc'),
  department: Yup.string().required('Phòng ban là bắt buộc'),
  position: Yup.string().required('Chức vụ là bắt buộc'),
  salary: Yup.number()
    .min(0, 'Lương phải lớn hơn 0')
    .required('Lương là bắt buộc'),
  startDate: Yup.date().required('Ngày bắt đầu là bắt buộc')
});

const updateValidationSchema = Yup.object({
  fullName: Yup.string().required('Họ tên là bắt buộc'),
  dateOfBirth: Yup.date().required('Ngày sinh là bắt buộc'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ')
    .required('Giới tính là bắt buộc'),
  address: Yup.string().required('Địa chỉ là bắt buộc'),
  phoneNumber: Yup.string().required('Số điện thoại là bắt buộc'),
  department: Yup.string().required('Phòng ban là bắt buộc'),
  position: Yup.string().required('Chức vụ là bắt buộc'),
  salary: Yup.number()
    .min(0, 'Lương phải lớn hơn 0')
    .required('Lương là bắt buộc'),
  startDate: Yup.date().required('Ngày bắt đầu là bắt buộc')
});

const EmployeeForm = ({ open, employee, onClose, onSubmit }: EmployeeFormProps) => {
  const api = useApi();

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/departments')
  });

  const formik = useFormik({
    initialValues: employee ? {
      fullName: employee.fullName || '',
      dateOfBirth: employee.dateOfBirth?.split('T')[0] || '',
      gender: employee.gender || '',
      address: employee.address || '',
      phoneNumber: employee.phoneNumber || '',
      department: employee.department._id || '',
      position: employee.position || '',
      salary: employee.baseSalary || 0,
      startDate: moment(employee.startDate, "DD/MM/YYYY").format("YYYY-MM-DD") || ''
    } : {
      email: '',
      password: '',
      fullName: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      phoneNumber: '',
      department: '',
      position: '',
      salary: 0,
      startDate: ''
    },
    validationSchema: employee ? updateValidationSchema : createValidationSchema,
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
                    {employee ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
                  </Dialog.Title>
                  <div className="mt-6">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                      {!employee && (
                        <>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              {...formik.getFieldProps('email')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {formik.touched.email && formik.errors.email && (
                              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                              Mật khẩu
                            </label>
                            <input
                              type="password"
                              {...formik.getFieldProps('password')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                            {formik.touched.password && formik.errors.password && (
                              <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
                            )}
                          </div>
                        </>
                      )}
                      
                      {/* Các trường thông tin khác */}
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                          Họ tên
                        </label>
                        <input
                          type="text"
                          {...formik.getFieldProps('fullName')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.fullName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                            Ngày sinh
                          </label>
                          <input
                            type="date"
                            {...formik.getFieldProps('dateOfBirth')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.dateOfBirth}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Giới tính
                          </label>
                          <select
                            {...formik.getFieldProps('gender')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                          {formik.touched.gender && formik.errors.gender && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.gender}</p>
                          )}
                        </div>
                      </div>

                      {/* Các trường còn lại */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                            Phòng ban
                          </label>
                          <select
                            {...formik.getFieldProps('department')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          >
                            <option value="">Chọn phòng ban</option>
                            {departments?.map((dept: any) => (
                              <option key={dept._id} value={dept._id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                          {formik.touched.department && formik.errors.department && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.department}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                            Chức vụ
                          </label>
                          <input
                            type="text"
                            {...formik.getFieldProps('position')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          {formik.touched.position && formik.errors.position && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.position}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                            Lương
                          </label>
                          <input
                            type="number"
                            {...formik.getFieldProps('salary')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          {formik.touched.salary && formik.errors.salary && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.salary}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Ngày bắt đầu
                          </label>
                          <input
                            type="date"
                            {...formik.getFieldProps('startDate')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          {formik.touched.startDate && formik.errors.startDate && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.startDate}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          {...formik.getFieldProps('phoneNumber')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.phoneNumber}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Địa chỉ
                        </label>
                        <textarea
                          {...formik.getFieldProps('address')}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        {formik.touched.address && formik.errors.address && (
                          <p className="mt-2 text-sm text-red-600">{formik.errors.address}</p>
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
                            : employee
                            ? 'Cập nhật'
                            : 'Thêm mới'}
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

export default EmployeeForm; 