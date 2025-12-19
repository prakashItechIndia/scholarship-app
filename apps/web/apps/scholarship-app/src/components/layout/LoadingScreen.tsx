import { Spinner, SpinnerSize } from '@fluentui/react';

export interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export const LoadingScreen = ({
  message = 'Loading...',
  className = '',
}: LoadingScreenProps) => {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-50 ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size={SpinnerSize.large} />
        {message ? (
          <p className="text-sm font-medium text-gray-600">{message}</p>
        ) : null}
      </div>
    </div>
  );
};
