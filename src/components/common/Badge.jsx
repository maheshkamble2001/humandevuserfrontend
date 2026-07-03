// src/components/common/Badge.jsx
import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  rounded = 'full',
  icon: Icon,
  dot = false,
  removable = false,
  onRemove,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-500/20 text-primary-400',
    secondary: 'bg-secondary-500/20 text-secondary-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    gray: 'bg-gray-500/20 text-gray-400',
    gradient: 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base',
  };

  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${roundedMap[rounded]}
        ${className}
      `}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {Icon && <Icon className="w-3 h-3" />}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Badge;