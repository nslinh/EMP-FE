import React, { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../types';
import { removeNotification } from '../store/slices/notificationSlice';
import { Notification } from '../types';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

const icons: Record<NotificationType, React.ReactElement> = {
  success: (
    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
  ),
  error: (
    <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
  ),
  warning: (
    <ExclamationTriangleIcon
      className="h-6 w-6 text-yellow-400"
      aria-hidden="true"
    />
  ),
  info: (
    <InformationCircleIcon
      className="h-6 w-6 text-blue-400"
      aria-hidden="true"
    />
  ),
};

const colors: Record<NotificationType, string> = {
  success: 'text-green-800 bg-green-50',
  error: 'text-red-800 bg-red-50',
  warning: 'text-yellow-800 bg-yellow-50',
  info: 'text-blue-800 bg-blue-50',
};

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications
  );

  useEffect(() => {
    notifications.forEach((notification: Notification) => {
      const duration = notification.duration || 5000;
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    });
  }, [notifications, dispatch]);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification: Notification) => (
          <Transition
            key={notification.id}
            show={true}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 ${
                colors[notification.type]
              }`}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">{icons[notification.type]}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    {notification.title && (
                      <p className="text-sm font-medium">{notification.title}</p>
                    )}
                    <p className="mt-1 text-sm">{notification.message}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                      onClick={() =>
                        dispatch(removeNotification(notification.id))
                      }
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        ))}
      </div>
    </div>
  );
};

export default Notifications; 