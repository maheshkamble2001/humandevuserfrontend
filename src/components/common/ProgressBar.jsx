// src/components/common/ProgressBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showLabel = true,
  variant = 'primary',
  size = 'medium',
  className = '',
  animated = true,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500',
  };

  const sizes = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3',
    xl: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showLabel) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showLabel && (
            <span className="text-sm font-medium text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-white/10 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 1, ease: 'easeOut' } : {}}
          className={`h-full rounded-full ${variants[variant]}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default ProgressBar;