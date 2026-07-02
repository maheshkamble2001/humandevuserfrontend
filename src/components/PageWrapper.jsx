// src/components/PageWrapper.jsx
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import RouteErrorBoundary from './RouteErrorBoundary';
import ApiErrorBoundary from './ApiErrorBoundary';

const PageWrapper = ({ 
  children, 
  withApi = false,
  onError,
  fallback 
}) => {
  let content = children;

  if (withApi) {
    content = (
      <ApiErrorBoundary onError={onError}>
        {content}
      </ApiErrorBoundary>
    );
  }

  return (
    <RouteErrorBoundary>
      <ErrorBoundary onError={onError} fallback={fallback}>
        {content}
      </ErrorBoundary>
    </RouteErrorBoundary>
  );
};

export default PageWrapper;