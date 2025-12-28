import { Stack, Text, mergeStyles } from '@fluentui/react';
import iTechLogo from '@shared/assets/icons/ITech.svg';

interface ScholarshipFooterProps {
  variant?: 'email' | 'password';
}

const FOOTER_STYLES = {
  email: {
    backgroundColor: '#D0E7F8', // Light blue matching the image
    height: '100px', // Increased height
    padding: {
      base: '20px 32px',
      md: '24px 48px',
      lg: '28px 64px',
    },
  },
  password: {
    backgroundColor: '#D0E7F8',
    height: '100px', // Increased height
    padding: {
      base: '0 24px',
      md: '0 48px',
      lg: '0 64px',
      xl: '0 96px',
    },
  },
};

export const ScholarshipFooter = ({ variant = 'email' }: ScholarshipFooterProps) => {
  const styles = FOOTER_STYLES[variant];
  const isPasswordVariant = variant === 'password';
  const passwordStyles = isPasswordVariant ? FOOTER_STYLES.password : null;
  const currentYear = new Date().getFullYear();

  // For email variant, we need extended background
  if (variant === 'email') {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Extended background layer */}
        <div
          className={mergeStyles({
            position: 'absolute',
            left: '-30%',
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: styles.backgroundColor,
            height: styles.height,
            borderBottomLeftRadius: '40px',
            '@media (max-width: 1023px)': {
              left: 0,
              borderTopLeftRadius: 0,
            },
          })}
        />

        {/* Content layer - matches form width */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '448px' }}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              className={mergeStyles({
                position: 'relative',
                height: styles.height,
                padding: '0',
                '@media (max-width: 639px)': {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                },
              })}
              tokens={{ childrenGap: 16 }}
            >
              <Text
                variant="small"
                styles={{
                  root: {
                    color: '#374151',
                  },
                }}
              >
                Copyright © {currentYear} LEO MUTHU Scholarship
              </Text>
              <Stack
                horizontal
                tokens={{ childrenGap: 4 }}
                verticalAlign="center"
                className={mergeStyles({
                  '@media (max-width: 639px)': {
                    justifyContent: 'center',
                  },
                })}
              >
                <Text
                  variant="small"
                  styles={{
                    root: {
                      color: '#374151',
                    },
                  }}
                >
                  Powered by
                </Text>
                <img
                  src={iTechLogo}
                  alt="iTech"
                  style={{
                    height: '12px',
                    width: 'auto',
                  }}
                />
              </Stack>
            </Stack>
          </div>
        </div>
      </div>
    );
  }

  // Password variant - original behavior
  return (
    <Stack
      horizontal
      horizontalAlign="end"
      verticalAlign="center"
      className={mergeStyles({
        backgroundColor: styles.backgroundColor,
        height: styles.height,
        padding: styles.padding.base,
        '@media (min-width: 640px)': {
          padding: styles.padding.md,
        },
        '@media (min-width: 1024px)': {
          padding: styles.padding.lg,
        },
        ...(isPasswordVariant && passwordStyles && {
          '@media (min-width: 1280px)': {
            padding: passwordStyles.padding.xl,
          },
        }),
        '@media (max-width: 639px)': {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        },
      })}
      tokens={{ childrenGap: 56 }}
    >
      <Text
        variant="small"
        styles={{
          root: {
            color: isPasswordVariant ? '#242424' : '#374151',
            fontSize: isPasswordVariant ? '10px' : undefined,
            fontFamily: isPasswordVariant ? 'Segoe UI, sans-serif' : undefined,
            lineHeight: isPasswordVariant ? '14px' : undefined,
            fontWeight: isPasswordVariant ? '400' : undefined,
          },
        }}
      >
        Copyright © 2025 LEO MUTHU Scholarship
      </Text>
      <Stack
        horizontal
        tokens={{ childrenGap: isPasswordVariant ? 3 : 8 }}
        verticalAlign="center"
        className={mergeStyles({
          '@media (max-width: 639px)': {
            justifyContent: 'center',
          },
        })}
      >
        <Text
          variant="small"
          styles={{
            root: {
              color: isPasswordVariant ? '#242424' : '#374151',
              fontSize: isPasswordVariant ? '10px' : undefined,
              fontFamily: isPasswordVariant ? 'Segoe UI, sans-serif' : undefined,
              lineHeight: isPasswordVariant ? '14px' : undefined,
              fontWeight: isPasswordVariant ? '400' : undefined,
            },
          }}
        >
          Powered by
        </Text>
        <img
          src={iTechLogo}
          alt="iTech"
          style={{
            height: isPasswordVariant ? '10px' : '12px',
            width: 'auto',
          }}
        />
      </Stack>
    </Stack>
  );
};

