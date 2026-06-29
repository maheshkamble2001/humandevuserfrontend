// src/pages/Leaderboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  Star,
  Award,
  Users,
  TrendingUp,
  Zap,
  Flame,
  Target,
  Activity,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  EyeOff,
  RefreshCw,
  Loader,
  Sparkles,
  Gem,
  Shield,
  Heart,
  Brain,
  Briefcase,
  Code,
  Palette,
  GraduationCap,
  Dumbbell,
  Camera,
  Share2,
  Bookmark,
  Flag,
  MoreVertical,
  BarChart3,
  TrendingDown,
  Award as AwardIcon,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../context/WebSocketContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { socket, isConnected } = useWebSocket();
  const { profile } = useSelector(state => state.user);
  
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('weekly');
  const [sortBy, setSortBy] = useState('xp');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const itemsPerPage = 20;
  const searchRef = useRef(null);

  // Fetch leaderboard data
  useEffect(() => {
    fetchLeaderboard();
  }, [filter, timeframe, sortBy, currentPage]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('leaderboard_update', (data) => {
      handleLeaderboardUpdate(data);
    });

    socket.on('user_rank_update', (data) => {
      if (data.userId === user?.id) {
        setUserRank(data);
      }
    });

    return () => {
      socket.off('leaderboard_update');
      socket.off('user_rank_update');
    };
  }, [socket, isConnected, user]);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/leaderboard?page=${currentPage}&limit=${itemsPerPage}&filter=${filter}&timeframe=${timeframe}&sort=${sortBy}&search=${searchTerm}`
      );
      const data = await response.json();
      setLeaderboardData(data.users);
      setUserRank(data.userRank);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaderboardUpdate = (data) => {
    setLeaderboardData(prev => {
      const updated = [...prev];
      const index = updated.findIndex(u => u.id === data.userId);
      if (index !== -1) {
        updated[index] = { ...updated[index], ...data };
      }
      return updated;
    });
    setAnimationKey(prev => prev + 1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeaderboard();
    setIsRefreshing(false);
    toast.success('Leaderboard refreshed!');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLeaderboard();
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getRankIcon = (rank) => {
    const icons = {
      1: Crown,
      2: Medal,
      3: Star,
    };
    return icons[rank] || Award;
  };

  const getRankColor = (rank) => {
    const colors = {
      1: 'text-yellow-400',
      2: 'text-gray-300',
      3: 'text-amber-600',
    };
    return colors[rank] || 'text-primary-400';
  };

  const getRankBgColor = (rank) => {
    const colors = {
      1: 'bg-yellow-400/20',
      2: 'bg-gray-300/20',
      3: 'bg-amber-600/20',
    };
    return colors[rank] || 'bg-primary-500/10';
  };

  const getTimeframeLabel = () => {
    const labels = {
      daily: 'Today',
      weekly: 'This Week',
      monthly: 'This Month',
      allTime: 'All Time',
    };
    return labels[timeframe] || timeframe;
  };

  const getFilterIcon = (filterType) => {
    const icons = {
      all: Users,
      developer: Code,
      designer: Palette,
      business: Briefcase,
      student: GraduationCap,
      fitness: Dumbbell,
      creator: Camera,
    };
    return icons[filterType] || Users;
  };

  const getFilterLabel = (filterType) => {
    const labels = {
      all: 'All Players',
      developer: 'Developers',
      designer: 'Designers',
      business: 'Business',
      student: 'Students',
      fitness: 'Fitness',
      creator: 'Creators',
    };
    return labels[filterType] || filterType;
  };

  const formatValue = (value) => {
    if (typeof value === 'number') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toString();
    }
    return value;
  };

  const getRankChangeIcon = (change) => {
    if (change > 0) return <ArrowUp className="w-3 h-3 text-green-400" />;
    if (change < 0) return <ArrowDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const getRankChangeColor = (change) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const filters = [
    { value: 'all', label: 'All Players' },
    { value: 'developer', label: 'Developers' },
    { value: 'designer', label: 'Designers' },
    { value: 'business', label: 'Business' },
    { value: 'student', label: 'Students' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'creator', label: 'Creators' },
  ];

  const timeframes = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'allTime', label: 'All Time' },
  ];

  const sortOptions = [
    { value: 'xp', label: 'XP' },
    { value: 'level', label: 'Level' },
    { value: 'missions', label: 'Missions' },
    { value: 'streak', label: 'Streak' },
  ];

  if (isLoading && leaderboardData.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Leaderboard</h1>
          <p className="text-gray-400">
            See where you rank among other players
            {timeframe !== 'allTime' && ` • ${getTimeframeLabel()}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="small"
            icon={RefreshCw}
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={viewMode === 'grid' ? BarChart3 : Users}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
        </div>
      </div>

      {/* User Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-4 border border-primary-500/20 bg-primary-500/5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full ${getRankBgColor(userRank.rank)} flex items-center justify-center`}>
                  <span className="text-xl font-bold text-white">{userRank.rank}</span>
                </div>
                {userRank.change !== 0 && (
                  <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-bold ${getRankChangeColor(userRank.change)} bg-dark-800 border border-white/10`}>
                    {userRank.change > 0 ? '+' : ''}{userRank.change}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Your Rank</p>
                <p className="text-xs text-gray-400">
                  {formatValue(userRank.xp)} XP • Level {userRank.level} • {userRank.streak} day streak
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Next Rank</p>
                <p className="text-sm font-semibold text-white">
                  {userRank.nextRank || '—'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Progress</p>
                <p className="text-sm font-semibold text-white">
                  {Math.round(userRank.progress || 0)}%
                </p>
              </div>
              <div className="w-24">
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${userRank.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Timeframe */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Timeframe</label>
                  <div className="flex flex-wrap gap-1.5">
                    {timeframes.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => {
                          setTimeframe(t.value);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          timeframe === t.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {filters.map((f) => {
                      const Icon = getFilterIcon(f.value);
                      return (
                        <button
                          key={f.value}
                          onClick={() => {
                            setFilter(f.value);
                            setCurrentPage(1);
                          }}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                            filter === f.value
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{f.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Sort By</label>
                  <div className="flex flex-wrap gap-1.5">
                    {sortOptions.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => {
                          setSortBy(s.value);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          sortBy === s.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leaderboard Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <GridLeaderboard
            key="grid"
            data={leaderboardData}
            onUserClick={handleUserClick}
            getRankIcon={getRankIcon}
            getRankColor={getRankColor}
            getRankBgColor={getRankBgColor}
            formatValue={formatValue}
            getRankChangeIcon={getRankChangeIcon}
            getRankChangeColor={getRankChangeColor}
          />
        ) : (
          <ListLeaderboard
            key="list"
            data={leaderboardData}
            onUserClick={handleUserClick}
            getRankIcon={getRankIcon}
            getRankColor={getRankColor}
            getRankBgColor={getRankBgColor}
            formatValue={formatValue}
            getRankChangeIcon={getRankChangeIcon}
            getRankChangeColor={getRankChangeColor}
          />
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, leaderboardData.length + ((currentPage - 1) * itemsPerPage))} of {leaderboardData.length + ((currentPage - 1) * itemsPerPage)} players
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="text-sm text-gray-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Grid Leaderboard View
const GridLeaderboard = ({
  data,
  onUserClick,
  getRankIcon,
  getRankColor,
  getRankBgColor,
  formatValue,
  getRankChangeIcon,
  getRankChangeColor,
}) => {
  if (data.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-12 text-center border border-white/20">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white">No players found</h3>
        <p className="text-gray-400">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {data.map((user, index) => {
        const RankIcon = getRankIcon(user.rank);
        const isCurrentUser = user.isCurrentUser;
        
        return (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`
              glass-effect rounded-xl p-4 border cursor-pointer transition-all
              ${isCurrentUser ? 'border-primary-500/50 bg-primary-500/10' : 'border-white/20 hover:border-primary-500/30'}
              hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10
            `}
            onClick={() => onUserClick(user)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${getRankBgColor(user.rank)} flex items-center justify-center`}>
                    <RankIcon className={`w-6 h-6 ${getRankColor(user.rank)}`} />
                  </div>
                  {user.rank <= 3 && (
                    <div className="absolute -top-1 -right-1 text-xs font-bold text-white bg-primary-500 rounded-full w-5 h-5 flex items-center justify-center">
                      {user.rank}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white flex items-center gap-1">
                    {user.displayName}
                    {isCurrentUser && (
                      <span className="text-xs text-primary-400">(You)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Rank #{user.rank}</span>
                    <span>•</span>
                    <span>Level {user.level}</span>
                    {user.rankChange !== 0 && (
                      <span className={`flex items-center gap-0.5 ${getRankChangeColor(user.rankChange)}`}>
                        {getRankChangeIcon(user.rankChange)}
                        {Math.abs(user.rankChange)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-yellow-400">
                  {formatValue(user.xp)} XP
                </p>
                <p className="text-xs text-gray-400">
                  {user.careerPath || 'General'}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-gray-400">Streak</p>
                <p className="text-sm font-semibold text-white flex items-center justify-center gap-0.5">
                  <Flame className="w-3 h-3 text-orange-400" />
                  {user.streak || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Missions</p>
                <p className="text-sm font-semibold text-white">
                  {user.missionsCompleted || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Achievements</p>
                <p className="text-sm font-semibold text-white">
                  {user.achievements || 0}
                </p>
              </div>
            </div>

            {isCurrentUser && (
              <div className="mt-2 text-center">
                <span className="text-xs text-primary-400 font-medium">⭐ Your Position</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// List Leaderboard View
const ListLeaderboard = ({
  data,
  onUserClick,
  getRankIcon,
  getRankColor,
  getRankBgColor,
  formatValue,
  getRankChangeIcon,
  getRankChangeColor,
}) => {
  return (
    <div className="glass-effect rounded-xl border border-white/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Player</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">XP</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Level</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Streak</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Missions</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Achievements</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => {
              const RankIcon = getRankIcon(user.rank);
              const isCurrentUser = user.isCurrentUser;
              
              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`
                    border-b border-white/5 hover:bg-white/5 transition cursor-pointer
                    ${isCurrentUser ? 'bg-primary-500/5' : ''}
                  `}
                  onClick={() => onUserClick(user)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${getRankBgColor(user.rank)} flex items-center justify-center`}>
                        <RankIcon className={`w-4 h-4 ${getRankColor(user.rank)}`} />
                      </div>
                      <span className="text-sm font-medium text-white">#{user.rank}</span>
                      {user.rankChange !== 0 && (
                        <span className={`flex items-center gap-0.5 text-xs ${getRankChangeColor(user.rankChange)}`}>
                          {getRankChangeIcon(user.rankChange)}
                          {Math.abs(user.rankChange)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {user.displayName}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-primary-400">(You)</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{user.careerPath || 'General'}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-yellow-400">
                    {formatValue(user.xp)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {user.level}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm font-medium text-white">
                      <Flame className="w-3 h-3 text-orange-400" />
                      {user.streak || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {user.missionsCompleted || 0}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {user.achievements || 0}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// User Detail Modal
const UserDetailModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('stats');

  const stats = [
    { label: 'Total XP', value: user.xp, icon: Zap },
    { label: 'Level', value: user.level, icon: TrendingUp },
    { label: 'Rank', value: `#${user.rank}`, icon: Award },
    { label: 'Streak', value: `${user.streak} days`, icon: Flame },
    { label: 'Missions', value: user.missionsCompleted || 0, icon: Target },
    { label: 'Achievements', value: user.achievements || 0, icon: Star },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user.displayName?.[0] || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{user.displayName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Rank #{user.rank}</span>
                  <span>•</span>
                  <span>Level {user.level}</span>
                  <span>•</span>
                  <span>{user.careerPath || 'General'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary-400" />
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                  <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 mb-4">
            <div className="flex gap-4">
              {['stats', 'achievements', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-3 py-2 text-sm font-medium transition border-b-2
                    ${activeTab === tab 
                      ? 'text-primary-400 border-primary-400' 
                      : 'text-gray-400 border-transparent hover:text-white'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'stats' && (
              <div className="space-y-3">
                {Object.entries(user.personalityStats || {}).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{key}</span>
                      <span className="text-white">{Math.round(value)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-2 gap-2">
                {user.achievementsList?.length > 0 ? (
                  user.achievementsList.map((achievement, index) => (
                    <div key={index} className="p-2 bg-white/5 rounded-lg flex items-center gap-2">
                      <AwardIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white">{achievement}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 col-span-2 text-center py-4">
                    No achievements yet
                  </p>
                )}
              </div>
            )}
            {activeTab === 'activity' && (
              <div className="space-y-2">
                {user.recentActivity?.length > 0 ? (
                  user.recentActivity.map((activity, index) => (
                    <div key={index} className="p-2 bg-white/5 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-300">{activity}</span>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(`Check out ${user.displayName}'s profile on Life RPG!`);
                toast.success('Copied to clipboard!');
              }}
            >
              Share Profile
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Follow user
                toast.success(`Following ${user.displayName}`);
              }}
            >
              Follow
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="h-4 w-64 bg-white/5 rounded mt-2"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-24 bg-white/5 rounded"></div>
        <div className="h-10 w-24 bg-white/5 rounded"></div>
      </div>
    </div>
    
    <div className="h-24 bg-white/5 rounded-xl"></div>
    <div className="h-16 bg-white/5 rounded-xl"></div>
    
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-48 bg-white/5 rounded-xl"></div>
      ))}
    </div>
  </div>
);

export default Leaderboard;