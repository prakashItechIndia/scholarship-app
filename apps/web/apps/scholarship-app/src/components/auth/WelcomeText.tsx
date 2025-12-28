import { Stack, Text } from '@fluentui/react';

interface WelcomeTextProps {
  variant?: 'email' | 'password';
  subtitle?: string;
  className?: string;
}

export const WelcomeText = ({
  variant = 'email',
  subtitle = 'Apply Online and Secure Your Educational Support',
  className = '',
}: WelcomeTextProps) => {
  if (variant === 'password') {
    return (
      <Stack tokens={{ childrenGap: 0 }} className={className}>
        <Text
          variant="xxLarge"
          className="font-semibold font-Base text-[#242424]"
          style={{
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: '32px',
          }}
        >
          Welcome to
        </Text>

        <Text
          variant="xxLarge"
          className="font-semibold font-Base text-[#242424]"
          style={{
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: '32px',
          }}
        >
          Leo Muthu Scholarship
        </Text>

        <Text
          variant="small"
          className="mt-2 text-[#707070]"
          style={{
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '16px',
          }}
        >
          {subtitle}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 0 }} className={className}>
      <Text
        variant="xxLarge"
        className="font-semibold font-Base text-[#242424]"
        style={{
          fontWeight: 600,
          fontSize: '1.5rem',
          lineHeight: '32px',
        }}
      >
        Welcome to
      </Text>

      <Text
        variant="xxLarge"
        className="font-semibold font-Base text-[#242424]"
        style={{
          fontWeight: 600,
          fontSize: '1.5rem',
          lineHeight: '32px',
        }}
      >
        Leo Muthu Scholarship
      </Text>

      <Text
        variant="small"
        className="mt-2 text-[#707070]"
        style={{
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '16px',
        }}
      >
        {subtitle}
      </Text>
    </Stack>

  );
};

