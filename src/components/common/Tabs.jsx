// src/components/common/Tabs.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Tabs = ({
  tabs = [],
  defaultTab = 0,
  onChange,
  variant = 'underline',
  size = 'medium',
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index, tabs[index]);
    }
  };

  const variants = {
    underline: 'border-b border-white/10',
    pill: 'bg-white/5 rounded-lg p-1',
    button: 'gap-1',
  };

  const sizes = {
    small: 'text-sm px-3 py-1.5',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3',
  };

  return (
    <div className={className}>
      <div className={`flex ${variants[variant]}`}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          const Icon = tab.icon;

          return (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`
                relative flex items-center gap-2 font-medium transition
                ${sizes[size]}
                ${variant === 'pill' ? 'rounded-lg' : ''}
                ${variant === 'button' ? 'rounded-lg' : ''}
                ${isActive 
                  ? variant === 'underline' 
                    ? 'text-white border-b-2 border-primary-500' 
                    : variant === 'pill'
                    ? 'bg-primary-500 text-white'
                    : 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }
                ${variant === 'underline' ? 'border-b-2 border-transparent' : ''}
              `}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-500/20 text-primary-400 rounded-full">
                  {tab.badge}
                </span>
              )}
              {isActive && variant === 'underline' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;