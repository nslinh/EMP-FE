import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export const useApi = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const baseUrl = import.meta.env.VITE_API_URL || '/api';

  const request = async <T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> => {
    const { requireAuth = true, headers = {}, ...rest } = options;

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (requireAuth && token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: requestHeaders,
      ...rest,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  return {
    get: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { method: 'GET', ...options }),
    post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
      request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        ...options,
      }),
    put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
      request<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
        ...options,
      }),
    delete: <T>(endpoint: string, options?: RequestOptions) =>
      request<T>(endpoint, { method: 'DELETE', ...options }),
  };
}; 