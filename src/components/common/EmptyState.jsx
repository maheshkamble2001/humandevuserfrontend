// src/components/common/EmptyState.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({
  title = 'No data available',
  description = 'There is no data to display at the moment.',
  icon: Icon = AlertCircle,
  action,
  actionText = 'Add New',
  className = '',
  image,
  size = 'medium',
}) => {
  const sizes = {
    small: {
      icon: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'gap-3',
    },
    medium: {
      icon: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'gap-4',
    },
    large: {
      icon: 'w-24 h-24',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'gap-5',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex flex-col items-center justify-center text-center
        ${sizes[size].spacing}
        ${className}
      `}
    >
      {image ? (
        <img src={image} alt={title} className="w-32 h-32 opacity-50" />
      ) : (
        <div className="p-4 bg-white/5 rounded-full">
          <Icon className={`${sizes[size].icon} text-gray-500`} />
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className={`${sizes[size].title} font-semibold text-white`}>
          {title}
        </h3>
        <p className={`${sizes[size].description} text-gray-400 max-w-md`}>
          {description}
        </p>
      </div>

      {action && (
        <Button variant="gradient" onClick={action} icon={Plus}>
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;