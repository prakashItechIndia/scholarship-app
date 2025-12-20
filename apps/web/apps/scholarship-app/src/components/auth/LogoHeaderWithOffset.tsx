import { LogoHeader } from './LogoHeader';

interface LogoHeaderWithOffsetProps {
  variant?: 'email' | 'password';
}

export const LogoHeaderWithOffset = ({ variant = 'email' }: LogoHeaderWithOffsetProps) => {
  return (
    <div className="relative -top-[180px] -mb-[100px]">
      <LogoHeader variant={variant} />
    </div>
  );
};

