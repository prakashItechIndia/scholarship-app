import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Stack, Text } from '@fluentui/react';
import { SEO } from '../../components/seo/SEO';
import { generateOrganizationSchema } from '../../utils/schema';
import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { LogoHeader } from '@/components/auth/LogoHeader';
import { getBaseUrl, createResendTimer } from '../../utils/signInUtils';
import { useToast } from '@/components/ui/toast';

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { success } = useToast();

  // Get email from URL params or localStorage
  const emailFromParams = searchParams.get('email');
  const emailFromStorage = localStorage.getItem('verification_email');
  const enteredEmail = emailFromParams || emailFromStorage || '';

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

  const handleResendActivation = () => {
    if (enteredEmail && resendCooldown === 0) {
      success('Success', 'Activation email sent successfully. Please check your inbox.');
      setResendCooldown(60);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = createResendTimer((value) => {
        setResendCooldown(value);
        if (typeof value === 'number' && value === 0 && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      });
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <SEO
        title="Check Your Email"
        description="We've sent an activation link to your email address. Please check your inbox to activate your account."
        url="/verification"
        noindex={true}
        schema={organizationSchema}
      />
      <AuthLayoutWrapper footerVariant="email">
        <div style={{ position: 'relative', top: '-180px', marginBottom: '-100px' }}>
          <LogoHeader variant="email" />
        </div>
        
        <Stack tokens={{ childrenGap: 24 }}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: 700, color: '#111827', lineHeight: '1.25',fontSize:'1.25rem' } }}>
            Check your email
          </Text>
          
          <Text variant="medium" styles={{ root: { color: '#707070', lineHeight: '1.5',fontSize:'1rem' } }}>
            We've sent you a Verification link to
            <br />
            {enteredEmail && (
              <span style={{ color: '#707070', fontWeight: 600 }}>{enteredEmail}</span>
            )}
            <br />
            Please check your inbox and click the link to <br />activate your account.
          </Text>

          <Stack tokens={{ childrenGap: 12 }}>
            <Text variant="small" styles={{ root: { color: '#707070',fontSize:'1rem' } }}>
              Didn't receive an email?{' '}
              <button
                onClick={handleResendActivation}
                disabled={resendCooldown > 0}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1d4ed8',
                  cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                  textDecoration: 'none',
                  padding: 0,
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
              </button>
            </Text>
          </Stack>
        </Stack>
      </AuthLayoutWrapper>
    </>
  );
};

export default VerificationPage;

