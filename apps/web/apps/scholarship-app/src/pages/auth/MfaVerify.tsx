import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyMfaLogin } from '../../services/mfa.service';
import { secureTokenStorage } from '@shared/utils/secureTokenStorage';
import { handleAuthRedirect } from '../../utils/redirect';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SEO } from '../../components/seo/SEO';
import { PrimaryButton } from '@fluentui/react';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@shared/components';
import { useToast } from '@/components/ui/toast';

const mfaSchema = z.object({
  code: z
    .string()
    .default('')
    .refine(
      (val) => {
        const trimmed = val.trim();
        // If empty, fail this check to show "required" message
        if (trimmed.length === 0) return false;
        // If has content but not 6 digits, fail with "Invalid verification code"
        return /^\d{6}$/.test(trimmed);
      },
      (val) => {
        const trimmed = val.trim();
        // Show "required" message if empty
        if (trimmed.length === 0) {
          return { message: 'Verification code is required' };
        }
        // Show "Invalid verification code" if user has started typing but not complete
        return { message: 'Invalid verification code' };
      }
    ),
});

type MfaFormData = z.infer<typeof mfaSchema>;

export default function MfaVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const email = searchParams.get('email') ?? 'user@example.com';
  const productCode = searchParams.get('product');
  const redirectUrl = searchParams.get('redirectUrl');
  const { success, error } = useToast();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<MfaFormData>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: '',
    },
  });

  const { handleSubmit, setValue } = form;

  const verifyMutation = useMutation({
    mutationFn: (code: string) => {
      // Get tempToken from sessionStorage if available
      const tempToken = sessionStorage.getItem('mfa_temp_token') ?? undefined;
      return verifyMfaLogin(
        userId!,
        code,
        productCode ?? undefined,
        tempToken,
      );
    },
    onSuccess: async (data) => {
      // Clear tempToken after successful verification
      sessionStorage.removeItem('mfa_temp_token');
      // Check if verification was successful and tokens were returned
      if (!data.success || !data.accessToken || !data.user) {
        // Verification failed or incomplete response
        error('Verification Failed', 'Invalid verification code. Please try again.');
        void navigate('/user-login');
        return;
      }

      success('Success', 'Verification successful. Signing you in...');

      // Store tokens securely
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
      );

      // Redirect to the appropriate destination
      handleAuthRedirect(
        redirectUrl,
        productCode,
        data.accessToken,
        data.refreshToken ?? undefined,
        storedUser,
      );
    },
    onError: (err: Error) => {
      error(
        'Verification Failed',
        err.message || 'Invalid verification code. Please try again or use a backup code.',
      );
    },
  });

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Update form value when digits change
  useEffect(() => {
    const code = digits.join('');
    setValue('code', code, { shouldValidate: code.length > 0 });
  }, [digits, setValue]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    const newDigits = [...digits];

    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newDigits[i] = pastedData[i];
    }

    setDigits(newDigits);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newDigits.findIndex((d) => !d);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const onSubmit = (data: MfaFormData) => {
    if (!userId) return;
    verifyMutation.mutate(data.code);
  };

  if (!userId) {
    return (
      <AuthWrapper title="Invalid Request" subtitle="User ID not provided">
        <div className="text-center">
          <button
            onClick={() => {
              void navigate('/user-login');
            }}
            className="text-[12px] font-medium text-[#0f6cbd] hover:text-[#0e5ca8] underline"
          >
            Return to Sign In
          </button>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <>
      <SEO
        title="Multi-Factor Authentication"
        description="Enter the 6-digit verification code from your authenticator app to complete sign-in to your iCaptur account."
        url="/mfa-verify"
        keywords="MFA, multi-factor authentication, two-factor authentication, 2FA, verification code"
        noindex={true}
      />
      <AuthWrapper
        emailOrUsername={email}
        title="Enter the 6-digit code"
        subtitle="Please enter in the code displayed on your authenticator app from your device"
      >
        <div className="flex flex-col gap-[24px]">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
              }}
              className="flex flex-col gap-[16px]"
              noValidate
            >
              <FormField
                control={form.control}
                name="code"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-[8px]">
                        {/* 6-digit input boxes */}
                        <div className="flex gap-[8px] justify-between">
                          {digits.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => (inputRefs.current[index] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleDigitChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              onPaste={handlePaste}
                              className="w-[60px] h-[60px] text-center text-[24px] font-semibold bg-Neutral-Background-2-Rest border border-[#d1d1d1] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0f6cbd] focus:border-[#0f6cbd]"
                              aria-label={`Digit ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-Status-Danger-Foreground-1-Rest text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-[8px]">
                <PrimaryButton
                  type="submit"
                  disabled={verifyMutation.isPending}
                  className="w-full"
                >
                  {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
                </PrimaryButton>

                <p className="text-[10px] text-Neutral-Foreground-2-Rest leading-[16px]">
                  <span>By continuing, you agree to our</span>
                  <span className="text-[10px] font-bold text-Neutral-Foreground-2-Rest leading-[16px]">
                    Terms of Service
                  </span>
                  <span className="text-Neutral-Foreground-2-Rest font-medium"> </span>
                  <span>and </span>
                  <span className="text-[10px] font-bold text-Neutral-Foreground-2-Rest leading-[16px]">
                    Privacy Policy
                  </span>
                  <span className="text-Neutral-Foreground-2-Rest font-medium">.</span>
                </p>
              </div>
            </form>
          </Form>

          {/* Sign in another way link */}
          <div> 
            <p className="text-[12px] text-Neutral-Foreground-2-Rest leading-[20px]">
              <span>Having trouble? </span>
              <button
                onClick={() => {
                  void navigate('/user-login');
                }}
                className="text-[12px] font-medium text-Neutral-Foreground-2-Rest underline decoration-solid underline-offset-0 leading-[20px] hover:text-Neutral-Foreground-1-Rest"
              >
                Sign in another way
              </button>
            </p>
          </div>
        </div>
      </AuthWrapper>
    </>
  );
}
