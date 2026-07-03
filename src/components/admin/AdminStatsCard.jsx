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
  Sparkles,
  Gem,
  Medal,
  Trophy,
  Gift,
  Rocket,
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
  // New design props
  gradient = false,
  animatedBorder = false,
  glow = false,
  iconBg = true,
  showSparkle = false,
  borderColor = '',
  textColor = '',
  bgColor = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showGlow, setShowGlow] = useState(false);

  // Color mappings with enhanced colors
  const colorMap = {
    primary: {
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/30',
      text: 'text-primary-400',
      gradient: 'from-primary-500 via-purple-500 to-secondary-500',
      hover: 'hover:border-primary-500/60',
      glow: 'shadow-primary-500/20',
      badge: 'bg-primary-500/20 text-primary-400',
      progress: 'from-primary-500 to-purple-500',
    },
    secondary: {
      bg: 'bg-secondary-500/10',
      border: 'border-secondary-500/30',
      text: 'text-secondary-400',
      gradient: 'from-secondary-500 via-pink-500 to-rose-500',
      hover: 'hover:border-secondary-500/60',
      glow: 'shadow-secondary-500/20',
      badge: 'bg-secondary-500/20 text-secondary-400',
      progress: 'from-secondary-500 to-pink-500',
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      hover: 'hover:border-green-500/60',
      glow: 'shadow-green-500/20',
      badge: 'bg-green-500/20 text-green-400',
      progress: 'from-green-500 to-emerald-500',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      gradient: 'from-yellow-500 via-orange-500 to-amber-500',
      hover: 'hover:border-yellow-500/60',
      glow: 'shadow-yellow-500/20',
      badge: 'bg-yellow-500/20 text-yellow-400',
      progress: 'from-yellow-500 to-orange-500',
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      gradient: 'from-red-500 via-pink-500 to-rose-500',
      hover: 'hover:border-red-500/60',
      glow: 'shadow-red-500/20',
      badge: 'bg-red-500/20 text-red-400',
      progress: 'from-red-500 to-pink-500',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      gradient: 'from-blue-500 via-cyan-500 to-sky-500',
      hover: 'hover:border-blue-500/60',
      glow: 'shadow-blue-500/20',
      badge: 'bg-blue-500/20 text-blue-400',
      progress: 'from-blue-500 to-cyan-500',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      gradient: 'from-purple-500 via-indigo-500 to-violet-500',
      hover: 'hover:border-purple-500/60',
      glow: 'shadow-purple-500/20',
      badge: 'bg-purple-500/20 text-purple-400',
      progress: 'from-purple-500 to-indigo-500',
    },
    gray: {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/30',
      text: 'text-gray-400',
      gradient: 'from-gray-500 via-gray-600 to-gray-700',
      hover: 'hover:border-gray-500/60',
      glow: 'shadow-gray-500/20',
      badge: 'bg-gray-500/20 text-gray-400',
      progress: 'from-gray-500 to-gray-600',
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
      progressHeight: 'h-1',
    },
    default: {
      padding: 'p-4',
      iconSize: 'w-5 h-5',
      iconWrapper: 'p-2.5',
      valueSize: 'text-2xl',
      labelSize: 'text-sm',
      subtitleSize: 'text-xs',
      gap: 'gap-3',
      progressHeight: 'h-1.5',
    },
    large: {
      padding: 'p-6',
      iconSize: 'w-6 h-6',
      iconWrapper: 'p-3',
      valueSize: 'text-3xl',
      labelSize: 'text-base',
      subtitleSize: 'text-sm',
      gap: 'gap-4',
      progressHeight: 'h-2',
    },
  };

  // Variant mappings
  const variantMap = {
    default: 'glass-effect border border-white/10 backdrop-blur-sm',
    elevated: 'bg-white/5 backdrop-blur-lg border border-white/20 shadow-2xl',
    bordered: 'bg-transparent border-2',
    gradient: 'bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-white/10 backdrop-blur-sm',
    minimal: 'bg-transparent border-none',
    neon: 'bg-dark-800/50 border border-primary-500/30 backdrop-blur-sm shadow-[0_0_30px_rgba(125,38,255,0.1)]',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl',
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

  // Glow effect on hover
  useEffect(() => {
    if (glow && isHovered) {
      setShowGlow(true);
    } else {
      setShowGlow(false);
    }
  }, [isHovered, glow]);

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
    if (progress >= 80) return 'bg-gradient-to-r from-green-400 to-emerald-400';
    if (progress >= 60) return 'bg-gradient-to-r from-yellow-400 to-orange-400';
    if (progress >= 40) return 'bg-gradient-to-r from-orange-400 to-red-400';
    return 'bg-gradient-to-r from-red-400 to-pink-400';
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

  // Get gradient border style
  const getBorderStyle = () => {
    if (animatedBorder && isHovered) {
      return {
        borderImage: `linear-gradient(135deg, ${colors.text.replace('text-', '')}, ${colors.text.replace('text-', '')}88) 1`,
        borderImageSlice: 1,
        borderWidth: '2px',
        borderStyle: 'solid',
      };
    }
    return {};
  };

  if (loading) {
    return (
      <div className={`glass-effect rounded-xl ${sizes.padding} border border-white/10 animate-pulse`}>
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
        relative rounded-xl transition-all duration-500
        ${variants}
        ${sizes.padding}
        ${colors.hover}
        ${onClick ? 'cursor-pointer' : ''}
        ${isHovered ? `shadow-2xl ${colors.glow} scale-[1.02]` : ''}
        ${gradient ? `bg-gradient-to-br ${colors.gradient}` : ''}
        ${bgColor || ''}
        ${borderColor || ''}
        ${className}
      `}
      style={getBorderStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {/* Glow Effect */}
      {showGlow && (
        <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-xl blur-xl opacity-20 -z-10`} />
      )}

      {/* Sparkle Effect */}
      {showSparkle && (
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      )}

      {/* Refresh Overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10 backdrop-blur-sm">
          <RefreshCw className="w-6 h-6 text-primary-400 animate-spin" />
        </div>
      )}

      {/* Header */}
      <div className={`flex items-start justify-between ${sizes.gap}`}>
        <div className={`flex items-center ${sizes.gap} flex-1 min-w-0`}>
          {/* Icon */}
          {Icon && (
            <div className={`
              relative rounded-xl ${iconBg ? colors.bg : 'bg-transparent'} ${sizes.iconWrapper}
              flex items-center justify-center flex-shrink-0
              transition-all duration-300
              ${isHovered ? 'scale-110' : ''}
            `}>
              <Icon className={`${sizes.iconSize} ${colors.text}`} />
              {isHovered && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20"
                />
              )}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Label - FIX: Added truncate and max-width */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`${sizes.labelSize} text-gray-400 font-medium truncate max-w-[120px] sm:max-w-[200px]`}>
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
                <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge} flex-shrink-0 font-medium`}>
                  {badge}
                </span>
              )}
            </div>

            {/* Value - FIX: Added break-all and max-width */}
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className={`${sizes.valueSize} font-bold text-white tracking-tight break-all`}>
                {formatValue(animatedValue)}
              </p>

              {/* Change indicator */}
              {change !== undefined && (
                <div className={`flex items-center gap-0.5 ${getTrendColor()} bg-white/5 px-1.5 py-0.5 rounded-full flex-shrink-0`}>
                  {getTrendIcon()}
                  <span className="text-xs font-bold">{getTrendLabel()}</span>
                  {changeLabel && (
                    <span className="text-xs text-gray-400 ml-0.5 hidden sm:inline">{changeLabel}</span>
                  )}
                </div>
              )}
            </div>

            {/* Subtitle - FIX: Added truncate */}
            {subtitle && (
              <p className={`${sizes.subtitleSize} text-gray-400 mt-0.5 truncate`}>
                {subtitle}
                {period && (
                  <span className="text-gray-500 ml-1 hidden sm:inline">• {period}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Actions - FIX: Added flex-shrink-0 to prevent overflow */}
        <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
          {onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white disabled:opacity-50"
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
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          {dataPoints && dataPoints.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span className="font-medium truncate">{progressLabel || 'Progress'}</span>
            <span className="font-bold text-white flex-shrink-0">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${getProgressColor()}`}
              style={{ height: sizes.progressHeight || 'h-1.5' }}
            />
          </div>
        </div>
      )}

      {/* Target */}
      {target && (
        <div className="mt-3 flex items-center gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Target className="w-3 h-3 text-primary-400 flex-shrink-0" />
            <span>{targetLabel}:</span>
            <span className="font-medium text-white">{formatValue(target)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${progress >= 80 ? 'bg-green-400' : 'bg-yellow-400'} flex-shrink-0`} />
            <span className="text-gray-400">
              {Math.min(Math.round((value / target) * 100), 100)}% complete
            </span>
          </div>
        </div>
      )}

      {/* Data Points */}
      <AnimatePresence>
        {isExpanded && dataPoints && dataPoints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="grid grid-cols-2 gap-2">
              {dataPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition min-w-0"
                >
                  <span className="text-xs text-gray-400 truncate">{point.label}</span>
                  <span className="text-xs font-bold text-white flex-shrink-0 ml-2">{formatValue(point.value)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Gradient Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />

      {/* Corner decoration */}
      {isHovered && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r ${colors.gradient} opacity-10 rotate-45`} />
        </div>
      )}
    </motion.div>
  );
};

