import { useMutation } from '@tanstack/react-query';
import { resendActivation } from '../../../services/auth.service';

export const useResendActivation = () => {
  return useMutation({
    mutationFn: (email: string) => resendActivation(email),
  });
};
