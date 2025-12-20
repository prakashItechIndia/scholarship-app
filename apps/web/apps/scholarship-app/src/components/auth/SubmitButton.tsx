import { Button } from '@shared/components';

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
    ? 'w-full rounded bg-[#2453C3] px-3 py-1.5 text-white text-xs font-semibold font-sans leading-5 border-none hover:bg-[#1e42a0] disabled:cursor-not-allowed disabled:opacity-70'
    : 'w-full h-11 text-base font-semibold disabled:opacity-70';

  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      variant="default"
      className={`${baseClasses} ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
