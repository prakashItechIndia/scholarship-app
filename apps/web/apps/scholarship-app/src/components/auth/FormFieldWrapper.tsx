import { Stack, Text } from '@fluentui/react';
import { FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { ReactNode } from 'react';

interface FormFieldWrapperProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  variant?: 'email' | 'password';
}

export const FormFieldWrapper = ({ label, required = false, children, variant = 'email' }: FormFieldWrapperProps) => {
  const isPasswordVariant = variant === 'password';

  if (isPasswordVariant) {
    return (
      <FormItem>
        <Stack tokens={{ childrenGap: 0 }}>
          <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="end" styles={{ root: { marginBottom: '2px' } }}>
            <Text variant="small" styles={{ root: { color: '#242424', fontFamily: 'Inter, sans-serif', lineHeight: label === 'Password' ? '16px' : '20px', fontSize: label === 'Password' ? '12px' : undefined } }}>
              {label}
            </Text>
            {required && (
              <Text variant="small" styles={{ root: { color: '#B10E1C', fontFamily: 'Inter, sans-serif', lineHeight: label === 'Password' ? '16px' : '20px', fontSize: label === 'Password' ? '12px' : undefined } }}>
                *
              </Text>
            )}
          </Stack>
          <FormControl>{children}</FormControl>
          <FormMessage className="text-[#B10E1C] text-xs mt-1" />
        </Stack>
      </FormItem>
    );
  }

  return (
    <FormItem>
      <Stack tokens={{ childrenGap: 8 }}>
        <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center">
          <Text variant="small" styles={{ root: { fontWeight: 500, color: '#374151', fontSize: '13px' } }}>
            {label}
          </Text>
          {required && <Text variant="small" styles={{ root: { color: '#ef4444', fontSize: '13px' } }}>*</Text>}
        </Stack>
        <FormControl>{children}</FormControl>
        <FormMessage className="text-red-500 text-xs" />
      </Stack>
    </FormItem>
  );
};

