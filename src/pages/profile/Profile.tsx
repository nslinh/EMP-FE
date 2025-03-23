import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { RootState } from '../../app/store';
import { useMutation } from '@tanstack/react-query';

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const api = useApi();
  const { success, error } = useNotification();
  const [isUploading, setIsUploading] = useState(false);

  // Mutation cho upload avatar
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/employees/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.avatarUrl;
    },
    onSuccess: () => {
      success('Avatar updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update avatar');
    },
  });

  // Xử lý upload avatar
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user?.role !== 'employee') {
      error('Update avatar: Only employees can update their avatar');
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadAvatarMutation.mutateAsync(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Mutation cho đổi mật khẩu
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => 
      api.post('/users/change-password', data),
    onSuccess: () => {
      success('Password changed successfully');
      formik.resetForm();
    },
    onError: (err: any) => {
      error(err.message || 'Failed to change password');
    },
  });

  const formik = useFormik<ChangePasswordValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .required('Current password is required'),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: async (values) => {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    },
  });

  return (
    <div className="main-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-description">
          View your profile information and change password.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Profile Information</h3>
            </div>
            <div className="card-body">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={user?.avatar || 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611731.jpg?semt=ais_hybrid'}
                    alt={user?.name}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {isUploading ? 'Uploading...' : 'Click to change avatar'}
                </p>
                <div className="mt-4 space-y-3 w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Role</label>
                    <input
                      type="text"
                      value={user?.role || ''}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-75"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="lg:col-span-2">
          <form onSubmit={formik.handleSubmit}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Change Password</h3>
              </div>
              <div className="card-body">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      {...formik.getFieldProps('currentPassword')}
                      className={`input-field ${
                        formik.touched.currentPassword && formik.errors.currentPassword
                          ? 'border-red-500'
                          : ''
                      }`}
                    />
                    {formik.touched.currentPassword && formik.errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      {...formik.getFieldProps('newPassword')}
                      className={`input-field ${
                        formik.touched.newPassword && formik.errors.newPassword
                          ? 'border-red-500'
                          : ''
                      }`}
                    />
                    {formik.touched.newPassword && formik.errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      {...formik.getFieldProps('confirmPassword')}
                      className={`input-field ${
                        formik.touched.confirmPassword && formik.errors.confirmPassword
                          ? 'border-red-500'
                          : ''
                      }`}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-footer flex justify-end">
                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="btn btn-primary"
                >
                  {changePasswordMutation.isPending ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;