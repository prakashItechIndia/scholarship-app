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
      <Stack tokens={{ childrenGap: 4 }} className={`w-full max-w-[340px] mt-12 mb-0 ${className}`}>
        <Text variant="xLarge" className="text-[#242424] font-semibold font-sans leading-8">
          Welcome to<br />Leo Muthu Scholarship
        </Text>
        <Text variant="small" className="text-[#707070] font-sans leading-4">
          {subtitle || 'Log In to Administer and Monitor Scholarship Applications'}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 8 }} className={className}>
      <Text variant="xxLarge" className="font-bold text-[#111827] leading-[1.25]">
        Welcome to
      </Text>
      <Text variant="xxLarge" className="font-bold text-[#111827] leading-[1.25]">
        Leo Muthu Scholarship
      </Text>
      <Text variant="small" className="text-[#4b5563] mt-2">
        {subtitle}
      </Text>
    </Stack>
  );
};

