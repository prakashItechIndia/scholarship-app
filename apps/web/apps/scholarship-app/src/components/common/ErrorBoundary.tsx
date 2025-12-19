import { Component, type ReactNode } from 'react';
import { WarningIcon } from '@/components/ui/icons';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <WarningIcon className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Something went wrong
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {this.state.error?.message ??
                    'An unexpected error occurred. Please try refreshing the page.'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
