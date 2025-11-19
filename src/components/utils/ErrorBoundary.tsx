// ErrorBoundary.tsx
import React from 'react';

/**
 * ErrorBoundary props interface
 * @interface ErrorBoundaryProps
 * @property {React.ReactNode} [fallback] - Custom fallback UI on error
 * @property {React.ReactNode} children - Child components to wrap
 */
interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * ErrorBoundary state interface
 * @interface ErrorBoundaryState
 * @property {boolean} hasError - Whether error was caught
 * @property {Error | null} error - The caught error object
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary class component
 * @component
 * Catches errors in child components and displays fallback UI or default error message
 * Logs errors to console for debugging
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-red-100 text-red-800 rounded-md">
          <h2 className="text-lg font-bold">Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
