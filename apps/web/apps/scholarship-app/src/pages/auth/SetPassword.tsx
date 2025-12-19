import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, Text, mergeStyles } from '@fluentui/react';
import { SEO } from '../../components/seo/SEO';
import { generateOrganizationSchema } from '../../utils/schema';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { Form } from '@/components/ui/form';
import { Button } from '@shared/components';
import { FormField } from '@/components/ui/form';
import { FormFieldWrapper } from '@/components/auth/FormFieldWrapper';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { getBaseUrl } from '@/utils/signInUtils';
import { useToast } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';

const passwordSchema = z
  .object({
    password: z
      .string()
      .default('')
      .refine((val) => val.length >= 8, {
        message: 'Password must be at least 8 characters long',
      }),
    confirmPassword: z.string().default(''),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SetPasswordFormData = z.infer<typeof passwordSchema>;

const SetPasswordPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { success } = useToast();

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const baseUrl = getBaseUrl();
  const organizationSchema = generateOrganizationSchema({
    name: 'iCaptur',
    url: baseUrl,
    description: 'Secure single sign-on authentication for iCaptur products',
    contactPoint: {
      contactType: 'Customer Service',
      email: 'support@icaptur.ai',
    },
  });

  const onSubmit = (_values: SetPasswordFormData) => {
    // TODO: Implement password setting logic
    success('Success', 'Password set successfully!');
    setTimeout(() => void navigate('/signin'), 1000);
  };

  return (
    <>
      <SEO
        title="Set Password - Leo Muthu Scholarship"
        description="Set your password to enhance account security for Leo Muthu Scholarship."
        url="/set-password"
        noindex={true}
        schema={organizationSchema}
      />
      <AuthLayoutWrapper footerVariant="email">
        <div style={{ position: 'relative', top: '-180px', marginBottom: '-100px' }}>
          <LogoHeader variant="email" />
        </div>
        
        <Stack tokens={{ childrenGap: 24 }}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: 700, color: '#111827', lineHeight: '1.25', fontSize: '1.5rem' } }}>
            Set Password
          </Text>
          
          <Text variant="medium" styles={{ root: { color: '#707070', lineHeight: '1.5', fontSize: '1rem' } }}>
            Set your password to enhance account security.
          </Text>

          <Form {...form}>
            <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} noValidate>
              <Stack tokens={{ childrenGap: 24 }}>
                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormFieldWrapper label="New Password" required variant="email">
                      <div style={{ position: 'relative' }}>
                        <div
                          className={mergeStyles({
                            width: '100%',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#ffffff',
                          })}
                        >
                          <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center" styles={{ root: { padding: '0 12px' } }}>
                            {/* <KeyIcon style={{ width: '16px', height: '16px', color: '#616161', flexShrink: 0 }} /> */}
                            <input
                              {...field}
                              value={field.value ?? ''}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              className={mergeStyles({
                                width: '100%',
                                height: '45px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                fontSize: '14px',
                                lineHeight: '45px',
                                color: '#111827',
                                padding: '0 32px 0 0',
                                '::placeholder': {
                                  color: '#9ca3af',
                                },
                              })}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className={mergeStyles({
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#616161',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                ':hover': {
                                  color: '#424242',
                                },
                              })}
                              tabIndex={-1}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? (
                                <EyeIcon style={{ width: '20px', height: '20px' }} />
                              ) : (
                                <EyeOffIcon style={{ width: '20px', height: '20px' }} />
                              )}
                            </button>
                          </Stack>
                        </div>
                      </div>
                    </FormFieldWrapper>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormFieldWrapper label="Confirm Password" required variant="email">
                      <div style={{ position: 'relative' }}>
                        <div
                          className={mergeStyles({
                            width: '100%',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#ffffff',
                          })}
                        >
                          <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center" styles={{ root: { padding: '0 12px' } }}>
                            {/* <KeyIcon style={{ width: '16px', height: '16px', color: '#616161', flexShrink: 0 }} /> */}
                            <input
                              {...field}
                              value={field.value ?? ''}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              className={mergeStyles({
                                width: '100%',
                                height: '45px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                fontSize: '14px',
                                lineHeight: '45px',
                                color: '#111827',
                                padding: '0 32px 0 0',
                                '::placeholder': {
                                  color: '#9ca3af',
                                },
                              })}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className={mergeStyles({
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#616161',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                ':hover': {
                                  color: '#424242',
                                },
                              })}
                              tabIndex={-1}
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                              {showConfirmPassword ? (
                                <EyeIcon style={{ width: '20px', height: '20px' }} />
                              ) : (
                                <EyeOffIcon style={{ width: '20px', height: '20px' }} />
                              )}
                            </button>
                          </Stack>
                        </div>
                      </div>
                    </FormFieldWrapper>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  variant="primary"
                  styles={{
                    root: {
                      width: '100%',
                      height: '44px',
                      fontSize: '16px',
                      fontWeight: 600,
                    },
                  }}
                >
                  Continue
                </Button>

                <Text variant="small" styles={{ root: { color: '#4b5563', textAlign: 'center', lineHeight: '1.75' } }}>
                  By continuing, you agree to our{' '}
                  <span style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>
                    Privacy Policy
                  </span>
                  .
                </Text>
              </Stack>
            </form>
          </Form>
        </Stack>
      </AuthLayoutWrapper>
    </>
  );
};

export default SetPasswordPage;

