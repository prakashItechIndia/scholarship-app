import { Stack, mergeStyles } from '@fluentui/react';
import { Control } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
      render={({ field }) => (
        <FormFieldWrapper label={isPasswordVariant ? 'Username' : 'Email'} required variant={variant}>
          {isPasswordVariant ? (
            <div style={{ position: 'relative' }}>
              <div
                className={mergeStyles({
                  width: '100%',
                  borderRadius: '4px',
                  border: '1px solid #D1D1D1',
                  backgroundColor: '#E4EEFF',
                })}
              >
                <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center" styles={{ root: { padding: '0 10px' } }}>
                  {/* <PersonIcon style={{ width: '16px', height: '16px', color: '#616161', flexShrink: 0 }} /> */}
                  <input
                    {...field}
                    value={field.value ?? ''}
                    type="text"
                    placeholder={placeholder || 'ie; hohndoe@mail.com'}
                    className={mergeStyles({
                      width: '100%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '13px',
                      lineHeight: '20px',
                      color: '#242424',
                      padding: '5px 2px 7px',
                      '::placeholder': {
                        color: '#707070',
                      },
                    })}
                  />
                </Stack>
              </div>
            </div>
          ) : (
            <Input
              autoComplete="off"
              {...field}
              value={field.value ?? ''}
              // prefixIcon={<PersonIcon className="w-5 h-5 text-gray-400" />}
              type="email"
              placeholder={placeholder || 'Enter your email address'}
              className="bg-white"
              required={false}
              styles={{
                fieldGroup: {
                  height: '45px',
                  minHeight: '45px',
                  borderRadius: '6px',
                },
                field: {
                  height: '45px',
                  minHeight: '45px',
                  lineHeight: '45px',
                },
              }}
            />
          )}
        </FormFieldWrapper>
      )}
    />
  );
};