// Pre-built specialized stat cards
export const StatCardUser = (props) => (
  <AdminStatsCard
    icon={Users}
    label="Total Users"
    color="primary"
    iconBg={true}
    showSparkle={true}
    {...props}
  />
);

export const StatCardMission = (props) => (
  <AdminStatsCard
    icon={Target}
    label="Missions Completed"
    color="success"
    iconBg={true}
    {...props}
  />
);

export const StatCardHabit = (props) => (
  <AdminStatsCard
    icon={Activity}
    label="Active Habits"
    color="info"
    iconBg={true}
    {...props}
  />
);

export const StatCardAchievement = (props) => (
  <AdminStatsCard
    icon={Award}
    label="Achievements Unlocked"
    color="purple"
    iconBg={true}
    showSparkle={true}
    {...props}
  />
);

export const StatCardStreak = (props) => (
  <AdminStatsCard
    icon={Flame}
    label="Current Streak"
    color="warning"
    iconBg={true}
    {...props}
  />
);

export const StatCardRevenue = (props) => (
  <AdminStatsCard
    icon={Zap}
    label="Revenue"
    color="secondary"
    formatValue={(val) => `$${val?.toLocaleString()}`}
    iconBg={true}
    {...props}
  />
);

export const StatCardGrowth = (props) => (
  <AdminStatsCard
    icon={TrendingUp}
    label="Growth Rate"
    color="success"
    formatValue={(val) => `${val}%`}
    iconBg={true}
    {...props}
  />
);

export const StatCardConversion = (props) => (
  <AdminStatsCard
    icon={CheckCircle}
    label="Conversion Rate"
    color="info"
    formatValue={(val) => `${val}%`}
    iconBg={true}
    {...props}
  />
);

export const StatCardPremium = (props) => (
  <AdminStatsCard
    icon={Crown}
    label="Premium Users"
    color="purple"
    variant="elevated"
    iconBg={true}
    showSparkle={true}
    glow={true}
    {...props}
  />
);

export const StatCardActive = (props) => (
  <AdminStatsCard
    icon={Activity}
    label="Active Users"
    color="success"
    variant="neon"
    iconBg={true}
    animatedBorder={true}
    {...props}
  />
);

export default AdminStatsCard;