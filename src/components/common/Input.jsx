// src/components/common/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  helperText,
  required,
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white/5 border rounded-lg px-4 py-2.5
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition duration-200
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/10'}
          `}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;