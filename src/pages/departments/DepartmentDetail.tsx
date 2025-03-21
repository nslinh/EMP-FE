import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DepartmentDetail as DepartmentDetailType } from '../../types/department';
import { format } from 'date-fns';

interface DepartmentDetailProps {
  open: boolean;
  data?: DepartmentDetailType;
  onClose: () => void;
}

const DepartmentDetail = ({ open, data, onClose }: DepartmentDetailProps) => {
  if (!data) return null;

  const { department, employees } = data;

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Chi tiết phòng ban
                    </Dialog.Title>

                    {/* Department Info */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Tên phòng ban</h4>
                        <p className="mt-1 text-sm text-gray-900">{department.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Quản lý</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {department.manager?.fullName || 'Chưa có quản lý'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Mô tả</h4>
                        <p className="mt-1 text-sm text-gray-900">{department.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Số lượng nhân viên</h4>
                        <p className="mt-1 text-sm text-gray-900">{department.employeeCount}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Trạng thái</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {department.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </p>
                      </div>
                    </div>

                    {/* Employees List */}
                    <div className="mt-8">
                      <h4 className="text-base font-medium text-gray-900">Danh sách nhân viên</h4>
                      <div className="mt-4 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead>
                                <tr>
                                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                    Họ tên
                                  </th>
                                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Chức vụ
                                  </th>
                                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Ngày bắt đầu
                                  </th>
                                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Số điện thoại
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {employees.map((employee) => (
                                  <tr key={employee._id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                                      {employee.fullName}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                      {employee.position}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                      {format(new Date(employee.startDate), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                      {employee.phoneNumber}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Đóng
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DepartmentDetail; 