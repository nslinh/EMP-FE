import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { loginSuccess } from '../../features/auth/authSlice';

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'employee';
    departmentId?: string;
  };
  token: string;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api = useApi();
  const { error } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const data = await api.post<LoginResponse>('/auth/login', values);
        console.log("onSubmit", data)
        dispatch(loginSuccess(data));
        navigate('/');
      } catch (err: any) {
        error(err.message || 'Failed to login');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="https://static.vecteezy.com/system/resources/previews/009/170/419/non_2x/a-unique-design-icon-of-employee-management-vector.jpg"
            alt="Your Company"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4 rounded-md">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`input-field ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`input-field ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formik.values.remember}
                  onChange={formik.handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:focus:ring-primary-600"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a
            href="#"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login; 