export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unexpected error occurred');
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
}; 