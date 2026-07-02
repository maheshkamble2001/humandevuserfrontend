// src/components/AsyncErrorBoundary.jsx
import React from 'react';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './common/Button';

class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isLoading: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Async Error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = async () => {
    this.setState({ isLoading: true, hasError: false });
    
    try {
      if (this.props.onRetry) {
        await this.props.onRetry();
      }
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ 
        hasError: true, 
        error, 
        isLoading: false 
      });
    }
  };

  render() {
    const { hasError, error, isLoading } = this.state;
    const { children, fallback, loadingFallback } = this.props;

    if (isLoading) {
      return loadingFallback || (
        <div className="flex items-center justify-center p-8">
          <Loader className="w-8 h-8 text-primary-400 animate-spin" />
        </div>
      );
    }

    if (hasError) {
      if (fallback) {
        return fallback({ error, retry: this.handleRetry });
      }

      return (
        <div className="glass-effect rounded-xl p-8 text-center border border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Failed to Load</h3>
          <p className="text-sm text-gray-400 mb-4">
            {error?.message || 'Something went wrong loading this content'}
          </p>
          <Button
            variant="gradient"
            icon={RefreshCw}
            onClick={this.handleRetry}
            loading={isLoading}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return children;
  }
}

export default AsyncErrorBoundary;