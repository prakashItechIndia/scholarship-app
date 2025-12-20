import { Control } from 'react-hook-form';
import { ChevronDownRegular } from '@fluentui/react-icons';
import { FormField } from '@shared/components';
import { Input } from '@shared/components';
import { FormFieldWrapper } from './FormFieldWrapper';

interface EmailFieldProps {
  control: Control<any>;
  name: string;
  variant?: 'email' | 'password';
  placeholder?: string;
}

export const EmailField = ({ control, name, variant = 'email', placeholder }: EmailFieldProps) => {
  const isPasswordVariant = variant === 'password';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onBlur: () => void; name: string; ref: React.Ref<any> } }) => {
        return (
          <FormFieldWrapper label={isPasswordVariant ? 'Username' : 'Email'} required variant={variant}>
            <Input
              autoComplete="off"
              {...field}
              value={field.value ?? ''}
              // suffixIcon={<ChevronDownRegular style={{ width: '16px', height: '16px', color: '#616161' }} />}
              type={isPasswordVariant ? 'text' : 'email'}
              placeholder={placeholder || (isPasswordVariant ? 'ie; hohndoe@mail.com' : 'Enter your email address')}
              required={false}
            />
          </FormFieldWrapper>
        );
      }}
    />
  );
};

