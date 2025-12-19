import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../../services/auth.service';

export const useGetMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => getMe(),
  });
};
