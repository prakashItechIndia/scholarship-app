import { ReactNode } from 'react';
import { Stack, Text, mergeStyles } from '@fluentui/react';
import { ScholarshipFooter } from './ScholarshipFooter';
import defaultLoginBanner from '@shared/assets/icons/LoginPageLeftSideBanner.jpg';

interface AuthLayoutWrapperProps {
  children: ReactNode;
  footerVariant?: 'email' | 'password';
  bannerImage?: string;
}

export const AuthLayoutWrapper = ({ children, footerVariant = 'email', bannerImage }: AuthLayoutWrapperProps) => {
  return (
    <Stack
      horizontal
      className={mergeStyles({
        minHeight: '100vh',
        position: 'relative',
        '@media (max-width: 1023px)': {
          flexDirection: 'column',
        },
        backgroundColor: '#0078D4',
      })}
    >
      {/* Left Panel - Memorial Section */}
      <Stack
        className={mergeStyles({
          // marginTop: '20px',
          display: 'none',
          width: '60%',
          position: 'absolute',
          // left: 20,
          // top: 2,
          bottom: 0,
          zIndex: 10,
          overflow: 'hidden',
          '@media (min-width: 1024px)': {
            display: 'flex',
          },
          height: '100vh',
          padding: '20px',
          paddingRight: '0px',
        })}
        
      >
        <div 
          className="relative w-full h-full p-12 rounded-[40px] border-8 border-white overflow-hidden"
        >
          {/* Background Image */}
          <img
            src={bannerImage||defaultLoginBanner}
              alt="Login Banner Background"
            className="absolute inset-0 w-full h-full object-fill object-center"
            aria-hidden="true"
          />
          
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: !bannerImage?'linear-gradient(180deg, rgba(10, 224, 231, 0.15) 22.66%, rgba(0, 0, 0, 0) 43.38%)':
              "linear-gradient(195.44deg, rgba(0, 0, 0, 0) 34.46%, rgba(208, 231, 248, 0.15) 67.61%)"
            }}
          />
          
          {/* Content Overlay */}
         {bannerImage ? null : <Stack horizontalAlign="center" className="relative z-10">
            <Text variant="small" styles={{ root: { color: '#374151', marginBottom: '10px', fontSize: '1rem' } }}>
              In Fond Remembrance of
            </Text>
            <Stack>
              <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#0F548C', fontSize: '1.5rem', alignSelf: 'center',fontFamily: 'Inter, sans-serif',lineHeight: '2.5rem' } }}>
                Our Guiding Star
              </Text>
              <Text variant="xxLarge" styles={{ root: { fontWeight: 800, color: '#0F548C', fontSize: '2rem',fontFamily: 'Inter, sans-serif',lineHeight: '2.5rem' } }}>
                Shri. MJF. Ln. Leo Muthu
              </Text>
            </Stack>
            <Text variant="small" styles={{ root: { color: '#242424', fontStyle: "Inter, sans-serif", marginTop: '8px', fontSize: '0.875rem' } }}>
              A Visionary philanthropist and educationist.
            </Text>
            <Text variant="small" styles={{ root: { color: '#242424',fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' } }}>
              02-04-1952 - 10-07-2015
            </Text>
          </Stack>}
        </div>
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

