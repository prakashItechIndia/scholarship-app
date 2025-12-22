import { Stack, Text, mergeStyles } from '@fluentui/react';
import logoImage from '@shared/assets/icons/Logo.svg';

interface LogoHeaderProps {
  variant?: 'email' | 'password';
}

// Simple JS function to return SVG logo
const LogoSVG = ({ width = '56', height = '56' }: { width?: string; height?: string }) => {
  return (
    <img 
      src={logoImage} 
      alt="Leo Muthu Scholarship Logo" 
      style={{ width, height, display: 'block' }} 
    />
  );
};

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
            <Text variant="medium" styles={{ root: { color: '#242424', fontWeight: 600, fontFamily: 'Inter, sans-serif', lineHeight: '22px', } }}>
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
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            flexShrink: 0,
          })}
        >
          <LogoSVG width="45px" height="45px" />
        </Stack>
        <Stack>
          <Text variant="large" styles={{ root: { fontWeight: '600',  color: '#242424', lineHeight: '1.25',fontFamily: 'Inter, sans-serif',fontSize: '16px' } }}>
            Shri. Leo Muthu Scholarship (LMS)
          </Text>
          <Text variant="small" styles={{ root: { color: '#707070', marginTop: '2px',fontFamily: 'Inter, sans-serif',fontSize: '12px' } }}>
            An Initiative of ARAM Foundation
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

