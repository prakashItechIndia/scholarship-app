import { useMutation } from '@tanstack/react-query';
import { checkEmail } from '../../../services/auth.service';

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: (email: string) => checkEmail(email),
  });
};
