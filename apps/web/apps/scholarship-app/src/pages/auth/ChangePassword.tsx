import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/seo/SEO';
import { IconButton, PrimaryButton } from '@fluentui/react';
import { Input } from '@shared/components';
import { KeyIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@shared/components';
import { useToast } from '@/components/ui/toast';
import { apiClient } from '../../shared/api-client';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import type { ChangePasswordDto, ChangePasswordResponseDto } from '@shared/_api';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .default('')
      .refine((val) => val.length >= 12, {
        message: 'Password must be at least 12 characters long',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter (A-Z)',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter (a-z)',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must contain at least one number (0-9)',
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: 'Password must contain at least one special character (!@#$%^&*)',
      }),
    confirmPassword: z.string().default(''),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof schema>;

const changePassword = async (
  payload: ChangePasswordDto,
): Promise<ChangePasswordResponseDto> => {
  // apiClient interceptor automatically adds Authorization header
  const response = await apiClient.post<ChangePasswordResponseDto>(
    '/auth/change-password',
    payload,
  );
  return response.data;
};

const ChangePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success, error } = useToast();

  const returnUrl = searchParams.get('returnUrl');

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordDto) => changePassword(data),
    onSuccess: async (data) => {
      // Update tokens so the user stays logged in after changing password
      try {
        if (data.accessToken) {
          // Prefer user from response, fallback to decoding the token for minimal fields
          let user = data.user;
          if (!user) {
            try {
              const payload = JSON.parse(atob(data.accessToken.split('.')[1])) as {
                sub?: string;
                email?: string;
                role?: string;
                tenantId?: string | null;
                firstName?: string;
                lastName?: string;
              };
              if (payload.sub && payload.email && payload.role) {
                user = {
                  id: payload.sub,
                  email: payload.email,
                  role: payload.role,
                  tenantId: payload.tenantId ?? undefined,
                  firstName: payload.firstName ?? '',
                  lastName: payload.lastName ?? '',
                };
              }
            } catch (decodeError) {
              console.warn('Failed to decode access token after password change', decodeError);
            }
          }

          await secureTokenStorage.setTokens(
            data.accessToken,
            data.refreshToken ?? undefined,
            user ?? undefined,
          );

          // Re-check auth status to refresh context state
          await checkAuthStatus();
        }
      } catch (tokenError) {
        console.error('Failed to update tokens after password change', tokenError);
      }

      success('Success', 'Password changed successfully.');
      // Redirect back to the return URL or to sign in
      if (returnUrl) {
        window.location.href = returnUrl;
      } else {
        void navigate('/signin');
      }
    },
    onError: (err: Error) => {
      error(
        'Change Password Failed',
        err.message || 'Unable to change password. Please try again.',
      );
    },
  });

  const onSubmit = (values: ChangePasswordFormData) => {
    mutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  // Redirect to sign in if not authenticated
  if (!loading && !isAuthenticated) {
    const signInUrl = returnUrl
      ? `/signin?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/signin';
    void navigate(signInUrl);
    return null;
  }

  if (loading) {
    return (
      <AuthWrapper title="Loading...">
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <>
      <SEO
        title="Change Password"
        description="Change your iCaptur account password. Password must be at least 12 characters with uppercase, lowercase, number, and special character."
        url="/change-password"
        keywords="change password, update password, secure password, iCaptur password"
        noindex={true}
      />
      <AuthWrapper
        title="Change Password"
        subtitle="Update your account password. Your password must be at least 12 characters long and include uppercase, lowercase, number, and special character (!@#$%^&*)."
      >
        <div className="flex flex-col gap-[24px]">
          <Form {...form}>
            <form
              className="flex flex-col gap-[16px]"
              onSubmit={(e) => {
                void form.handleSubmit(onSubmit)(e);
              }}
              noValidate
            >
              {/* Current Password Field */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type={showCurrentPassword ? 'text' : 'password'}
                        prefixIcon={<KeyIcon />}
                        suffixIcon={
                          <IconButton
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            ariaLabel={showCurrentPassword ? 'Hide password' : 'Show password'}
                            onRenderIcon={() => 
                              showCurrentPassword ? (
                                <EyeOffIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest" />
                              ) : (
                                <EyeIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest" />
                              )
                            }
                            styles={{
                              root: {
                                width: 'auto',
                                height: 'auto',
                                minWidth: 'auto',
                                padding: '4px',
                                background: 'transparent',
                                border: 'none',
                              },
                              rootHovered: {
                                background: 'transparent',
                              },
                              rootPressed: {
                                background: 'transparent',
                              },
                            }}
                          />
                        }
                        placeholder="Enter your current password"
                        aria-invalid={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                  </FormItem>
                )}
              />

              {/* New Password Field */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type={showNewPassword ? 'text' : 'password'}
                        prefixIcon={<KeyIcon />}
                        suffixIcon={
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            ariaLabel={showNewPassword ? 'Hide password' : 'Show password'}
                            onRenderIcon={() => 
                              showNewPassword ? (
                                <EyeOffIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest" />
                              ) : (
                                <EyeIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest" />
                              )
                            }
                            className="w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent focus:outline-none"
                          />
                        }
                        placeholder="Enter your new password"
                        aria-invalid={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        prefixIcon={<KeyIcon />}
                        suffixIcon={
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            ariaLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                            onRenderIcon={() => 
                              showConfirmPassword ? (
                                <EyeOffIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest" />
                              ) : (
                                <EyeIcon className="w-4 h-4 text-Neutral-Foreground-2-Rest hover:text-Neutral-Foreground-1-Rest" />
                              )
                            }
                            className="w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent focus:outline-none"
                          />
                        }
                        placeholder="Confirm your new password"
                        aria-invalid={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <PrimaryButton
                type="submit"
                disabled={mutation.isPending}
                className="w-full rounded-[6px] bg-[#0f6cbd] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0e5ca8] disabled:opacity-50"
              >
                {mutation.isPending ? 'Changing Password...' : 'Change Password'}
              </PrimaryButton>
            </form>
          </Form>

          {/* Cancel/Back Link */}
          {returnUrl && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  window.location.href = returnUrl;
                }}
                className="text-sm text-[#0f6cbd] hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </AuthWrapper>
    </>
  );
};

export default ChangePasswordPage;

