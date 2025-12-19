import { useMutation } from '@tanstack/react-query';
import {
  initMfaSetup,
  verifyAndEnableMfa,
  verifyMfaLogin,
  disableMfa,
} from '../../../services/mfa.service';

export const useInitMfaSetup = () => {
  return useMutation({
    mutationFn: () => initMfaSetup(),
  });
};

export const useVerifyAndEnableMfa = () => {
  return useMutation({
    mutationFn: (code: string) => verifyAndEnableMfa(code),
  });
};

export const useVerifyMfaLogin = () => {
  return useMutation({
    mutationFn: (payload: { userId: string; code: string }) =>
      verifyMfaLogin(payload.userId, payload.code),
  });
};

export const useDisableMfa = () => {
  return useMutation({
    mutationFn: () => disableMfa(),
  });
};
