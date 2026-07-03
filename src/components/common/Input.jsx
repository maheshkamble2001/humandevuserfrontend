// src/components/common/Input.jsx
import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  className = '',
  icon: Icon,
  rightIcon: RightIcon,
  iconPosition = 'left',
  helperText,
  required,
  disabled,
  type = 'text',
  size = 'medium',
  fullWidth = true,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-5 py-3 text-lg',
  };

  const hasLeftIcon = Icon && iconPosition === 'left';
  const hasRightIcon = RightIcon || (isPassword) || (Icon && iconPosition === 'right');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={`
            ${sizes[size]}
            ${hasLeftIcon ? 'pl-10' : ''}
            ${hasRightIcon ? 'pr-10' : ''}
            w-full bg-white/5 border rounded-lg
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-primary-500'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
        
        {hasRightIcon && !isPassword && RightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {RightIcon}
          </div>
        )}
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
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