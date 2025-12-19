import { useQuery } from '@tanstack/react-query';
import { getMfaStatus } from '../../../services/mfa.service';

export const useMfaStatus = () => {
  return useQuery({
    queryKey: ['mfa', 'status'],
    queryFn: () => getMfaStatus(),
  });
};
