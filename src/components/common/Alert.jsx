// src/components/common/Alert.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const Alert = ({
  children,
  variant = 'info',
  title,
  className = '',
  dismissible = false,
  onDismiss,
  icon: Icon,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: Info,
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      icon: AlertTriangle,
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: AlertCircle,
    },
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const AlertIcon = Icon || variants[variant].icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`
            flex items-start gap-3 p-4 rounded-lg border
            ${variants[variant].bg}
            ${variants[variant].border}
            ${className}
          `}
          {...props}
        >
          <AlertIcon className={`w-5 h-5 flex-shrink-0 ${variants[variant].text}`} />
          <div className="flex-1">
            {title && (
              <h4 className={`font-medium ${variants[variant].text}`}>
                {title}
              </h4>
            )}
            <div className="text-sm text-gray-300">{children}</div>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;