import { Stack, Text, mergeStyles } from '@fluentui/react';
import logo from '@shared/assets/icons/Logo.png';

interface LogoHeaderProps {
  variant?: 'email' | 'password';
}

export const LogoHeader = ({ variant = 'email' }: LogoHeaderProps) => {
  const isPasswordVariant = variant === 'password';

  if (isPasswordVariant) {
    return (
      <Stack styles={{ root: { width: '100%', maxWidth: '340px', marginTop: '48px', marginBottom: 0,height: '100px' } }}>
        <Stack horizontal tokens={{ childrenGap: 6 }} verticalAlign="center" styles={{ root: { height: '43px' } }}>
          <Stack
            horizontalAlign="center"
            verticalAlign="center"
            className={mergeStyles({
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
              flexShrink: 0,
              
            })}
          />
          <Stack className={mergeStyles({ border: '2px solid red' })}>
            <Text variant="medium" styles={{ root: { color: '#242424', fontWeight: 600, fontFamily: 'Inter, sans-serif', lineHeight: '22px' } }}>
              Shri. Leo Muthu Scholarship (LMS)
            </Text>
            <Text variant="small" styles={{ root: { color: '#707070', fontFamily: 'Inter, sans-serif', lineHeight: '16px' } }}>
              An Initiative of ARAM Foundation
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack styles={{ root: { position: 'relative', zIndex: 1  } }}>
      <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          className={mergeStyles({
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            flexShrink: 0,
          })}
        >
          <img src={logo} alt="Leo Muthu Scholarship" style={{ width: '56px', height: '56px', display: 'block' }} />
        </Stack>
        <Stack>
          <Text variant="large" styles={{ root: { fontWeight: 'semibold',  color: '#1f2937', lineHeight: '1.25' } }}>
            Shri. Leo Muthu Scholarship (LMS)
          </Text>
          <Text variant="small" styles={{ root: { color: '#4b5563', marginTop: '2px' } }}>
            An Initiative of ARAM Foundation
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

