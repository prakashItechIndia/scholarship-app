import { ReactNode } from 'react';
import { Stack, Text, mergeStyles } from '@fluentui/react';
import { ScholarshipFooter } from './ScholarshipFooter';
import loginBanner from '@shared/assets/icons/LoginPageLeftSideBanner.png';

interface AuthLayoutWrapperProps {
  children: ReactNode;
  footerVariant?: 'email' | 'password';
}

export const AuthLayoutWrapper = ({ children, footerVariant = 'email' }: AuthLayoutWrapperProps) => {
  return (
    <Stack
      horizontal
      className={mergeStyles({
        minHeight: '100vh',
        position: 'relative',
        '@media (max-width: 1023px)': {
          flexDirection: 'column',
        },
        backgroundColor: 'blue',
      })}
    >
      {/* Left Panel - Memorial Section */}
      <Stack
        className={mergeStyles({
          marginTop: '20px',
          display: 'none',
          width: '60%',
          position: 'absolute',
          left: 20,
          top: 2,
          bottom: 0,
          zIndex: 10,
          overflow: 'hidden',
          '@media (min-width: 1024px)': {
            display: 'flex',
          },
          
        })}
      >
        <Stack
          className={mergeStyles({
            width: '100%',
            height: '100%',
            minHeight: '85vh',
            maxHeight: '95vh',
            position: 'relative',
            padding: '48px',
            borderRadius: '40px',
            backgroundImage: `url(${loginBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          })}
        >
          <Stack horizontalAlign="center">
            <Text variant="small" styles={{ root: { color: '#374151', marginBottom: '16px', fontSize: '1rem' } }}>
              In Fond Remembrance of
            </Text>
            <Stack tokens={{ childrenGap: 4 }}>
              <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#1e3a8a', fontSize: '1.5rem', alignSelf: 'center' } }}>
                Our Guiding Star
              </Text>
              <Text variant="xxLarge" styles={{ root: { fontWeight: 800, color: '#1e3a8a', fontSize: '1.8rem' } }}>
                Shri. MJF. Ln. Leo Muthu
              </Text>
            </Stack>
            <Text variant="small" styles={{ root: { color: '#374151', fontStyle: 'italic', fontWeight: 500, marginTop: '8px', fontSize: '0.875rem' } }}>
              A Visionary philanthropist and educationist.
            </Text>
            <Text variant="small" styles={{ root: { color: '#4b5563', fontWeight: 500, fontSize: '0.875rem' } }}>
              02-04-1952 - 10-07-2015
            </Text>
          </Stack>
        </Stack>
      </Stack>

      {/* Right Panel - Content with Footer */}
      <Stack
        grow
        className={mergeStyles({
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          marginLeft: '',
          position: 'relative',
          zIndex: 1,
          '@media (min-width: 1024px)': {
            marginLeft: '60%',
          },
        })}
      >
        <Stack
          grow
          className={mergeStyles({
            padding: '48px 32px',
            paddingBottom: 0,
            borderBottomLeftRadius: '40px',
            position: 'relative',
            '@media (min-width: 1024px)': {
              padding: '48px',
              paddingBottom: 0,
              borderBottomLeftRadius: '40px',
            },
            '@media (min-width: 1280px)': {
              padding: '48px 64px',
              paddingBottom: 0,
              borderBottomLeftRadius: '40px',
            },
            '@media (max-width: 1023px)': {
              borderBottomLeftRadius: 0,
            },
          })}
        >
          {/* Top white background extension */}
          <div style={{ position: 'absolute', width: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
            <div
              className={mergeStyles({
                position: 'absolute',
                left: '-30%',
                right: 0,
                top: 0,
                height: '100px',
                backgroundColor: '#ffffff',
                borderRadius: '40px',
                zIndex: 0,
                '@media (max-width: 1023px)': {
                  left: 0,
                  borderBottomLeftRadius: 0,
                },
              })}
            />
          </div>

          <Stack horizontalAlign="center" verticalAlign="center" grow>
            <Stack tokens={{ childrenGap: 32 }} styles={{ root: { width: '100%', maxWidth: '448px' } }}>
              {children}
            </Stack>
          </Stack>
        </Stack>

        {/* Footer */}
        <ScholarshipFooter variant={footerVariant} />
      </Stack>
    </Stack>
  );
};

