import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { SEO } from '../../components/seo/SEO';
import { generateOrganizationSchema } from '../../utils/schema';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { AuthPageHeader } from '@/components/auth/AuthPageHeader';
import { getBaseUrl } from '@/utils/signInUtils';
import { useToast } from '@/components/ui/toast';
import { scholarshipApplication } from '@/services/scholarship.service';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [hasAutoSent, setHasAutoSent] = useState(false);

  const token = searchParams.get('token');
  const emailFromParam = searchParams.get('email');

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

  const handleResendVerification = useCallback(async () => {
    if (!email) {
      showError('Error', 'Email address is required');
      return;
    }

    try {
      setIsSending(true);

      // Call API to send verification email
      const result = await scholarshipApplication.sendVerificationEmail(email);

      if (result.success) {
        setIsSent(true);
        success('Success', result.message || 'Verification email sent successfully!');
      } else {
        showError('Error', result.message || 'Failed to send verification email. Please try again.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification email. Please try again.';
      showError('Error', errorMessage);
    } finally {
      setIsSending(false);
    }
  }, [email, showError, success]);

  useEffect(() => {
    // Get email from localStorage or URL parameter
    const storedEmail = localStorage.getItem('verification_email');
    const emailToUse = emailFromParam || storedEmail || '';
    
    if (emailToUse) {
      setEmail(emailToUse);
    } else if (!token) {
      // No email and no token - redirect to login
      void navigate('/user-login');
    }

    // If token exists, verify it and redirect to set password page
    if (token) {
      const verifyToken = async () => {
        try {
          const verification = await scholarshipApplication.verifyEmailToken(token);
          if (verification.valid && verification.email) {
            localStorage.setItem('verification_token', token);
            localStorage.setItem('verification_email', verification.email);
            void navigate('/set-password?token=' + encodeURIComponent(token));
          } else {
            showError('Verification Failed', verification.message || 'Invalid or expired verification link.');
            setTimeout(() => void navigate('/user-login'), 3000);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to verify token.';
          showError('Error', errorMessage);
          setTimeout(() => void navigate('/user-login'), 3000);
        }
      };
      void verifyToken();
    } else if (emailToUse && !isSent && !hasAutoSent) {
      // Auto-send verification email when page loads with email but no token
      setHasAutoSent(true);
      void handleResendVerification();
    }
  }, [token, emailFromParam, navigate, showError, isSent, hasAutoSent, handleResendVerification]);

  return (
    <>
      <SEO
        title="Email Verification - Leo Muthu Scholarship"
        description="Verify your email address to complete your registration for Leo Muthu Scholarship."
        url="/email-verification"
        keywords="Leo Muthu Scholarship, email verification, registration"
        schema={organizationSchema}
      />
      <AuthLayoutWrapper footerVariant="email">
        <LogoHeader variant="email" />
        
        <AuthPageHeader
          title="Verify Your Email"
          subtitle="We've sent a verification link to your email address"
          titleSize="xxLarge"
          subtitleSize="medium"
        />

        {isSent && (
          <MessageBar messageBarType={MessageBarType.success} style={{ marginBottom: '16px' }}>
            Verification email sent successfully! Please check your inbox.
          </MessageBar>
        )}

        <Stack tokens={{ childrenGap: 24 }} style={{ width: '100%' }}>
          {email && (
            <div style={{ textAlign: 'center' }}>
              <Text variant="medium" style={{ color: '#616161', marginBottom: '8px' }}>
                Verification link has been sent to:
              </Text>
              <Text variant="large" style={{ fontWeight: 600, color: '#242424' }}>
                {email}
              </Text>
            </div>
          )}

          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <Text variant="medium" style={{ color: '#616161', lineHeight: '24px' }}>
              Please check your email and click on the verification link to continue.
              <br />
              The link will expire in 30 minutes.
            </Text>
          </div>

          <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            <button
              onClick={handleResendVerification}
              disabled={isSending || !email}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #2453C3',
                color: '#2453C3',
                borderRadius: '8px',
                cursor: isSending || !email ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                opacity: isSending || !email ? 0.5 : 1,
              }}
            >
              {isSending ? 'Sending...' : 'Resend Verification Email'}
            </button>
            <button
              onClick={() => void navigate('/user-login')}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#2453C3',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'underline',
              }}
            >
              Back to Login
            </button>
          </Stack>
        </Stack>
      </AuthLayoutWrapper>
    </>
  );
};

export default EmailVerificationPage;

