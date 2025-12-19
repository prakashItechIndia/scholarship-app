import * as React from 'react';
import { TextField, ITextFieldProps } from '@fluentui/react';

export interface InputProps extends Omit<ITextFieldProps, 'onChange' | 'value' | 'onBlur' | 'componentRef'> {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  value?: string;
  onChange?: ((value: string) => void) | ((e: React.ChangeEvent<HTMLInputElement>) => void);
  onBlur?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ prefixIcon, suffixIcon, value, onChange, onBlur, className, ...props }, ref) => {
    const handleChange = React.useCallback(
      (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (onChange && newValue !== undefined) {
          // react-hook-form's onChange expects an event, but we're getting a value
          // Create a synthetic event-like object or call directly
          // For react-hook-form compatibility, we need to call onChange with the value
          // But react-hook-form's onChange signature is (e) => void, so we need to handle both
          if (typeof onChange === 'function') {
            // Try to detect if it's react-hook-form's onChange (which expects event)
            // or our custom onChange (which expects value)
            // We'll assume if it's from react-hook-form field spread, it expects event
            // But since Fluent UI gives us the value, we'll create a workaround
            // Actually, react-hook-form's field.onChange can be called with just the value
            (onChange as any)(newValue);
          }
        }
      },
      [onChange]
    );

    const handleBlur = React.useCallback(() => {
      if (onBlur) {
        onBlur();
      }
    }, [onBlur]);

    // Fluent UI TextField doesn't support prefixIcon/suffixIcon directly
    // We'll wrap it in a div to add icons
    return (
      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            {prefixIcon}
          </div>
        )}
        <TextField
          {...props}
          componentRef={ref as any}
          value={value ?? ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className={className}
          styles={{
            fieldGroup: {
              paddingLeft: prefixIcon ? '32px' : undefined,
              paddingRight: suffixIcon ? '32px' : undefined,
            },
          }}
        />
        {suffixIcon && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            {suffixIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

