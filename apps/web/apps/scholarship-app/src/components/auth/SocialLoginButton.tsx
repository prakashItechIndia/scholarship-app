import { Stack, Text } from '@fluentui/react';
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

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="flex-1 h-auto p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300"
    >
      <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" horizontalAlign="start"  >
        <img
          src={config.icon}
          alt={config.name}
          className="w-[15px] h-[15px]"
        />
        <Text variant="small" className="font-medium text-gray-700">
          {config.name}
        </Text>
      </Stack>
    </Button>
  );
};

