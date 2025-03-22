import { useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';

export const useAuth = () => {
  const api = useApi();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me'),
  });

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAdmin,
  };
}; 