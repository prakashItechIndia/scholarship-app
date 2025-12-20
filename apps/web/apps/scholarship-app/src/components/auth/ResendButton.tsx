interface ResendButtonProps {
  onClick: () => void;
  cooldown: number;
  disabled?: boolean;
  className?: string;
}

export const ResendButton = ({
  onClick,
  cooldown,
  disabled = false,
  className = '',
}: ResendButtonProps) => {
  const isDisabled = disabled || cooldown > 0;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`bg-transparent border-none text-[#1d4ed8] cursor-pointer no-underline p-0 text-sm font-semibold disabled:cursor-not-allowed ${className}`}
    >
      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
    </button>
  );
};

