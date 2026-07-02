// src/components/SuspenseErrorBoundary.jsx
import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Loader } from 'lucide-react';

const SuspenseErrorBoundary = ({ 
  children, 
  fallback, 
  loadingFallback,
  onError,
  onReset
}) => {
  const defaultLoading = (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <Loader className="w-8 h-8 text-primary-400 animate-spin" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    </div>
  );

  const defaultFallback = ({ error, reset }) => (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <div className="glass-effect rounded-xl p-6 max-w-md w-full border border-yellow-500/20 text-center">
        <div className="text-yellow-400 text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load</h3>
        <p className="text-sm text-gray-400 mb-4">
          {error?.message || 'Unable to load this content'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary-500 rounded-lg text-white hover:bg-primary-600 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={fallback || defaultFallback}
      onError={onError}
      onReset={onReset}
    >
      <Suspense fallback={loadingFallback || defaultLoading}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseErrorBoundary;