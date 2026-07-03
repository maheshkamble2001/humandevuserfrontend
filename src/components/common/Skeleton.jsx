// src/components/common/Skeleton.jsx
import React from 'react';

const Skeleton = ({
  variant = 'text',
  width = '100%',
  height = 'auto',
  className = '',
  count = 1,
  circle = false,
  ...props
}) => {
  const variants = {
    text: 'h-4',
    title: 'h-8',
    heading: 'h-6',
    subtitle: 'h-5',
    body: 'h-4',
    caption: 'h-3',
    avatar: 'rounded-full',
    image: 'rounded-lg',
    card: 'rounded-xl',
    button: 'rounded-lg h-10',
    input: 'rounded-lg h-10',
    badge: 'rounded-full h-6 w-16',
  };

  const renderSkeleton = () => (
    <div
      className={`
        bg-white/5 animate-pulse
        ${variants[variant] || variants.text}
        ${circle ? 'rounded-full' : ''}
        ${className}
      `}
      style={{
        width: variant === 'avatar' ? height : width,
        height: variant === 'avatar' ? height : (height || 'auto'),
        ...props.style,
      }}
      {...props}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
};

export default Skeleton;