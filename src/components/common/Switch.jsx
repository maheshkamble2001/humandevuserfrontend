// src/components/common/Switch.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Switch = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  className = '',
  ...props
}) => {
  const sizes = {
    small: {
      width: 'w-8',
      height: 'h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    medium: {
      width: 'w-11',
      height: 'h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    large: {
      width: 'w-14',
      height: 'h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            ${sizes[size].width} ${sizes[size].height}
            rounded-full transition-colors duration-200
            ${checked ? 'bg-primary-500' : 'bg-gray-600'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <motion.div
          animate={{
            x: checked ? parseInt(sizes[size].translate) : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            absolute top-0.5 left-0.5
            ${sizes[size].thumb}
            bg-white rounded-full shadow-md
          `}
        />
      </div>
      {label && (
        <span className={`text-sm ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;