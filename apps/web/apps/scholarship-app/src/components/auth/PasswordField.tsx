import { IconButton } from '@fluentui/react';
import { KeyIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { Control } from 'react-hook-form';
import { FormField } from '@shared/components';
import { Input } from '@shared/components';
import { FormFieldWrapper } from './FormFieldWrapper';

interface PasswordFieldProps {
  control: Control<any>;
  name: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  variant?: 'email' | 'password';
  placeholder?: string;
  hideprefixIcon?: boolean;
}

export const PasswordField = ({ control, name, showPassword, onTogglePassword, variant = 'password', placeholder,
  hideprefixIcon = false,
 }: PasswordFieldProps) => {
  const isPasswordVariant = variant === 'password';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onBlur: () => void; name: string; ref: React.Ref<any> } }) => {
        return (
        <FormFieldWrapper label="Password" required variant={variant}>
            <Input
                  {...field}
                  value={field.value ?? ''}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={placeholder}
              prefixIcon={!hideprefixIcon ? <KeyIcon style={{ width: '16px', height: '16px', color: '#616161' }} /> : undefined}
              suffixIcon={
                <IconButton
                  onClick={onTogglePassword}
                  ariaLabel={showPassword ? 'Hide password' : 'Show password'}
                  onRenderIcon={() => 
                    showPassword ? (
                      <EyeIcon className="w-5 h-5 text-[#616161] hover:text-[#424242]" />
                  ) : (
                      <EyeOffIcon className="w-5 h-5 text-[#616161] hover:text-[#424242]" />
                    )
                  }
                  className="w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent"
                />
              }
              required={false}
            />
        </FormFieldWrapper>
        );
      }}
    />
  );
};

