import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Stack, Text, Spinner, MessageBar, MessageBarType } from '@fluentui/react';
import { socialLogin, type SocialProvider } from '../../services/socialLogin.service';
import { scholarshipApplication } from '../../services/scholarship.service';
import { useToast } from '@/components/ui/toast';

const OAuthCallbackPage = () => {
  const { provider } = useParams<{ provider: SocialProvider }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      if (!provider || !['microsoft', 'google', 'apple'].includes(provider)) {
        setStatus('error');
        setErrorMessage('Invalid OAuth provider');
        error('Invalid Provider', 'The OAuth provider is not supported.');
        setTimeout(() => navigate('/user-login'), 3000);
        return;
      }

      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Handle OAuth errors
      if (errorParam) {
        setStatus('error');
        const message = errorDescription || errorParam || 'OAuth authentication failed';
        setErrorMessage(message);
        error('Authentication Failed', message);
        setTimeout(() => navigate('/user-login'), 3000);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setStatus('error');
        const message = 'Missing required OAuth parameters';
        setErrorMessage(message);
        error('Authentication Failed', message);
        setTimeout(() => navigate('/user-login'), 3000);
        return;
      }

      try {
        // Handle OAuth callback
        const result = await socialLogin.handleCallback(provider, code, state);

        if (result.success && result.user) {
          setStatus('success');

          // Extract user info (same format as manual login)
          const loginResponse = result.user as {
            userId?: number;
            userName?: string; // This is actually the email (User_ID)
            [key: string]: unknown;
          };

          // Check if user has completed registration (SAME LOGIC AS MANUAL LOGIN)
          // userName from backend is the email (User_ID in Tbl_UserMaster)
          const userEmail = loginResponse.userName || '';
          if (userEmail) {
            const hasCompletedRegistration = await scholarshipApplication.checkEmailExists(userEmail);

            if (hasCompletedRegistration) {
              // Existing user - has completed registration, redirect to dashboard (SAME AS MANUAL LOGIN)
              success('Sign In Successful', 'Redirecting to dashboard...');
              setTimeout(() => navigate('/user-dashboard'), 300);
            } else {
              // New user - hasn't completed registration, redirect to registration form (SAME AS MANUAL LOGIN)
              success('Sign In Successful', 'Please complete your registration...');
              setTimeout(() => navigate('/registration'), 300);
            }
          } else {
            // Fallback to dashboard if email not available
            success('Sign In Successful', 'Redirecting to dashboard...');
            setTimeout(() => navigate('/user-dashboard'), 300);
          }
        } else {
          setStatus('error');
          const message = result.error || 'Authentication failed';
          setErrorMessage(message);
          error('Authentication Failed', message);
          setTimeout(() => navigate('/user-login'), 3000);
        }
      } catch (err) {
        setStatus('error');
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setErrorMessage(message);
        error('Authentication Failed', message);
        setTimeout(() => navigate('/user-login'), 3000);
      }
    };

    void handleCallback();
  }, [provider, searchParams, navigate, success, error]);

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={{
        root: {
          minHeight: '100vh',
          padding: '20px',
        },
      }}
    >
      <Stack tokens={{ childrenGap: 16 }} horizontalAlign="center">
        {status === 'processing' && (
          <>
            <Spinner label="Authenticating..." labelPosition="bottom" />
            <Text variant="medium">Please wait while we authenticate you...</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <MessageBar messageBarType={MessageBarType.success}>
              Authentication successful! Redirecting...
            </MessageBar>
          </>
        )}

        {status === 'error' && (
          <>
            <MessageBar messageBarType={MessageBarType.error}>
              {errorMessage || 'Authentication failed. Please try again.'}
            </MessageBar>
            <Text variant="small">Redirecting to login page...</Text>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default OAuthCallbackPage;

