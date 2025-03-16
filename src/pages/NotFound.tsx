import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-xl px-4 py-8 text-center">
        {/* 404 Image or Icon */}
        <div className="mb-8 text-primary-600 dark:text-primary-400">
          <svg
            className="mx-auto h-32 w-32"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">
            404
          </h1>
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for. Perhaps you've
            mistyped the URL? Be sure to check your spelling.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go back home
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;