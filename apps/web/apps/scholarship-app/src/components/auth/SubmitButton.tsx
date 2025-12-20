import { Button } from '@shared/components';
import { Spinner, SpinnerSize, IButtonStyles } from '@fluentui/react';
import { Stack } from '@fluentui/react';

interface SubmitButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'password';
  className?: string;
  onClick?: () => void;
}

export const SubmitButton = ({
  type = 'submit',
  disabled = false,
  isLoading = false,
  loadingText = 'Loading...',
  children,
  variant = 'default',
  className = '',
  onClick,
}: SubmitButtonProps) => {
  const baseClasses = variant === 'password'
    ? 'w-full rounded bg-[#2453C3] px-3 py-1.5 text-white text-xs font-semibold font-sans leading-5 border-none hover:bg-[#1e42a0] disabled:cursor-not-allowed'
    : 'w-full h-11 text-base font-semibold';

  // Styles to override disabled state - keep same background color
  const buttonStyles: IButtonStyles = variant === 'password'
    ? {
        root: {
          backgroundColor: '#2453C3',
        },
        rootHovered: {
          backgroundColor: '#1e42a0',
        },
        rootPressed: {
          backgroundColor: '#1e42a0',
        },
        rootDisabled: {
          backgroundColor: '#2453C3 !important',
          opacity: 0.7,
        },
        rootFocused: {
          backgroundColor: '#2453C3',
        },
      }
    : {
        rootDisabled: {
          opacity: 0.7,
        },
      };

  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      variant="default"
      className={`${baseClasses} ${className}`}
      styles={buttonStyles}
      onClick={onClick}
    >
      {isLoading ? (
        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" horizontalAlign="center">
          <Spinner size={SpinnerSize.small} />
          <span>{loadingText}</span>
        </Stack>
      ) : (
        children
      )}
    </Button>
  );
};

