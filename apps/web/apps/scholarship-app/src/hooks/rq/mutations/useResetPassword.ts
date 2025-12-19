import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../../services/auth.service';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: { token: string; newPassword: string }) =>
      resetPassword(payload.token, payload.newPassword),
  });
};
