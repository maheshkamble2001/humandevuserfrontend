// src/components/common/Chip.jsx
import React from 'react';
import { X } from 'lucide-react';

const Chip = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  removable = false,
  onRemove,
  icon: Icon,
  clickable = false,
  onClick,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-500/20 text-primary-400 border-primary-500/20',
    secondary: 'bg-secondary-500/20 text-secondary-400 border-secondary-500/20',
    success: 'bg-green-500/20 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
    danger: 'bg-red-500/20 text-red-400 border-red-500/20',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
    outline: 'border border-white/20 text-gray-300 bg-transparent',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium border
        ${variants[variant]}
        ${sizes[size]}
        rounded-full
        ${clickable ? 'cursor-pointer hover:opacity-80 transition' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-0.5 hover:opacity-70 transition"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default Chip;