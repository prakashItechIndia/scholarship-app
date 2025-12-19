import { useMutation } from '@tanstack/react-query';
import { createPassword } from '../../../services/auth.service';

export const useCreatePassword = () => {
  return useMutation({
    mutationFn: (payload: { token: string; password: string }) =>
      createPassword(payload),
  });
};
