// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Button from './common/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      errorInfo: errorInfo,
      errorCount: this.state.errorCount + 1
    });

    // Send error to your backend if in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // You can send to your backend API
    // fetch('/api/errors', { 
    //   method: 'POST', 
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData) 
    // }).catch(console.error);
    
    console.log('Error logged:', errorData);
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback({
          error,
          errorInfo,
          errorCount,
          reset: this.handleReset,
          refresh: this.handleRefresh,
          goHome: this.handleGoHome,
          goBack: this.handleGoBack
        });
      }

      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          errorCount={errorCount}
          onReset={this.handleReset}
          onRefresh={this.handleRefresh}
          onGoHome={this.handleGoHome}
          onGoBack={this.handleGoBack}
        />
      );
    }

    return children;
  }
}

// Default Error Fallback Component
const DefaultErrorFallback = ({
  error,
  errorInfo,
  errorCount,
  onReset,
  onRefresh,
  onGoHome,
  onGoBack
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="glass-effect rounded-xl p-8 max-w-2xl w-full border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
            <p className="text-gray-400">We apologize for the inconvenience</p>
          </div>
        </div>

        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 mb-4">
          <p className="text-sm text-red-400">
            {error?.message || 'An unexpected error occurred'}
          </p>
          {errorCount > 1 && (
            <p className="text-xs text-gray-400 mt-1">
              This error has occurred {errorCount} times
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant="gradient"
            icon={RefreshCw}
            onClick={onRefresh}
          >
            Refresh Page
          </Button>
          <Button
            variant="outline"
            icon={Home}
            onClick={onGoHome}
          >
            Go Home
          </Button>
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={onGoBack}
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
          >
            Try Again
          </Button>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && errorInfo && (
          <div className="mt-4 p-4 bg-dark-800 rounded-lg overflow-auto max-h-60">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap">
              {error?.stack}
              {'\n\nComponent Stack:\n'}
              {errorInfo?.componentStack}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;