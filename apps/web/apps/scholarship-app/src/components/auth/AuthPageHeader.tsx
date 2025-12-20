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
  const titleClasses = titleSize === 'xxLarge'
    ? 'font-bold text-[#111827] leading-[1.25] text-xl'
    : titleSize === 'xLarge'
    ? 'font-bold text-[#111827] leading-[1.25] text-2xl'
    : 'font-bold text-[#111827] leading-[1.25]';

  const subtitleClasses = subtitleSize === 'medium'
    ? 'text-[#707070] leading-[1.5] text-base'
    : 'text-[#707070] leading-[1.5] text-sm';

  return (
    <Stack tokens={{ childrenGap: 24 }} className={className}>
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

