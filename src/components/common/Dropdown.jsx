// src/components/common/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Button from './Button';

const Dropdown = ({
  trigger,
  children,
  items = [],
  placement = 'bottom-start',
  className = '',
  onSelect,
  variant = 'default',
  size = 'medium',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const placements = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  };

  const variants = {
    default: 'bg-dark-800 border border-white/10',
    glass: 'glass-effect border border-white/10',
    elevated: 'bg-dark-800 shadow-xl border border-white/10',
  };

  const sizes = {
    small: 'min-w-[120px]',
    medium: 'min-w-[160px]',
    large: 'min-w-[200px]',
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <Button variant="outline" icon={ChevronDown} iconPosition="right">
            Select
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50
              ${placements[placement] || placements['bottom-start']}
              ${sizes[size] || sizes.medium}
              ${variants[variant] || variants.default}
              rounded-lg shadow-xl overflow-hidden
            `}
          >
            {children || (
              <div className="py-1">
                {items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (item.onClick) item.onClick(item);
                        if (onSelect) onSelect(item);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-2 px-3 py-2 text-sm
                        ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-white/5'}
                        transition
                      `}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;