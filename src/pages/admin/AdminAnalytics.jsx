// src/pages/admin/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Activity,
  Award,
  Zap,
  Flame,
  Star,
  Crown,
  Shield,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Share2,
  Copy,
  Printer,
  Mail,
  MessageCircle,
  Phone,
  Video,
  Calendar as CalendarIcon,
  MapPin,
  Link,
  FileText,
  Image,
  Music,
  Code,
  Heart,
  Brain,
  Palette,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Camera,
  Users as UsersIcon,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import AdminChart from '../../components/admin/AdminChart';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

const AdminAnalytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('weekly');
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [trends, setTrends] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [insights, setInsights] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [exportModal, setExportModal] = useState(false);
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      
      setData(result);
      setMetrics(result.metrics || {});
      setTrends(result.trends || []);
      setDistribution(result.distribution || []);
      setInsights(result.insights || []);
      setTopUsers(result.topUsers || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/export?period=${period}&type=${reportType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Report exported successfully');
      setExportModal(false);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Failed to export report');
    }
  };

  const handleRefresh = async () => {
    await fetchAnalytics();
    toast.success('Analytics refreshed');
  };

  const handleShare = () => {
    const shareData = {
      title: 'Analytics Report',
      text: `Life RPG Analytics Report - ${format(new Date(), 'PPP')}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
      toast.success('Copied to clipboard');
    }
  };

  const handleCopy = () => {
    const text = `Life RPG Analytics Report\n${format(new Date(), 'PPP')}\n\nTotal Users: ${metrics.totalUsers || 0}\nActive Users: ${metrics.activeUsers || 0}\nMissions Completed: ${metrics.totalMissions || 0}\nAchievements Unlocked: ${metrics.totalAchievements || 0}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getMetricChange = (current, previous) => {
    if (!previous || previous === 0) return { value: 0, trend: 'neutral' };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.round(change),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive analytics and insights for your platform</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  period === p
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="small"
            icon={RefreshCw}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={Download}
            onClick={() => setExportModal(true)}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Date Range */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Period:</span>
            <span className="text-sm text-white font-medium">
              {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => {
                setDateRange({
                  start: subDays(new Date(), 7),
                  end: new Date(),
                });
              }}
              className="px-3 py-1 text-xs bg-white/5 rounded-lg text-gray-400 hover:text-white transition"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                setDateRange({
                  start: subDays(new Date(), 30),
                  end: new Date(),
                });
              }}
              className="px-3 py-1 text-xs bg-white/5 rounded-lg text-gray-400 hover:text-white transition"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => {
                setDateRange({
                  start: subWeeks(new Date(), 12),
                  end: new Date(),
                });
              }}
              className="px-3 py-1 text-xs bg-white/5 rounded-lg text-gray-400 hover:text-white transition"
            >
              Last 3 Months
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Users}
          label="Total Users"
          value={metrics.totalUsers || 0}
          change={metrics.userGrowth || 0}
          color="primary"
          period={`${period} change`}
          tooltip="Total registered users"
        />
        <AdminStatsCard
          icon={Activity}
          label="Active Users"
          value={metrics.activeUsers || 0}
          change={metrics.activeUserGrowth || 0}
          color="success"
          period={`${period} change`}
          tooltip="Users active in the last 30 days"
        />
        <AdminStatsCard
          icon={Target}
          label="Missions Completed"
          value={metrics.totalMissions || 0}
          change={metrics.missionGrowth || 0}
          color="info"
          period={`${period} change`}
          tooltip="Total completed missions"
        />
        <AdminStatsCard
          icon={Award}
          label="Achievements Unlocked"
          value={metrics.totalAchievements || 0}
          change={metrics.achievementGrowth || 0}
          color="purple"
          period={`${period} change`}
          tooltip="Total unlocked achievements"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          data={trends}
          type="area"
          xKey="date"
          yKey="users"
          yKey2="activeUsers"
          title="User Growth"
          colors={['#7d26ff', '#00d4ff']}
          height={350}
          onRefresh={handleRefresh}
        />
        <AdminChart
          data={trends}
          type="bar"
          xKey="date"
          yKey="missions"
          yKey2="achievements"
          title="Activity Overview"
          colors={['#00ff88', '#ffd700']}
          height={350}
          stacked={true}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Distribution and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdminChart
            data={distribution}
            type="pie"
            xKey="name"
            yKey="value"
            title="Activity Distribution"
            height={350}
            onRefresh={handleRefresh}
          />
        </div>
        <div className="lg:col-span-2">
          <div className="glass-effect rounded-xl p-6 border border-white/20">
            <h3 className="text-sm font-semibold text-white mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{insight.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                      {insight.change && (
                        <span className={`text-xs ${insight.change > 0 ? 'text-green-400' : 'text-red-400'} mt-1 inline-block`}>
                          {insight.change > 0 ? '+' : ''}{insight.change}%
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Users Table */}
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Top Performing Users</h3>
          <button className="text-sm text-primary-400 hover:text-primary-300">
            View All →
          </button>
        </div>
        <AdminTable
          columns={[
            { key: 'rank', label: 'Rank' },
            { key: 'name', label: 'Name' },
            { key: 'xp', label: 'XP' },
            { key: 'level', label: 'Level' },
            { key: 'missions', label: 'Missions' },
            { key: 'achievements', label: 'Achievements' },
            { key: 'streak', label: 'Streak' },
          ]}
          data={topUsers}
          onRowClick={(row) => console.log('User clicked:', row)}
          showActions={false}
          showCheckboxes={false}
          pageSize={5}
          renderCell={(column, row) => {
            if (column.key === 'rank') {
              return (
                <span className="font-bold text-white">
                  #{row.rank}
                </span>
              );
            }
            if (column.key === 'name') {
              return (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {row.name?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-white">{row.name}</span>
                </div>
              );
            }
            if (column.key === 'xp') {
              return <span className="text-yellow-400">{row.xp.toLocaleString()}</span>;
            }
            if (column.key === 'level') {
              return <span className="text-white font-bold">Lv.{row.level}</span>;
            }
            if (column.key === 'missions') {
              return <span className="text-blue-400">{row.missions}</span>;
            }
            if (column.key === 'achievements') {
              return <span className="text-purple-400">{row.achievements}</span>;
            }
            if (column.key === 'streak') {
              return (
                <span className="flex items-center gap-1 text-orange-400">
                  <Flame className="w-3 h-3" />
                  {row.streak}d
                </span>
              );
            }
            return row[column.key];
          }}
        />
      </div>

      {/* Export Modal */}
      <AdminModal
        isOpen={exportModal}
        onClose={() => setExportModal(false)}
        title="Export Analytics Report"
        size="md"
        confirmText="Export"
        onConfirm={handleExport}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="overview">Overview Report</option>
              <option value="users">User Analytics</option>
              <option value="activity">Activity Report</option>
              <option value="achievements">Achievements Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Format
            </label>
            <select
              className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">
              The report will include data from {format(dateRange.start, 'MMM d, yyyy')} to {format(dateRange.end, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

// Helper functions
const getInsightColor = (type) => {
  const colors = {
    success: 'bg-green-500/10 text-green-400',
    warning: 'bg-yellow-500/10 text-yellow-400',
    info: 'bg-blue-500/10 text-blue-400',
    danger: 'bg-red-500/10 text-red-400',
    primary: 'bg-primary-500/10 text-primary-400',
  };
  return colors[type] || colors.primary;
};

const getInsightIcon = (type) => {
  const icons = {
    success: CheckCircle,
    warning: AlertCircle,
    info: Info,
    danger: XCircle,
    primary: TrendingUp,
  };
  const Icon = icons[type] || TrendingUp;
  return <Icon className="w-4 h-4" />;
};

// Loading Skeleton
const AdminLoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="h-4 w-64 bg-white/5 rounded mt-2"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-32 bg-white/5 rounded"></div>
        <div className="h-10 w-32 bg-white/5 rounded"></div>
      </div>
    </div>
    <div className="h-16 bg-white/5 rounded-xl"></div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="h-64 bg-white/5 rounded-xl"></div>
      <div className="h-64 bg-white/5 rounded-xl"></div>
    </div>
    <div className="grid grid-cols-3 gap-6">
      <div className="h-64 bg-white/5 rounded-xl"></div>
      <div className="col-span-2 h-64 bg-white/5 rounded-xl"></div>
    </div>
    <div className="h-64 bg-white/5 rounded-xl"></div>
  </div>
);

export default AdminAnalytics;