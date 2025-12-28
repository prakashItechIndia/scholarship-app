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
    // if (!email) {
    //   showError('Error', 'Email address is required');
    //   return;
    // }
    if (email) {
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

        <div style={{ textAlign: 'left', width: '100%', maxWidth: '440px', marginTop: '130px' }}>
          <Text variant="xxLarge" style={{
            display: 'block',

            fontWeight: 700,
            color: '#242424',
            fontSize: '20px',
            lineHeight: '28px'
          }}>
            Check your email
          </Text>

          {isSent && (
            <MessageBar messageBarType={MessageBarType.success} style={{ marginBottom: '16px' }}>
              Verification email sent successfully! Please check your inbox.
            </MessageBar>
          )}

          <div style={{ marginBottom: '14px' }}>
            <Text variant="medium" style={{
              color: '#616161',
              fontSize: '16px',
              lineHeight: '22px',
              fontFamily: 'Inter, sans-serif'
            }}>
              We’ve sent you a Verification link to<br />
              {email}<span style={{ color: '#616161' }}>.</span><br />
              Please check your inbox and click the link to<br />
              activate your account.
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Text variant="medium" style={{ color: '#616161', fontSize: '15px' }}>
              Didn’t receive an email?
            </Text>
            <button
              onClick={handleResendVerification}
              disabled={isSending || !email}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#2453C3',
                cursor: isSending || !email ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                opacity: isSending || !email ? 0.5 : 1,
              }}
            >
              {isSending ? 'Sending...' : 'Resend'}
            </button>
          </div>
        </div>
      </AuthLayoutWrapper>
    </>
  );
};

export default EmailVerificationPage;

