// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Activity,
  Award,
  TrendingUp,
  Zap,
  Flame,
  Star,
  Crown,
  Shield,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  MoreVertical,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
} from 'lucide-react';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import AdminChart from '../../components/admin/AdminChart';
import AdminTable from '../../components/admin/AdminTable';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [timeframe, setTimeframe] = useState('weekly');

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent activity
      const activityResponse = await fetch('/api/admin/recent-activity', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const activityData = await activityResponse.json();
      setRecentActivity(activityData);

      // Fetch growth data
      const growthResponse = await fetch(`/api/admin/growth?period=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const growthData = await growthResponse.json();
      setGrowthData(growthData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers || 0,
      change: stats.userGrowth || 0,
      color: 'primary',
      period: 'This month',
    },
    {
      icon: Target,
      label: 'Missions Completed',
      value: stats.totalMissions || 0,
      change: stats.missionGrowth || 0,
      color: 'success',
      period: 'This month',
    },
    {
      icon: Activity,
      label: 'Active Habits',
      value: stats.activeHabits || 0,
      change: stats.habitGrowth || 0,
      color: 'info',
      period: 'This month',
    },
    {
      icon: Award,
      label: 'Achievements Unlocked',
      value: stats.totalAchievements || 0,
      change: stats.achievementGrowth || 0,
      color: 'warning',
      period: 'This month',
    },
  ];

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.displayName || 'Admin'}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-primary-500 rounded-lg text-white hover:bg-primary-600 transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AdminStatsCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              color={stat.color}
              period={stat.period}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6 border border-white/20">
          <h3 className="text-sm font-semibold text-white mb-4">User Growth</h3>
          <AdminChart
            data={growthData}
            type="area"
            xKey="date"
            yKey="users"
            height={300}
          />
        </div>
        <div className="glass-effect rounded-xl p-6 border border-white/20">
          <h3 className="text-sm font-semibold text-white mb-4">Activity Distribution</h3>
          <AdminChart
            data={stats.distribution || []}
            type="pie"
            height={300}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          <button className="text-sm text-primary-400 hover:text-primary-300">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
            >
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getActivityColor = (type) => {
  const colors = {
    user: 'bg-blue-500/20 text-blue-400',
    mission: 'bg-green-500/20 text-green-400',
    habit: 'bg-yellow-500/20 text-yellow-400',
    achievement: 'bg-purple-500/20 text-purple-400',
    challenge: 'bg-red-500/20 text-red-400',
  };
  return colors[type] || 'bg-gray-500/20 text-gray-400';
};

const getActivityIcon = (type) => {
  const icons = {
    user: Users,
    mission: Target,
    habit: Activity,
    achievement: Award,
    challenge: Shield,
  };
  const Icon = icons[type] || Activity;
  return <Icon className="w-4 h-4" />;
};

const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    failed: 'bg-red-500/20 text-red-400',
    active: 'bg-blue-500/20 text-blue-400',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400';
};

const AdminLoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="h-4 w-64 bg-white/5 rounded mt-2"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-32 bg-white/5 rounded"></div>
        <div className="h-10 w-10 bg-white/5 rounded"></div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="h-64 bg-white/5 rounded-xl"></div>
      <div className="h-64 bg-white/5 rounded-xl"></div>
    </div>
    <div className="h-64 bg-white/5 rounded-xl"></div>
  </div>
);

export default AdminDashboard;