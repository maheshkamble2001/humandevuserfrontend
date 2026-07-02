// src/components/admin/AdminStatsCard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronUp,
  ChevronDown,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
  MoreVertical,
  Download,
  Share2,
  Copy,
  Check,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Users,
  Activity,
  Award,
  Flame,
  Star,
  Crown,
  Shield,
  Heart,
  Brain,
  Clock,
  Calendar,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const AdminStatsCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  change,
  changeLabel,
  color = 'primary',
  size = 'default',
  variant = 'default',
  loading = false,
  onClick,
  className = '',
  tooltip,
  badge,
  progress,
  progressLabel,
  period = 'Last 30 days',
  dataPoints = [],
  onRefresh,
  onExport,
  onShare,
  trend = 'up',
  target,
  targetLabel = 'Target',
  formatValue = (val) => val?.toLocaleString() || val,
  animation = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  // Color mappings
  const colorMap = {
    primary: {
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/20',
      text: 'text-primary-400',
      gradient: 'from-primary-500 to-secondary-500',
      hover: 'hover:border-primary-500/40',
    },
    secondary: {
      bg: 'bg-secondary-500/10',
      border: 'border-secondary-500/20',
      text: 'text-secondary-400',
      gradient: 'from-secondary-500 to-pink-500',
      hover: 'hover:border-secondary-500/40',
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      gradient: 'from-green-500 to-emerald-500',
      hover: 'hover:border-green-500/40',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      gradient: 'from-yellow-500 to-orange-500',
      hover: 'hover:border-yellow-500/40',
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      gradient: 'from-red-500 to-pink-500',
      hover: 'hover:border-red-500/40',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      gradient: 'from-blue-500 to-cyan-500',
      hover: 'hover:border-blue-500/40',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
      hover: 'hover:border-purple-500/40',
    },
    gray: {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
      text: 'text-gray-400',
      gradient: 'from-gray-500 to-gray-600',
      hover: 'hover:border-gray-500/40',
    },
  };

  // Size mappings
  const sizeMap = {
    small: {
      padding: 'p-3',
      iconSize: 'w-4 h-4',
      iconWrapper: 'p-1.5',
      valueSize: 'text-xl',
      labelSize: 'text-xs',
      subtitleSize: 'text-xs',
      gap: 'gap-2',
    },
    default: {
      padding: 'p-4',
      iconSize: 'w-5 h-5',
      iconWrapper: 'p-2',
      valueSize: 'text-2xl',
      labelSize: 'text-sm',
      subtitleSize: 'text-xs',
      gap: 'gap-3',
    },
    large: {
      padding: 'p-6',
      iconSize: 'w-6 h-6',
      iconWrapper: 'p-3',
      valueSize: 'text-3xl',
      labelSize: 'text-base',
      subtitleSize: 'text-sm',
      gap: 'gap-4',
    },
  };

  // Variant mappings
  const variantMap = {
    default: 'glass-effect border border-white/20',
    elevated: 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl',
    bordered: 'bg-transparent border-2',
    gradient: 'bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/20',
    minimal: 'bg-transparent border-none',
  };

  const colors = colorMap[color] || colorMap.primary;
  const sizes = sizeMap[size] || sizeMap.default;
  const variants = variantMap[variant] || variantMap.default;

  // Animate value on mount
  useEffect(() => {
    if (animation && typeof value === 'number') {
      let start = 0;
      const duration = 1000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animation]);

  // Get trend icon
  const getTrendIcon = () => {
    if (!change) return null;
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  // Get trend color
  const getTrendColor = () => {
    if (!change) return 'text-gray-400';
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  // Get trend label
  const getTrendLabel = () => {
    if (!change) return '';
    if (change > 0) return `+${change}%`;
    if (change < 0) return `${change}%`;
    return '0%';
  };

  // Get progress color
  const getProgressColor = () => {
    if (progress >= 80) return 'bg-green-400';
    if (progress >= 60) return 'bg-yellow-400';
    if (progress >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  // Handle copy
  const handleCopy = () => {
    const text = `${label}: ${formatValue(value)}${change ? ` (${getTrendLabel()})` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle share
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      const text = `📊 ${label}: ${formatValue(value)}${change ? ` (${getTrendLabel()})` : ''}`;
      if (navigator.share) {
        navigator.share({
          title: label,
          text: text,
          url: window.location.href,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      }
    }
  };

  if (loading) {
    return (
      <div className={`glass-effect rounded-xl ${sizes.padding} border border-white/20 animate-pulse`}>
        <div className="flex items-center gap-3">
          <div className={`${sizes.iconWrapper} bg-white/5 rounded-lg`}>
            <div className={sizes.iconSize} />
          </div>
          <div className="flex-1">
            <div className={`h-4 bg-white/5 rounded w-24 ${sizes.labelSize}`} />
            <div className={`h-6 bg-white/5 rounded w-16 ${sizes.valueSize} mt-1`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`
        relative rounded-xl transition-all duration-300
        ${variants}
        ${sizes.padding}
        ${colors.hover}
        ${onClick ? 'cursor-pointer' : ''}
        ${isHovered ? 'shadow-xl shadow-primary-500/10 scale-[1.02]' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {/* Refresh Overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
          <RefreshCw className="w-6 h-6 text-primary-400 animate-spin" />
        </div>
      )}

      {/* Header */}
      <div className={`flex items-start justify-between ${sizes.gap}`}>
        <div className={`flex items-center ${sizes.gap} flex-1`}>
          {/* Icon */}
          {Icon && (
            <div className={`
              rounded-lg ${colors.bg} ${sizes.iconWrapper}
              flex items-center justify-center flex-shrink-0
            `}>
              <Icon className={`${sizes.iconSize} ${colors.text}`} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Label */}
            <div className="flex items-center gap-2">
              <p className={`${sizes.labelSize} text-gray-400 font-medium truncate`}>
                {label}
              </p>
              {tooltip && (
                <button
                  data-tooltip-id={`tooltip-${label}`}
                  data-tooltip-content={tooltip}
                  className="text-gray-400 hover:text-white transition flex-shrink-0"
                >
                  <Info className="w-3 h-3" />
                </button>
              )}
              {badge && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text} flex-shrink-0`}>
                  {badge}
                </span>
              )}
            </div>

            {/* Value */}
            <div className="flex items-center gap-2 mt-0.5">
              <p className={`${sizes.valueSize} font-bold text-white`}>
                {formatValue(animatedValue)}
              </p>

              {/* Change indicator */}
              {change !== undefined && (
                <div className={`flex items-center gap-0.5 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="text-xs font-medium">{getTrendLabel()}</span>
                  {changeLabel && (
                    <span className="text-xs text-gray-400 ml-0.5">{changeLabel}</span>
                  )}
                </div>
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className={`${sizes.subtitleSize} text-gray-400 mt-0.5`}>
                {subtitle}
                {period && (
                  <span className="text-gray-500 ml-1">• {period}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
              className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
          {onExport && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExport();
              }}
              className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{progressLabel || 'Progress'}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${getProgressColor()}`}
            />
          </div>
        </div>
      )}

      {/* Target */}
      {target && (
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Target className="w-3 h-3 text-primary-400" />
            <span>{targetLabel}: {formatValue(target)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${progress >= 80 ? 'bg-green-400' : 'bg-yellow-400'}`} />
            <span>{Math.min(Math.round((value / target) * 100), 100)}% complete</span>
          </div>
        </div>
      )}

      {/* Data Points */}
      {isExpanded && dataPoints && dataPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="grid grid-cols-2 gap-2">
            {dataPoints.map((point, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <span className="text-xs text-gray-400">{point.label}</span>
                <span className="text-xs font-medium text-white">{formatValue(point.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom Gradient Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} opacity-0 transition-opacity ${isHovered ? 'opacity-100' : ''}`} />
    </motion.div>
  );
};

// Pre-built specialized stat cards
export const StatCardUser = (props) => (
  <AdminStatsCard
    icon={Users}
    label="Total Users"
    color="primary"
    {...props}
  />
);

export const StatCardMission = (props) => (
  <AdminStatsCard
    icon={Target}
    label="Missions Completed"
    color="success"
    {...props}
  />
);

export const StatCardHabit = (props) => (
  <AdminStatsCard
    icon={Activity}
    label="Active Habits"
    color="info"
    {...props}
  />
);

export const StatCardAchievement = (props) => (
  <AdminStatsCard
    icon={Award}
    label="Achievements Unlocked"
    color="purple"
    {...props}
  />
);

export const StatCardStreak = (props) => (
  <AdminStatsCard
    icon={Flame}
    label="Current Streak"
    color="warning"
    {...props}
  />
);

export const StatCardRevenue = (props) => (
  <AdminStatsCard
    icon={Zap}
    label="Revenue"
    color="secondary"
    formatValue={(val) => `$${val?.toLocaleString()}`}
    {...props}
  />
);

export const StatCardGrowth = (props) => (
  <AdminStatsCard
    icon={TrendingUp}
    label="Growth Rate"
    color="success"
    formatValue={(val) => `${val}%`}
    {...props}
  />
);

export const StatCardConversion = (props) => (
  <AdminStatsCard
    icon={CheckCircle}
    label="Conversion Rate"
    color="info"
    formatValue={(val) => `${val}%`}
    {...props}
  />
);

export default AdminStatsCard;