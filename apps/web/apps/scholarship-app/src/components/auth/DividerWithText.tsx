import { Stack, Text } from '@fluentui/react';

interface DividerWithTextProps {
  text?: string;
  className?: string;
}

export const DividerWithText = ({ 
  text = 'OR Continue with',
  className = '' 
}: DividerWithTextProps) => {
  return (
    <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center" className={className}>
      <div className="flex-1 h-px bg-[#d1d5db]"></div>
      <Text variant="small" className="text-[#6b7280]">
        {text}
      </Text>
      <div className="flex-1 h-px bg-[#d1d5db]"></div>
    </Stack>
  );
};

