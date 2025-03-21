import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { RootState } from '../../app/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UploadResponse {
  url: string;
}

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  avatar?: string;
}

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const api = useApi();
  const { success, error } = useNotification();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<ProfileFormValues>) => api.put(`/users/${user?.id}`, data),
    onSuccess: () => {
      success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update profile');
    },
  });

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string(),
      address: Yup.string(),
      currentPassword: Yup.string().when('newPassword', {
        is: (val: string) => val && val.length > 0,
        then: (schema) => schema.required('Current password is required'),
      }),
      newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string().when('newPassword', {
        is: (val: string) => val && val.length > 0,
        then: (schema) =>
          schema
            .required('Please confirm your password')
            .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
      }),
    }),
    onSubmit: async (values) => {
      try {
        await updateProfileMutation.mutateAsync(values);
      } catch (err) {
        // Error is handled by the mutation
      }
    },
  });

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<UploadResponse>('/upload', formData);
      await updateProfileMutation.mutateAsync({ avatar: response.url });
    } catch (err: any) {
      error(err.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="main-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-description">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Profile Picture</h3>
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
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {isUploading ? 'Uploading...' : 'Click to upload new picture'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="lg:col-span-2">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Personal Information</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...formik.getFieldProps('name')}
                      className={`input-field ${
                        formik.touched.name && formik.errors.name
                          ? 'border-red-500'
                          : ''
                      }`}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...formik.getFieldProps('email')}
                      className={`input-field ${
                        formik.touched.email && formik.errors.email
                          ? 'border-red-500'
                          : ''
                      }`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...formik.getFieldProps('phone')}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      {...formik.getFieldProps('address')}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Change Password</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                        formik.touched.currentPassword &&
                        formik.errors.currentPassword
                          ? 'border-red-500'
                          : ''
                      }`}
                    />
                    {formik.touched.currentPassword &&
                      formik.errors.currentPassword && (
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
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? 'border-red-500'
                          : ''
                      }`}
                    />
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.confirmPassword}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="btn btn-primary"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;