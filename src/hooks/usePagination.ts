import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  offset: number;
}

export const usePagination = ({
  initialPage = 1,
  initialLimit = DEFAULT_PAGE_SIZE,
}: UsePaginationOptions = {}): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handleSetPage = (newPage: number) => {
    if (newPage < 1) {
      setPage(1);
    } else {
      setPage(newPage);
    }
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  return {
    page,
    setPage: handleSetPage,
    limit,
    setLimit: handleSetLimit,
    offset: (page - 1) * limit,
  };
}; 