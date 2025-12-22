import { Stack, Text } from '@fluentui/react';
import type { ReactNode } from 'react';

interface AuthPageHeaderProps {
  title: string;
  subtitle?: string | ReactNode;
  titleSize?: 'xxLarge' | 'xLarge' | 'large';
  subtitleSize?: 'medium' | 'small';
  className?: string;
}

export const AuthPageHeader = ({
  title,
  subtitle,
  titleSize = 'xxLarge',
  subtitleSize = 'medium',
  className = '',
}: AuthPageHeaderProps) => {
  const titleClasses = 'font-bold text-[#242424] leading-[1.25] text-xl font-inter';

  const subtitleClasses = subtitleSize === 'medium'
    ? 'text-[#707070] leading-[1.5] text-[12px]'
    : 'text-[#707070] leading-[1.5] text-[12px]';

  return (
    <Stack tokens={{ childrenGap: 8 }} className={className}>
      <Text variant={titleSize} className={titleClasses}>
        {title}
      </Text>
      {subtitle && (
        <Text variant={subtitleSize} className={subtitleClasses}>
          {subtitle}
        </Text>
      )}
    </Stack>
  );
};

