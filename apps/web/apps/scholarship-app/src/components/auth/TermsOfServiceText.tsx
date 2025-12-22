import { Text } from '@fluentui/react';

interface TermsOfServiceTextProps {
  variant?: 'default' | 'small' | 'link';
  className?: string;
}

export const TermsOfServiceText = ({ 
  variant = 'default',
  className = '' 
}: TermsOfServiceTextProps) => {
  const baseClasses = variant === 'small' 
    ? 'text-[#707070] text-[10px] font-sans leading-4'
    : 'text-[#707070] text-left leading-[1.75]';

  const linkClasses = variant === 'small'
    ? 'text-[#2453C3] text-[10px] font-medium font-sans underline leading-4'
    : variant === 'link'
    ? 'text-[#2453C3] font-medium font-sans underline cursor-pointer hover:text-[#1e42a0]'
    : 'text-black no-underline ';

  return (
    <Text variant="small" className={`${baseClasses} ${className}`}>
      By continuing, you agree to our{' '}
      {variant === 'link' ? (
        <>
          <a href="#" className={linkClasses}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className={linkClasses}>
            Privacy Policy
          </a>
        </>
      ) : (
        <>
          <span className={linkClasses}>
            Terms of Service
          </span>{' '}
          and{' '}
          <span className={linkClasses}>
            Privacy Policy
          </span>
        </>
      )}
      .
    </Text>
  );
};

