// src/pages/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Award,
  Target,
  Flame,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  EyeOff,
  Share2,
  Bookmark,
  Flag,
  MoreVertical,
  X,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Analytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('weekly');
  const [data, setData] = useState(null);

  // Mock data
  useEffect(() => {
    setData({
      overview: {
        totalXP: 12500,
        weeklyXP: 850,
        monthlyXP: 3200,
        streak: 14,
        bestStreak: 21,
        completionRate: 78,
        missionsCompleted: 45,
        habitsCompleted: 120,
      },
      trends: {
        xp: [120, 150, 180, 170, 200, 230, 250],
        missions: [2, 3, 4, 3, 5, 4, 6],
        habits: [5, 6, 7, 5, 8, 9, 10],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      distribution: {
        missions: 45,
        habits: 120,
        achievements: 15,
        social: 30,
        learning: 25,
      },
      insights: [
        { title: 'Best Day', value: 'Saturday', description: 'You complete 30% more on Saturdays' },
        { title: 'Most Productive', value: 'Morning', description: 'Your focus peaks between 9-11 AM' },
        { title: 'Growth Rate', value: '+15%', description: 'Your XP growth is accelerating' },
        { title: 'Consistency', value: '78%', description: 'You maintain good consistency' },
      ],
    });
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
          <p className="text-gray-400">Track your progress and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  timeframe === period
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="outline" size="small" icon={Download}>
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 text-yellow-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs text-gray-400">Total XP</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">{data?.overview.totalXP.toLocaleString()}</p>
          <p className="text-xs text-green-400">+{data?.overview.weeklyXP} this week</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="text-xs text-gray-400">Streak</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">{data?.overview.streak} days</p>
          <p className="text-xs text-gray-400">Best: {data?.overview.bestStreak} days</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 text-green-400">
            <Target className="w-4 h-4" />
            <span className="text-xs text-gray-400">Completion</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">{data?.overview.completionRate}%</p>
          <p className="text-xs text-gray-400">{data?.overview.missionsCompleted} missions</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 text-blue-400">
            <Activity className="w-4 h-4" />
            <span className="text-xs text-gray-400">Habits</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">{data?.overview.habitsCompleted}</p>
          <p className="text-xs text-gray-400">Total completions</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 text-purple-400">
            <Award className="w-4 h-4" />
            <span className="text-xs text-gray-400">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">15</p>
          <p className="text-xs text-green-400">+2 this month</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 text-pink-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs text-gray-400">Growth</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">+15%</p>
          <p className="text-xs text-green-400">Month over month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Trend */}
        <div className="glass-effect rounded-xl p-6 border border-white/20">
          <h3 className="text-sm font-semibold text-white mb-4">XP Trend</h3>
          <div className="h-48 flex items-end gap-2">
            {data?.trends.xp.map((value, index) => {
              const height = (value / Math.max(...data.trends.xp)) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="w-full bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-400">{data.trends.labels[index]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Distribution */}
        <div className="glass-effect rounded-xl p-6 border border-white/20">
          <h3 className="text-sm font-semibold text-white mb-4">Activity Distribution</h3>
          <div className="space-y-3">
            {Object.entries(data?.distribution || {}).map(([key, value]) => {
              const total = Object.values(data.distribution).reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              const colors = {
                missions: 'bg-blue-500',
                habits: 'bg-green-500',
                achievements: 'bg-yellow-500',
                social: 'bg-pink-500',
                learning: 'bg-purple-500',
              };
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span className="text-white">{percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`${colors[key] || 'bg-primary-500'} h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-lg"
            >
              <p className="text-xs text-gray-400">{insight.title}</p>
              <p className="text-lg font-bold text-white mt-1">{insight.value}</p>
              <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="h-4 w-64 bg-white/5 rounded mt-2"></div>
      </div>
      <div className="h-10 w-32 bg-white/5 rounded"></div>
    </div>
    <div className="grid grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="h-64 bg-white/5 rounded-xl"></div>
      <div className="h-64 bg-white/5 rounded-xl"></div>
    </div>
    <div className="h-48 bg-white/5 rounded-xl"></div>
  </div>
);

export default Analytics;