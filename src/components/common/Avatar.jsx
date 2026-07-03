// src/components/common/Avatar.jsx
import React from 'react';

const Avatar = ({
  src,
  alt,
  name,
  size = 'medium',
  variant = 'circle',
  className = '',
  status,
  statusColor,
  onClick,
  ...props
}) => {
  const sizes = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  const variants = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  const statusSizes = {
    small: 'w-2 h-2',
    medium: 'w-2.5 h-2.5',
    large: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getRandomColor = (name) => {
    if (!name) return 'bg-primary-500';
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`
        relative flex-shrink-0
        ${sizes[size]}
        ${variants[variant]}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`
            w-full h-full object-cover
            ${variants[variant]}
          `}
        />
      ) : (
        <div
          className={`
            w-full h-full flex items-center justify-center
            ${getRandomColor(name)}
            ${variants[variant]}
            text-white font-semibold
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColor || 'bg-green-400'}
            rounded-full border-2 border-dark-800
          `}
        />
      )}
    </div>
  );
};

export default Avatar;