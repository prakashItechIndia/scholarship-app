import { Stack, Text, mergeStyles } from '@fluentui/react';
import { Button } from '@shared/components';
import microsoftIcon from '@shared/assets/icons/microsoft.svg';
import googleIcon from '@shared/assets/icons/google.svg';
import appleIcon from '@shared/assets/icons/apple.svg';

interface SocialLoginButtonProps {
  provider: 'microsoft' | 'google' | 'apple';
  onClick?: () => void;
}

const PROVIDER_CONFIG = {
  microsoft: {
    name: 'Microsoft',
    icon: microsoftIcon,
  },
  google: {
    name: 'Google',
    icon: googleIcon,
  },
  apple: {
    name: 'Apple',
    icon: appleIcon,
  },
};

export const SocialLoginButton = ({ provider, onClick }: SocialLoginButtonProps) => {
  const config = PROVIDER_CONFIG[provider];

  const buttonStyles = mergeStyles({
    flex: 1,
    height: '34px !important',
    padding: '10px 0px !important',
    backgroundColor: '#ffffff',
    border: '0.53px solid #4D4D4D !important',
    borderRadius: '6.38px !important',
    ':hover': {
      backgroundColor: '#f9fafb',
      border: '1px solid #4D4D4D',
    },
   
  });

  return (
    <Button
      type="button"
      appearance="primary"
      onClick={onClick}
      className={buttonStyles}
    >
      <Stack horizontal tokens={{ childrenGap: 10}} verticalAlign="center" horizontalAlign="start" >
        <img
          src={config.icon}
          alt={config.name}
          style={{
            width: '18px',
            height: '18px',
          }}
        />
        <Text variant="small" styles={{ root: { fontWeight: 400, color: '#424242',fontSize: '10px' } }}>
          {config.name}
        </Text>
      </Stack>
    </Button>
  );
};

