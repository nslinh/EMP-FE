import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import { ApiError } from '../types';

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export const useApi = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const request = useCallback(
    async <T>(
      method: string,
      url: string,
      options: RequestOptions = {}
    ): Promise<T> => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      try {
        const response = await fetch(`${baseUrl}${url}`, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: options.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          const error: ApiError = {
            message: data.message || 'Something went wrong',
            code: response.status.toString(),
            errors: data.errors,
          };
          throw error;
        }

        return data;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          throw error;
        }

        throw {
          message: error.message || 'Something went wrong',
          code: error.code || 'UNKNOWN_ERROR',
          errors: error.errors,
        };
      }
    },
    [token]
  );

  const get = useCallback(
    <T>(url: string, options?: RequestOptions) =>
      request<T>('GET', url, options),
    [request]
  );

  const post = useCallback(
    <T>(url: string, data?: any, options?: RequestOptions) =>
      request<T>('POST', url, { ...options, body: data }),
    [request]
  );

  const put = useCallback(
    <T>(url: string, data?: any, options?: RequestOptions) =>
      request<T>('PUT', url, { ...options, body: data }),
    [request]
  );

  const patch = useCallback(
    <T>(url: string, data?: any, options?: RequestOptions) =>
      request<T>('PATCH', url, { ...options, body: data }),
    [request]
  );

  const del = useCallback(
    <T>(url: string, options?: RequestOptions) =>
      request<T>('DELETE', url, options),
    [request]
  );

  return {
    get,
    post,
    put,
    patch,
    delete: del,
  };
}; 