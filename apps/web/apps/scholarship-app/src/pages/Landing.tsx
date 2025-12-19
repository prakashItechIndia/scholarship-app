import { Stack, Text, mergeStyles } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/seo/SEO';
import logoAram from '@/assets/images/logo-aram.png';
import landingBg from '@/assets/images/landing-bg.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role: string) => {
    // Navigate to signin with role parameter
    navigate(`/signin?role=${role.toLowerCase()}`);
  };

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
            padding: '78px 0 100px',
            minHeight: '100vh',
          })}
        >
          {/* Temporary Landing Page Text */}
          <Text
            variant="xxLarge"
            styles={{
              root: {
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '32px',
                lineHeight: '1.5em',
                color: '#FFFFFF',
                marginBottom: '37px',
                padding: '0 20px',
                textAlign: 'center',
                '@media (max-width: 768px)': {
                  fontSize: '24px',
                },
              },
            }}
          >
            LANDING PAGE
          </Text>

          {/* Logo and Title Section */}
          <Stack
            horizontal
            tokens={{ childrenGap: 20.94 }}
            wrap
            styles={{
              root: {
                marginBottom: '75px',
                alignItems: 'center',
                padding: '0 20px',
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                  textAlign: 'center',
                },
              },
            }}
          >
            <img
              src={logoAram}
              alt="ARAM Foundation Logo"
              style={{
                width: '117.77px',
                height: '112.58px',
                objectFit: 'cover',
              }}
            />
            <Stack
              tokens={{ childrenGap: 0 }}
              styles={{
                root: {
                  justifyContent: 'center',
                },
              }}
            >
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '41.88px',
                    lineHeight: '1.625em',
                    color: '#FFFFFF',
                    marginBottom: '8px',
                    '@media (max-width: 768px)': {
                      fontSize: '28px',
                    },
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
                    fontSize: '31.41px',
                    lineHeight: '1.667em',
                    color: '#FFFFFF',
                    '@media (max-width: 768px)': {
                      fontSize: '22px',
                    },
                  },
                }}
              >
                An Initiative of ARAM Foundation
              </Text>
            </Stack>
          </Stack>

          {/* Role Selection Buttons */}
          <Stack
            horizontal
            tokens={{ childrenGap: 24 }}
            styles={{
              root: {
                marginBottom: '215px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              },
            }}
          >
            {/* CEO/Admin Button */}
            <button
              onClick={() => handleRoleClick('ceo-admin')}
              className={mergeStyles({
                width: '177.78px',
                height: '147.57px',
                backgroundColor: '#1A1818',
                border: '1px solid #FFFFFF',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: '#2A2828',
                  transform: 'translateY(-2px)',
                },
                ':active': {
                  transform: 'translateY(0px)',
                },
              })}
            >
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '21px',
                    lineHeight: '1.333em',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  },
                }}
              >
                CEO/Admin
              </Text>
            </button>

            {/* Manager Button */}
            <button
              onClick={() => handleRoleClick('manager')}
              className={mergeStyles({
                width: '177.78px',
                height: '147.53px',
                backgroundColor: '#1A1818',
                border: '1px solid #FFFFFF',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: '#2A2828',
                  transform: 'translateY(-2px)',
                },
                ':active': {
                  transform: 'translateY(0px)',
                },
              })}
            >
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '21px',
                    lineHeight: '1.429em',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  },
                }}
              >
                Manager
              </Text>
            </button>

            {/* Standard User Button */}
            <button
              onClick={() => handleRoleClick('standard-user')}
              className={mergeStyles({
                width: '177.78px',
                height: '147.53px',
                backgroundColor: '#1A1818',
                border: '1px solid #FFFFFF',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: '#2A2828',
                  transform: 'translateY(-2px)',
                },
                ':active': {
                  transform: 'translateY(0px)',
                },
              })}
            >
              <Text
                styles={{
                  root: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '21px',
                    lineHeight: '1.238em',
                    color: '#FFFFFF',
                    textAlign: 'center',
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

