import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

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
        <label
          className="text-[12px] font-normal text-[#242424] leading-[16px] flex items-end gap-[4px]"
          htmlFor={id}
        >
          <span>{label}</span>
          {label.toLowerCase().includes('password') && (
            <span className="text-[12px] text-[#b10e1c]">*</span>
          )}
        </label>
        <div className="relative">
          <div
            className={`w-full rounded-[4px] border ${
              error ? 'border-red-300' : 'border-[#d1d1d1]'
            } bg-white`}
          >
            <div className="flex items-center gap-[10px] px-[10px] py-0 rounded-[inherit] relative">
              {/* Input field */}
              <div className="flex flex-1 items-start min-h-px min-w-px overflow-hidden pb-[7px] pt-[5px] px-[2px]">
                <input
                  id={id}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  className="w-full text-[13px] leading-[20px] text-[#242424] bg-transparent border-none outline-none placeholder:text-[#707070] pr-8"
                  {...register}
                  onChange={(e) => {
                    void register.onChange(e);
                    if (showStrengthIndicator) {
                      setPassword(e.target.value);
                    }
                  }}
                />
              </div>
              {/* Eye icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#616161] hover:text-[#424242] w-4 h-4 flex items-center justify-center"
                tabIndex={-1}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
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

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
