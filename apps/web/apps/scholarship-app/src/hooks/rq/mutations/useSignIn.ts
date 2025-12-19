import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../../services/auth.service';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import { handleAuthRedirect } from '../../../utils/redirect';
import type { LoginResponseDto } from '@shared/_api';

interface SignInInput {
  email: string;
  password: string;
  productCode?: string;
  rememberMe?: boolean;
}

interface UseSignInOptions {
  redirectUrl?: string | null;
  productCode?: string | null;
  onSuccess?: (data: LoginResponseDto) => void;
}

export const useSignIn = (options?: UseSignInOptions) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignInInput) =>
      signIn({
        email: data.email,
        password: data.password,
        productCode: data.productCode,
      }),
    onSuccess: async (data, variables) => {
      // Check if MFA is required
      if (data.mfaRequired) {
        if (!data.userId || !data.tempToken) {
          throw new Error('Invalid MFA response');
        }

        // Store tempToken for MFA verification
        sessionStorage.setItem('mfa_temp_token', data.tempToken);

        // Build MFA verification URL with query params
        const mfaParams = new URLSearchParams({
          userId: data.userId,
          email: variables.email, // Add email to URL params
        });

        if (options?.productCode) {
          mfaParams.append('product', options.productCode);
        }

        if (options?.redirectUrl) {
          mfaParams.append('redirectUrl', options.redirectUrl);
        }

        // Use navigate instead of window.location.href for smooth client-side navigation
        void navigate(`/mfa-verify?${mfaParams.toString()}`);
        return;
      }

      // Regular login flow (no MFA)
      if (!data.accessToken || !data.user) {
        throw new Error('Invalid login response');
      }

      // Store tokens securely with encryption (shared across all iCaptur apps)
      // Use rememberMe from form input (defaults to true if not provided)
      const rememberMe = variables.rememberMe ?? true;
      const storedUser = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        tenantId: data.user.tenantId ?? null,
      };
      await secureTokenStorage.setTokens(
        data.accessToken,
        data.refreshToken ?? undefined,
        storedUser,
        rememberMe,
      );

      // Handle redirect - prioritize redirectUrl, then productCode, then default
      handleAuthRedirect(
        options?.redirectUrl ?? null,
        options?.productCode ?? null,
        data.accessToken,
        data.refreshToken ?? undefined,
        storedUser,
      );

      options?.onSuccess?.(data);
    },
  });
};
