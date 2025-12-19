import { Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { Button } from '@/components/ui/button';
import { AuthWrapper } from './AuthWrapper';

interface CheckEmailStepProps {
  maskedEmail: string;
  resendCooldown: number;
  onResend: () => void;
  onBack: () => void;
}

export const CheckEmailStep = ({ maskedEmail, resendCooldown, onResend, onBack }: CheckEmailStepProps) => {
  return (
    <AuthWrapper title="Check your email" subtitle="We've sent an activation link to your email address.">
      <Stack tokens={{ childrenGap: 24 }}>
        <MessageBar messageBarType={MessageBarType.info}>
          <strong>{maskedEmail}</strong>
        </MessageBar>
        <Text variant="medium" styles={{ root: { color: '#707070' } }}>
          Please check your inbox and click the activation link to activate your account.
        </Text>

        <Stack tokens={{ childrenGap: 12 }}>
          <Button
            onClick={onResend}
            disabled={resendCooldown > 0}
            variant="primary"
            styles={{
              root: {
                width: '100%',
                height: '44px',
              },
            }}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Didn't receive email? Resend"}
          </Button>

          <Button
            onClick={onBack}
            variant="default"
            styles={{
              root: {
                width: '100%',
                height: '44px',
              },
            }}
          >
            Back to Sign-in
          </Button>
        </Stack>
      </Stack>
    </AuthWrapper>
  );
};

