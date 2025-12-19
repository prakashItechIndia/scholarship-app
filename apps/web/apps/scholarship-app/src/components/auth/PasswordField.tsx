import { Stack, mergeStyles } from '@fluentui/react';
import { KeyIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icons';
import { Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { FormFieldWrapper } from './FormFieldWrapper';

interface PasswordFieldProps {
  control: Control<any>;
  name: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  variant?: 'email' | 'password';
}

export const PasswordField = ({ control, name, showPassword, onTogglePassword, variant = 'password' }: PasswordFieldProps) => {
  const isPasswordVariant = variant === 'password';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormFieldWrapper label="Password" required variant={variant}>
          <div style={{ position: 'relative' }}>
            <div
              className={mergeStyles({
                width: '100%',
                borderRadius: '4px',
                border: '1px solid #D1D1D1',
                backgroundColor: isPasswordVariant ? '#E4EEFF' : undefined,
              })}
            >
              <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center" styles={{ root: { padding: '0 10px' } }}>
                <KeyIcon style={{ width: '16px', height: '16px', color: '#616161', flexShrink: 0 }} />
                <input
                  {...field}
                  value={field.value ?? ''}
                  type={showPassword ? 'text' : 'password'}
                  placeholder=""
                  className={mergeStyles({
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '13px',
                    lineHeight: '20px',
                    color: '#242424',
                    padding: '5px 32px 7px 2px',
                    '::placeholder': {
                      color: '#707070',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className={mergeStyles({
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#616161',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    ':hover': {
                      color: '#424242',
                    },
                  })}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeIcon style={{ width: '20px', height: '20px' }} />
                  ) : (
                    <EyeOffIcon style={{ width: '20px', height: '20px' }} />
                  )}
                </button>
              </Stack>
            </div>
          </div>
        </FormFieldWrapper>
      )}
    />
  );
};

