import { Stack, Text, mergeStyles } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';
import logoAram from '@/assets/images/logo-aram.png';
import landingBg from '@/assets/images/landing-bg.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role: string) => {
    // Navigate to signin with role parameter
    void navigate(`/signin?role=${role.toLowerCase()}`);
  };

  // Shared button styles - dynamically responsive
  const buttonBaseStyles = mergeStyles({
    minWidth: 'clamp(140px, 18vw, 200px)',
    width: '100%',
    maxWidth: '200px',
    minHeight: 'clamp(120px, 15vh, 160px)',
    aspectRatio: '1.2',
    backgroundColor: '#1A1818',
    border: '1px solid #FFFFFF',
    borderRadius: 'clamp(8px, 1vw, 12px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    padding: 'clamp(12px, 2vw, 20px)',
    ':hover': {
      backgroundColor: '#2A2828',
      transform: 'translateY(-2px)',
    },
    ':active': {
      transform: 'translateY(0px)',
    },
  });

  return (
    <>
      <SEO
        title="Leo Muthu Scholarship - Landing"
        description="Shri. Leo Muthu Scholarship (LMS) - An Initiative of ARAM Foundation"
        url="/landing"
        noindex={true}
      />
      <div
        className={mergeStyles({
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {/* Background Image */}
        <div
          className={mergeStyles({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${landingBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          })}
        />

        {/* Dark Overlay */}
        <div
          className={mergeStyles({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(20, 28, 36, 0.9)',
            zIndex: 1,
          })}
        />

        {/* Content */}
        <div
          className={mergeStyles({
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'clamp(3rem, 8vh, 6rem) clamp(1rem, 5vw, 2rem) clamp(4rem, 10vh, 8rem)',
            minHeight: '100vh',
            width: '100%',
          })}
        >
          {/* Temporary Landing Page Text */}
          <Text
            variant="xxLarge"
            styles={{
              root: {
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                lineHeight: 1.5,
                color: '#FFFFFF',
                marginBottom: 'clamp(1.5rem, 4vh, 2.5rem)',
                padding: '0 clamp(1rem, 4vw, 2rem)',
                textAlign: 'center',
                width: '100%',
              },
            }}
          >
            LANDING PAGE
          </Text>

          {/* Logo and Title Section */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              marginBottom: 'clamp(2rem, 6vh, 5rem)',
              padding: '0 clamp(1rem, 4vw, 2rem)',
            }}
          >
            <Stack
              horizontal
              tokens={{ childrenGap: 'clamp(1rem, 2vw, 1.5rem)' }}
              wrap
              styles={{
                root: {
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  '@media (max-width: 768px)': {
                    flexDirection: 'column',
                    textAlign: 'center',
                    justifyContent: 'center',
                  },
                },
              }}
            >
            <img
              src={logoAram}
              alt="ARAM Foundation Logo"
              style={{
                width: 'clamp(80px, 12vw, 120px)',
                height: 'auto',
                aspectRatio: '1',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minWidth: 0,
                gap: 'clamp(1rem, 3vh, 2rem)',
              }}
            >
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 'clamp(1.5rem, 4vw, 2.625rem)',
                    lineHeight: 1.3,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    wordWrap: 'break-word',
                    display: 'block',
                    margin: 0,
                    padding: 0,
                  },
                }}
              >
                Shri. Leo Muthu Scholarship (LMS)
              </Text>
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(1.125rem, 3vw, 1.95rem)',
                    lineHeight: 1.5,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    wordWrap: 'break-word',
                    display: 'block',
                    marginTop: '6vh',
                    padding: 0,
                  },
                }}
              >
                An Initiative of ARAM Foundation
              </Text>
            </div>
            </Stack>
          </div>

          {/* Role Selection Buttons */}
          <Stack
            horizontal
            tokens={{ childrenGap: 'clamp(1rem, 3vw, 1.5rem)' }}
            styles={{
              root: {
                marginBottom: 'clamp(2rem, 8vh, 8rem)',
                justifyContent: 'center',
                flexWrap: 'wrap',
                width: '100%',
                padding: '0 clamp(1rem, 5vw, 2rem)',
                gap: 'clamp(1rem, 3vw, 1.5rem)',
              },
            }}
          >
            {/* CEO/Admin Button */}
            <button
              onClick={() => handleRoleClick('ceo-admin')}
              className={buttonBaseStyles}
            >
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 2vw, 1.3125rem)',
                    lineHeight: 1.333,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    wordWrap: 'break-word',
                  },
                }}
              >
                CEO/Admin
              </Text>
            </button>

            {/* Manager Button */}
            <button
              onClick={() => handleRoleClick('manager')}
              className={buttonBaseStyles}
            >
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 2vw, 1.3125rem)',
                    lineHeight: 1.429,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    wordWrap: 'break-word',
                  },
                }}
              >
                Manager
              </Text>
            </button>

            {/* Standard User Button */}
            <button
              onClick={() => handleRoleClick('standard-user')}
              className={buttonBaseStyles}
            >
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1rem, 2vw, 1.3125rem)',
                    lineHeight: 1.238,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    wordWrap: 'break-word',
                  },
                }}
              >
                Standard User
              </Text>
            </button>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

