// src/components/common/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  rounded = 'md',
  shadow = false,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white border-transparent',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white border-transparent',
    outline: 'border border-white/20 hover:bg-white/10 text-white bg-transparent',
    ghost: 'hover:bg-white/10 text-white bg-transparent',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-transparent',
    success: 'bg-green-500 hover:bg-green-600 text-white border-transparent',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent',
    info: 'bg-blue-500 hover:bg-blue-600 text-white border-transparent',
    gradient: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-transparent hover:opacity-90',
    dark: 'bg-dark-800 hover:bg-dark-700 text-white border border-white/10',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  const shadowMap = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${roundedMap[rounded]}
        ${shadow ? shadowMap[typeof shadow === 'string' ? shadow : 'md'] : ''}
        ${fullWidth ? 'w-full' : ''}
        font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900
        disabled:opacity-50 disabled:cursor-not-allowed
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;