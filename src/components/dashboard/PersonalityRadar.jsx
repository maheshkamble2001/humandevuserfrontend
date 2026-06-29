// src/components/dashboard/PersonalityRadar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Brain,
  Target,
  Heart,
  Flame,
  Users,
  Shield,
  Palette,
  Crown,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  Award,
  BarChart3,
  Activity,
  Eye,
  EyeOff,
  RefreshCw,
  Loader,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion as framerMotion } from 'framer-motion';

const PersonalityRadar = ({ stats = {}, onStatClick, className = '' }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef(null);

  // Default stats if none provided
  const defaultStats = {
    discipline: 50,
    focus: 50,
    confidence: 50,
    consistency: 50,
    communication: 50,
    resilience: 50,
    creativity: 50,
    leadership: 50,
    emotionalIntelligence: 50,
  };

  const personalityStats = { ...defaultStats, ...stats };

  // Prepare data for radar chart
  const radarData = Object.entries(personalityStats).map(([key, value]) => ({
    subject: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value: Math.min(Math.max(value, 0), 100),
    fullMark: 100,
    key: key,
  }));

  // Stat configurations
  const statConfigs = {
    discipline: {
      icon: Target,
      color: '#7d26ff',
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-500/20',
      textColor: 'text-primary-400',
      description: 'Ability to stay focused and committed to goals',
      tips: [
        'Set daily micro-goals',
        'Practice the 5-minute rule',
        'Create a consistent routine',
        'Track your progress daily',
      ],
    },
    focus: {
      icon: Brain,
      color: '#4f46e5',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      textColor: 'text-indigo-400',
      description: 'Concentration and attention span',
      tips: [
        'Use the Pomodoro technique',
        'Minimize distractions',
        'Practice mindfulness',
        'Take regular breaks',
      ],
    },
    confidence: {
      icon: Heart,
      color: '#ec4899',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      textColor: 'text-pink-400',
      description: 'Self-belief and self-assurance',
      tips: [
        'Celebrate small wins',
        'Practice positive affirmations',
        'Step out of comfort zone',
        'Learn from failures',
      ],
    },
    consistency: {
      icon: Flame,
      color: '#f59e0b',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      textColor: 'text-yellow-400',
      description: 'Reliability and steady effort',
      tips: [
        'Build daily habits',
        'Use habit tracking',
        'Start small and scale',
        'Find an accountability partner',
      ],
    },
    communication: {
      icon: Users,
      color: '#06b6d4',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      textColor: 'text-cyan-400',
      description: 'Expression and interpersonal skills',
      tips: [
        'Practice active listening',
        'Join public speaking groups',
        'Write daily journal entries',
        'Seek feedback from others',
      ],
    },
    resilience: {
      icon: Shield,
      color: '#10b981',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-400',
      description: 'Ability to bounce back from setbacks',
      tips: [
        'Practice self-compassion',
        'Develop a growth mindset',
        'Build support networks',
        'Learn stress management',
      ],
    },
    creativity: {
      icon: Palette,
      color: '#8b5cf6',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      textColor: 'text-purple-400',
      description: 'Innovation and original thinking',
      tips: [
        'Brainstorm daily',
        'Try new experiences',
        'Practice divergent thinking',
        'Keep an idea journal',
      ],
    },
    leadership: {
      icon: Crown,
      color: '#f472b6',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      textColor: 'text-pink-400',
      description: 'Influence and team guidance',
      tips: [
        'Lead by example',
        'Practice delegation',
        'Develop emotional intelligence',
        'Seek mentorship opportunities',
      ],
    },
    emotionalIntelligence: {
      icon: Heart,
      color: '#ef4444',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      textColor: 'text-red-400',
      description: 'Understanding and managing emotions',
      tips: [
        'Practice empathy',
        'Develop self-awareness',
        'Learn conflict resolution',
        'Practice active listening',
      ],
    },
  };

  // Calculate average stat
  const averageStat = Object.values(personalityStats).reduce((a, b) => a + b, 0) / Object.values(personalityStats).length;

  // Get stat rating
  const getStatRating = (value) => {
    if (value >= 80) return { label: 'Excellent', color: 'text-green-400', emoji: '🌟' };
    if (value >= 60) return { label: 'Good', color: 'text-blue-400', emoji: '⭐' };
    if (value >= 40) return { label: 'Average', color: 'text-yellow-400', emoji: '📈' };
    if (value >= 20) return { label: 'Needs Work', color: 'text-orange-400', emoji: '🎯' };
    return { label: 'Needs Focus', color: 'text-red-400', emoji: '💪' };
  };

  // Get stat level
  const getStatLevel = (value) => {
    if (value >= 80) return 'Expert';
    if (value >= 60) return 'Advanced';
    if (value >= 40) return 'Intermediate';
    if (value >= 20) return 'Beginner';
    return 'Novice';
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const config = statConfigs[data.key];
      const Icon = config?.icon || Activity;
      const rating = getStatRating(data.value);
      
      return (
        <div className="glass-effect rounded-lg p-3 border border-white/20 max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-4 h-4 ${config?.textColor || 'text-gray-400'}`} />
            <span className="text-sm font-medium text-white">{data.subject}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">{Math.round(data.value)}%</span>
            <span className={`text-xs ${rating.color}`}>
              {rating.emoji} {rating.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Level: {getStatLevel(data.value)}
          </p>
          {config?.description && (
            <p className="text-xs text-gray-400 mt-1 border-t border-white/10 pt-1">
              {config.description}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleStatClick = (data) => {
    if (data && data.payload) {
      const statKey = data.payload.key;
      setSelectedStat(selectedStat === statKey ? null : statKey);
      if (onStatClick) {
        onStatClick(statKey, personalityStats[statKey]);
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setAnimationKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 500);
  };

  const getStatIcon = (statKey) => {
    const config = statConfigs[statKey];
    if (config?.icon) return config.icon;
    return Activity;
  };

  const getStatColor = (statKey) => {
    const config = statConfigs[statKey];
    return config?.color || '#6b7280';
  };

  return (
    <div className={`glass-effect rounded-xl p-4 border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Personality Stats</h3>
          <span className="text-xs text-gray-400">
            {Object.keys(personalityStats).length} traits
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            title={showDetails ? 'Hide details' : 'Show details'}
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Average Score */}
      <div className="flex items-center justify-between mb-3 p-2 bg-white/5 rounded-lg">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">Overall Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{Math.round(averageStat)}%</span>
          <span className="text-xs text-gray-400">
            {getStatRating(averageStat).emoji} {getStatRating(averageStat).label}
          </span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="relative" style={{ height: '280px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              key={animationKey}
              data={radarData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              onClick={handleStatClick}
            >
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: '#9ca3af',
                  fontSize: 10,
                  fontWeight: 500,
                }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#4b5563', fontSize: 8 }}
                axisLine={false}
              />
              <Radar
                name="Personality Stats"
                dataKey="value"
                stroke="#7d26ff"
                strokeWidth={2}
                fill="#7d26ff"
                fillOpacity={0.3}
                animationDuration={1000}
                animationEasing="ease-out"
                onMouseEnter={(data) => {
                  if (data && data.payload) {
                    setHoveredStat(data.payload.key);
                  }
                }}
                onMouseLeave={() => setHoveredStat(null)}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stat Bars */}
      <div className="mt-4 space-y-2">
        {radarData.map((stat) => {
          const config = statConfigs[stat.key];
          const Icon = config?.icon || Activity;
          const rating = getStatRating(stat.value);
          const isSelected = selectedStat === stat.key;
          
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: radarData.indexOf(stat) * 0.05 }}
              className={`
                group relative p-2 rounded-lg cursor-pointer transition-all
                ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
                ${hoveredStat === stat.key ? 'bg-white/5' : ''}
              `}
              onClick={() => {
                setSelectedStat(isSelected ? null : stat.key);
                if (onStatClick) {
                  onStatClick(stat.key, stat.value);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${config?.textColor || 'text-gray-400'} flex-shrink-0`} />
                <span className="text-xs text-gray-300 flex-1">{stat.subject}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">{Math.round(stat.value)}%</span>
                  <span className="text-xs text-gray-400">{rating.emoji}</span>
                </div>
              </div>
              <div className="mt-1 w-full bg-white/10 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-1.5 rounded-full transition-all`}
                  style={{
                    background: `linear-gradient(90deg, ${config?.color || '#7d26ff'}, ${config?.color || '#7d26ff'}88)`,
                  }}
                />
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 pt-2 border-t border-white/10"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Info className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">{config?.description}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-300 mb-1">Improvement Tips:</p>
                        <ul className="space-y-0.5">
                          {config?.tips?.map((tip, index) => (
                            <li key={index} className="flex items-start gap-1.5 text-xs text-gray-400">
                              <span className="text-primary-400 mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>Level: {getStatLevel(stat.value)}</span>
                        <span>•</span>
                        <span>Rating: {rating.label}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Legend / Stats Summary */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-400">Highest</p>
            <p className="text-sm font-medium text-white">
              {radarData.reduce((max, stat) => stat.value > max.value ? stat : max).subject}
            </p>
            <p className="text-xs text-green-400">
              {Math.round(radarData.reduce((max, stat) => stat.value > max.value ? stat : max).value)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Lowest</p>
            <p className="text-sm font-medium text-white">
              {radarData.reduce((min, stat) => stat.value < min.value ? stat : min).subject}
            </p>
            <p className="text-xs text-orange-400">
              {Math.round(radarData.reduce((min, stat) => stat.value < min.value ? stat : min).value)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Growth Potential</p>
            <p className="text-sm font-medium text-white">
              {Math.round(100 - averageStat)}%
            </p>
            <p className="text-xs text-primary-400">
              Room to grow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityRadar;