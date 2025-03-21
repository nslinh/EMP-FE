import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { RootState, User } from '../../types';
import { setTheme } from '../../store/slices/themeSlice';
import { setUser } from '../../store/slices/authSlice';

const Settings = () => {
  const api = useApi();
  const dispatch = useDispatch();
  const { success, error } = useNotification();
  const user = useSelector((state: RootState) => state.auth.user);
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof formData) => api.put<{ data: User }>('/auth/profile', data),
    onSuccess: (response) => {
      success('Profile updated successfully');
      dispatch(setUser(response.data));
      setIsEditing(false);
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update profile');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync(formData);
  };

  const handleThemeChange = (mode: 'light' | 'dark') => {
    dispatch(setTheme(mode));
  };

  return (
    <div className="divide-y divide-gray-200">
      {/* Profile Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Update your personal information and preferences.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:col-span-2"
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone number
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
              <div className="mt-2">
                <textarea
                  id="address"
                  rows={3}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={!isEditing}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="ml-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Theme Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Theme
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Customize your application theme.
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <div className="flex items-center gap-x-3">
                <input
                  type="radio"
                  id="light"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label
                  htmlFor="light"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Light
                </label>
              </div>
              <div className="mt-4 flex items-center gap-x-3">
                <input
                  type="radio"
                  id="dark"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label
                  htmlFor="dark"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Dark
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 