import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { IconButton } from '@fluentui/react';
import { Input, Label } from '@shared/components';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons';

interface PasswordInputProps {
  id?: string;
  label?: string;
  register: UseFormRegisterReturn;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  showStrengthIndicator?: boolean;
  confirmPassword?: string;
}

export const PasswordInput = ({
  id = 'password',
  label = 'Password',
  register,
  error,
  autoComplete = 'current-password',
  placeholder,
  showStrengthIndicator = false,
  confirmPassword,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 8)
      return { strength: 1, label: 'Weak', color: 'bg-red-500' };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3)
      return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = showStrengthIndicator
    ? getPasswordStrength(password)
    : null;
  const passwordsMatch = confirmPassword ? password === confirmPassword : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-[4px]">
        <Label
          required={label.toLowerCase().includes('password')}
          htmlFor={id}
          className="text-[12px] font-normal text-[#242424] leading-[16px]"
        >
          {label}
        </Label>
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          errorMessage={error}
          suffixIcon={
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              ariaLabel={showPassword ? 'Hide password' : 'Show password'}
              onRenderIcon={() => 
                showPassword ? (
                  <EyeIcon className="w-4 h-4 text-[#616161] hover:text-[#424242]" />
                ) : (
                  <EyeOffIcon className="w-4 h-4 text-[#616161] hover:text-[#424242]" />
                )
              }
              className="w-auto h-auto min-w-0 p-1 bg-transparent border-none hover:bg-transparent active:bg-transparent"
            />
          }
          {...register}
          onChange={(e) => {
            void register.onChange(e);
            if (showStrengthIndicator) {
              setPassword(e.target.value);
            }
          }}
        />
      </div>

      {showStrengthIndicator && password && (
        <div className="space-y-1">
          <div className="flex gap-1 h-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`flex-1 rounded ${
                  level <= passwordStrength!.strength
                    ? passwordStrength!.color
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">
            Password strength:{' '}
            <span className="font-medium">{passwordStrength!.label}</span>
          </p>
        </div>
      )}

      {confirmPassword !== undefined && password && (
        <p
          className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}
        >
          {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
        </p>
      )}

    </div>
  );
};
