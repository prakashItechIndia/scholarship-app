import { Stack, Text } from '@fluentui/react';
import { Button } from '@/components/ui/button';
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

  return (
    <Button
      type="button"
      variant="default"
      onClick={onClick}
      styles={{
        root: {
          flex: 1,
          height: 'auto',
          padding: '16px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        },
        rootHovered: {
          backgroundColor: '#f9fafb',
          border: '1px solid #d1d5db',
        },
      }}
    >
      <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" horizontalAlign="start"  >
        <img
          src={config.icon}
          alt={config.name}
          style={{
            width: '15px',
            height: '15px',
          }}
        />
        <Text variant="small" styles={{ root: { fontWeight: 500, color: '#374151' } }}>
          {config.name}
        </Text>
      </Stack>
    </Button>
  );
};

