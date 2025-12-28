import { Stack } from '@fluentui/react';
import { LogoWithText } from '../common/LogoWithText';

interface LogoHeaderProps {
  variant?: 'email' | 'password';
}

export const LogoHeader = ({ variant = 'email' }: LogoHeaderProps) => {
  const isPasswordVariant = variant === 'password';

  if (isPasswordVariant) {
    return (
      <Stack styles={{ root: { width: '100%', maxWidth: '340px', marginTop: '48px', marginBottom: 0, height: '100px' } }}>
        <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center" styles={{ root: { height: '43px' } }}>
          <div style={{ border: '2px solid red' }}>
            <LogoWithText
              logoSize="45px"
              titleSize="md"
              subtitleSize="sm"
              logoBackground="gradient"
              gap="6px"
            />
          </div>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack styles={{ root: { position: 'relative', zIndex: 1 } }}>
      <LogoWithText
        logoSize="45px"
        titleSize="md"
        subtitleSize="xs"
        gap="12px"
      />
    </Stack>
  );
};

