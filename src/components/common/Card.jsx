// src/components/common/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = false,
  clickable = false,
  onClick,
  padding = 'md',
  variant = 'default',
  animate = false,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const variants = {
    default: 'glass-effect border border-white/10',
    bordered: 'border border-white/20 bg-transparent',
    elevated: 'bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl',
    gradient: 'bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-white/10',
    dark: 'bg-dark-800/50 border border-white/10',
  };

  return (
    <motion.div
      className={`
        rounded-xl
        ${variants[variant]}
        ${paddings[padding]}
        ${hover ? 'hover:border-primary-500/30 transition-all duration-300' : ''}
        ${clickable ? 'cursor-pointer hover:scale-[1.02] transition-all duration-300' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={clickable ? { scale: 1.02 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={animate ? { duration: 0.3 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;