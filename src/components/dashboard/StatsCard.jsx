// src/components/dashboard/StatsCard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Award,
  Target,
  Flame,
  Clock,
  Calendar,
  Star,
  Trophy,
  Users,
  Heart,
  Brain,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Info,
  ChevronRight,
  Sparkles,
  Crown,
  Gem,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const StatsCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendValue,
  color = 'primary',
  subtitle,
  subtitleValue,
  progress,
  progressColor,
  loading = false,
  onClick,
  className = '',
  tooltip,
  animate = true,
  size = 'default',
  variant = 'default',
  badges = [],
  stats = [],
  onRefresh,
  lastUpdated,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  // Color mappings
  const colorMap = {
    primary: {
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/20',
      text: 'text-primary-400',
      gradient: 'from-primary-500 to-secondary-500',
    },
    secondary: {
      bg: 'bg-secondary-500/10',
      border: 'border-secondary-500/20',
      text: 'text-secondary-400',
      gradient: 'from-secondary-500 to-pink-500',
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      gradient: 'from-green-500 to-emerald-500',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      gradient: 'from-yellow-500 to-orange-500',
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      gradient: 'from-red-500 to-pink-500',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      gradient: 'from-blue-500 to-cyan-500',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-500',
    },
    gray: {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
      text: 'text-gray-400',
      gradient: 'from-gray-500 to-gray-600',
    },
  };

  // Size mappings
  const sizeMap = {
    small: {
      padding: 'p-3',
      iconSize: 'w-4 h-4',
      iconWrapper: 'p-1.5',
      valueSize: 'text-lg',
      labelSize: 'text-xs',
      subtitleSize: 'text-xs',
    },
    default: {
      padding: 'p-4',
      iconSize: 'w-5 h-5',
      iconWrapper: 'p-2',
      valueSize: 'text-2xl',
      labelSize: 'text-sm',
      subtitleSize: 'text-xs',
    },
    large: {
      padding: 'p-6',
      iconSize: 'w-6 h-6',
      iconWrapper: 'p-3',
      valueSize: 'text-3xl',
      labelSize: 'text-base',
      subtitleSize: 'text-sm',
    },
  };

  // Variant mappings
  const variantMap = {
    default: 'glass-effect border border-white/20',
    elevated: 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl',
    bordered: 'bg-transparent border border-white/20',
    gradient: 'bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/20',
  };

  const colors = colorMap[color] || colorMap.primary;
  const sizes = sizeMap[size] || sizeMap.default;
  const variants = variantMap[variant] || variantMap.default;

  // Animate value on mount
  useEffect(() => {
    if (animate && typeof value === 'number') {
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
  }, [value, animate]);

  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  // Get trend icon
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
    if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  // Get trend color
  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  // Format value based on type
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toString();
    }
    return val;
  };

  // Get progress color
  const getProgressColor = () => {
    if (progressColor) return progressColor;
    if (progress >= 80) return 'bg-green-400';
    if (progress >= 60) return 'bg-yellow-400';
    if (progress >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <motion.div
      className={`
        relative rounded-xl transition-all duration-300
        ${variants}
        ${sizes.padding}
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${isHovered ? 'shadow-xl shadow-primary-500/10' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
          <Loader className="w-6 h-6 text-primary-400 animate-spin" />
        </div>
      )}

      {/* Refresh Button */}
      {onRefresh && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRefresh();
          }}
          className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white z-10"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Icon */}
          {Icon && (
            <div className={`
              rounded-lg ${colors.bg} ${sizes.iconWrapper}
              flex items-center justify-center
            `}>
              <Icon className={`${sizes.iconSize} ${colors.text}`} />
            </div>
          )}
          
          <div>
            {/* Label */}
            <p className={`${sizes.labelSize} text-gray-400 font-medium`}>
              {label}
            </p>
            
            {/* Value */}
            <div className="flex items-center gap-2">
              <p className={`${sizes.valueSize} font-bold text-white`}>
                {loading ? '...' : formatValue(animatedValue)}
              </p>
              
              {/* Trend */}
              {trend && trendValue && (
                <div className={`flex items-center gap-0.5 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="text-xs font-medium">{trendValue}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <button
            data-tooltip-id={`tooltip-${label}`}
            data-tooltip-content={tooltip}
            className="text-gray-400 hover:text-white transition"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className={`${sizes.subtitleSize} text-gray-400 mt-1`}>
          {subtitle}
          {subtitleValue && (
            <span className="font-medium text-white ml-1">
              {subtitleValue}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
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

      {/* Stats Grid */}
      {stats && stats.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {stats.map((stat, index) => (
            <div key={index} className="p-2 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className="text-sm font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`
                px-2 py-0.5 rounded-full text-xs font-medium
                ${badge.color === 'primary' ? 'bg-primary-500/20 text-primary-400' : ''}
                ${badge.color === 'success' ? 'bg-green-500/20 text-green-400' : ''}
                ${badge.color === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                ${badge.color === 'danger' ? 'bg-red-500/20 text-red-400' : ''}
                ${badge.color === 'info' ? 'bg-blue-500/20 text-blue-400' : ''}
                ${badge.color === 'purple' ? 'bg-purple-500/20 text-purple-400' : ''}
                ${!badge.color ? 'bg-white/10 text-gray-400' : ''}
              `}
            >
              {badge.icon && <badge.icon className="w-3 h-3 inline mr-0.5" />}
              {badge.label}
            </span>
          ))}
        </div>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="mt-2 text-xs text-gray-500">
          Updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}

      {/* Children */}
      {children}

      {/* Hover Effect Overlay */}
      {onClick && isHovered && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-secondary-500/5 pointer-events-none" />
      )}
    </motion.div>
  );
};

// Sub-components for specialized stats
export const XPStatsCard = ({ xp, level, rank, ...props }) => {
  const nextLevelXP = 1000; // This would come from your level config
  const progress = (xp / nextLevelXP) * 100;

  return (
    <StatsCard
      icon={Zap}
      label="Experience Points"
      value={xp}
      subtitle={`Level ${level}`}
      subtitleValue={`Rank ${rank}`}
      progress={progress}
      badges={[
        { label: `Level ${level}`, color: 'primary' },
        { label: `Rank ${rank}`, color: 'purple' },
      ]}
      stats={[
        { label: 'Next Level', value: `${nextLevelXP - xp} XP` },
        { label: 'Completion', value: `${Math.round(progress)}%` },
      ]}
      {...props}
    />
  );
};

export const StreakStatsCard = ({ streak, bestStreak, ...props }) => {
  return (
    <StatsCard
      icon={Flame}
      label="Current Streak"
      value={`${streak} days`}
      subtitle="Best Streak"
      subtitleValue={`${bestStreak} days`}
      trend={streak > 0 ? 'up' : 'down'}
      trendValue={`+${streak}`}
      badges={[
        { label: '🔥 Hot Streak', color: 'warning' },
        { label: `Best: ${bestStreak}`, color: 'primary' },
      ]}
      stats={[
        { label: 'Today', value: streak > 0 ? '✅ Completed' : '⏳ Pending' },
        { label: 'Weekly Goal', value: `${Math.min(streak, 7)}/7` },
      ]}
      {...props}
    />
  );
};

export const MissionsStatsCard = ({ completed, total, ...props }) => {
  const progress = (completed / total) * 100;

  return (
    <StatsCard
      icon={Target}
      label="Missions"
      value={`${completed}/${total}`}
      subtitle="Completion Rate"
      subtitleValue={`${Math.round(progress)}%`}
      progress={progress}
      badges={[
        { label: `${completed} Completed`, color: 'success' },
        { label: `${total - completed} Remaining`, color: 'warning' },
      ]}
      stats={[
        { label: 'Daily', value: '3/5' },
        { label: 'Weekly', value: '12/20' },
      ]}
      {...props}
    />
  );
};

export const HabitsStatsCard = ({ active, completed, streak, ...props }) => {
  return (
    <StatsCard
      icon={Activity}
      label="Habits"
      value={active}
      subtitle="Active Habits"
      subtitleValue={`${completed} completed today`}
      trend={streak > 0 ? 'up' : 'down'}
      trendValue={`${streak} day streak`}
      badges={[
        { label: `${active} Active`, color: 'info' },
        { label: '🔥 Streak', color: 'warning' },
      ]}
      stats={[
        { label: 'Completed', value: completed },
        { label: 'Completion Rate', value: `${Math.round((completed / active) * 100)}%` },
      ]}
      {...props}
    />
  );
};

export const AchievementsStatsCard = ({ unlocked, total, ...props }) => {
  const progress = (unlocked / total) * 100;

  return (
    <StatsCard
      icon={Trophy}
      label="Achievements"
      value={`${unlocked}/${total}`}
      subtitle="Progress"
      subtitleValue={`${Math.round(progress)}%`}
      progress={progress}
      badges={[
        { label: `${unlocked} Unlocked`, color: 'success' },
        { label: '🏆 Collector', color: 'purple' },
      ]}
      stats={[
        { label: 'Rare', value: '5' },
        { label: 'Epic', value: '2' },
      ]}
      {...props}
    />
  );
};

export const HealthStatsCard = ({ score, steps, calories, ...props }) => {
  return (
    <StatsCard
      icon={Heart}
      label="Health Score"
      value={`${score}%`}
      subtitle="Daily Activity"
      subtitleValue={`${steps.toLocaleString()} steps`}
      trend={score > 70 ? 'up' : 'down'}
      trendValue={`${score}%`}
      badges={[
        { label: score >= 80 ? '🌟 Excellent' : '💪 Good', color: score >= 80 ? 'success' : 'warning' },
        { label: `${calories} cal`, color: 'info' },
      ]}
      stats={[
        { label: 'Steps', value: steps.toLocaleString() },
        { label: 'Calories', value: calories.toLocaleString() },
      ]}
      {...props}
    />
  );
};

export const SocialStatsCard = ({ followers, connections, engagement, ...props }) => {
  return (
    <StatsCard
      icon={Users}
      label="Community"
      value={followers.toLocaleString()}
      subtitle="Connections"
      subtitleValue={`${connections} friends`}
      trend={engagement > 50 ? 'up' : 'down'}
      trendValue={`${Math.round(engagement)}% engagement`}
      badges={[
        { label: '👥 Network', color: 'info' },
        { label: '📈 Growing', color: 'success' },
      ]}
      stats={[
        { label: 'Followers', value: followers.toLocaleString() },
        { label: 'Connections', value: connections },
      ]}
      {...props}
    />
  );
};

// Export tooltip styles
export const StatsCardTooltip = () => (
  <Tooltip
    id="stats-tooltip"
    place="top"
    style={{
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      color: '#fff',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: '200px',
    }}
  />
);

export default StatsCard;