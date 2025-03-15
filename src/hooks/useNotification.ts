import { useCallback } from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { NOTIFICATION_TYPES } from '../constants';

interface NotificationOptions extends Omit<ToastOptions, 'type'> {
  type?: keyof typeof NOTIFICATION_TYPES;
}

export const useNotification = () => {
  const notify = useCallback(
    (message: string, { type = 'INFO', ...options }: NotificationOptions = {}) => {
      toast(message, {
        ...options,
        type: type.toLowerCase() as ToastOptions['type'],
      });
    },
    []
  );

  const success = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) => {
      notify(message, { ...options, type: 'SUCCESS' });
    },
    [notify]
  );

  const error = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) => {
      notify(message, { ...options, type: 'ERROR' });
    },
    [notify]
  );

  const warning = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) => {
      notify(message, { ...options, type: 'WARNING' });
    },
    [notify]
  );

  const info = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) => {
      notify(message, { ...options, type: 'INFO' });
    },
    [notify]
  );

  return {
    notify,
    success,
    error,
    warning,
    info,
  };
}; 