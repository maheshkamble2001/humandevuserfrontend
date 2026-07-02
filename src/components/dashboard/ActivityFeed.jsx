// src/components/dashboard/ActivityFeed.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  Activity,
  Zap,
  Award,
  Target,
  CheckCircle,
  Flame,
  Clock,
  TrendingUp,
  Star,
  Users,
  Calendar,
  MessageCircle,
  Heart,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Loader,
  Eye,
  EyeOff,
  Share2,
  Bookmark,
  Flag,
  X
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useWebSocket } from '../../context/WebSocketContext';
import { toast } from 'react-toastify';

const ActivityFeed = () => {
  const dispatch = useDispatch();
  const { socket, isConnected } = useWebSocket();
  const { profile } = useSelector(state => state.user || {});
  
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [newActivityCount, setNewActivityCount] = useState(0);
  
  const feedRef = useRef(null);
  const observerRef = useRef(null);
  const lastActivityRef = useRef(null);

  // Load initial activities
  useEffect(() => {
    fetchActivities();
  }, [filter]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('new_activity', (data) => {
      handleNewActivity(data);
    });

    socket.on('activity_update', (data) => {
      updateActivity(data);
    });

    socket.on('achievement_unlocked', (data) => {
      addAchievementActivity(data);
    });

    socket.on('level_up', (data) => {
      addLevelUpActivity(data);
    });

    socket.on('rank_up', (data) => {
      addRankUpActivity(data);
    });

    return () => {
      socket.off('new_activity');
      socket.off('activity_update');
      socket.off('achievement_unlocked');
      socket.off('level_up');
      socket.off('rank_up');
    };
  }, [socket, isConnected]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!feedRef.current) return;

    const options = {
      root: feedRef.current,
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    }, options);

    if (lastActivityRef.current) {
      observerRef.current.observe(lastActivityRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activities, hasMore, isLoading]);

  // Auto-scroll to bottom when new activities arrive
  useEffect(() => {
    if (autoScroll && feedRef.current && newActivityCount > 0) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [activities.length, autoScroll, newActivityCount]);

  const fetchActivities = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/activities?page=${pageNum}&filter=${filter}&limit=20`);
      const data = await response.json();
      
      // Safety check - ensure data has activities array
      if (data && data.activities && Array.isArray(data.activities)) {
        if (pageNum === 1) {
          setActivities(data.activities);
        } else {
          setActivities(prev => [...prev, ...data.activities]);
        }
        setHasMore(data.hasMore || false);
        setPage(pageNum);
      } else {
        // Handle case where activities is not an array
        setActivities([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchActivities(page + 1);
    }
  };

  const handleNewActivity = (data) => {
    if (!data) return;
    
    // Add to activities
    setActivities(prev => [data, ...prev]);
    
    // Increment new activity count
    setNewActivityCount(prev => prev + 1);
    
    // Show notification
    toast.info(data.message || 'New activity!', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const updateActivity = (data) => {
    if (!data || !data.id) return;
    
    setActivities(prev => 
      prev.map(activity => 
        activity.id === data.id ? { ...activity, ...data } : activity
      )
    );
  };

  const addAchievementActivity = (data) => {
    if (!data) return;
    
    const newActivity = {
      id: `achievement-${Date.now()}`,
      type: 'achievement',
      icon: 'Award',
      title: 'Achievement Unlocked! 🏆',
      content: `You unlocked "${data.achievement?.name || 'an achievement'}"!`,
      timestamp: new Date().toISOString(),
      metadata: data,
      isNew: true,
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addLevelUpActivity = (data) => {
    if (!data) return;
    
    const newActivity = {
      id: `levelup-${Date.now()}`,
      type: 'level_up',
      icon: 'TrendingUp',
      title: 'Level Up! 🎉',
      content: `You reached Level ${data.newLevel || 'a new level'}!`,
      timestamp: new Date().toISOString(),
      metadata: data,
      isNew: true,
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addRankUpActivity = (data) => {
    if (!data) return;
    
    const newActivity = {
      id: `rankup-${Date.now()}`,
      type: 'rank_up',
      icon: 'Star',
      title: 'Rank Up! ⭐',
      content: `You reached Rank ${data.newRank || 'a new rank'}!`,
      timestamp: new Date().toISOString(),
      metadata: data,
      isNew: true,
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    setActivities([]);
    fetchActivities(1);
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  const handleShare = (activity) => {
    if (!activity) return;
    
    if (navigator.share) {
      navigator.share({
        title: activity.title || 'Activity',
        text: activity.content || '',
        url: window.location.href,
      }).catch(console.error);
    } else {
      const text = `${activity.title || 'Activity'}: ${activity.content || ''}`;
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  const handleBookmark = (activityId) => {
    if (!activityId) return;
    
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, bookmarked: !activity.bookmarked }
          : activity
      )
    );
    const activity = activities.find(a => a.id === activityId);
    toast.success(activity?.bookmarked ? 'Bookmark removed' : 'Bookmarked!');
  };

  const clearNewActivities = () => {
    setNewActivityCount(0);
    setActivities(prev => prev.map(activity => ({ ...activity, isNew: false })));
  };

  const getActivityIcon = (type) => {
    if (!type) return Activity;
    
    const icons = {
      mission: Target,
      habit: CheckCircle,
      achievement: Award,
      level_up: TrendingUp,
      rank_up: Star,
      social: Users,
      message: MessageCircle,
      health: Heart,
      learning: Brain,
      xp: Zap,
      reward: Sparkles,
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type) => {
    if (!type) return 'text-gray-400';
    
    const colors = {
      mission: 'text-blue-400',
      habit: 'text-green-400',
      achievement: 'text-yellow-400',
      level_up: 'text-purple-400',
      rank_up: 'text-red-400',
      social: 'text-pink-400',
      message: 'text-cyan-400',
      health: 'text-red-400',
      learning: 'text-indigo-400',
      xp: 'text-yellow-400',
      reward: 'text-orange-400',
    };
    return colors[type] || 'text-gray-400';
  };

  const getActivityBgColor = (type) => {
    if (!type) return 'bg-white/5';
    
    const colors = {
      mission: 'bg-blue-500/10',
      habit: 'bg-green-500/10',
      achievement: 'bg-yellow-500/10',
      level_up: 'bg-purple-500/10',
      rank_up: 'bg-red-500/10',
      social: 'bg-pink-500/10',
      message: 'bg-cyan-500/10',
      health: 'bg-red-500/10',
      learning: 'bg-indigo-500/10',
      xp: 'bg-yellow-500/10',
      reward: 'bg-orange-500/10',
    };
    return colors[type] || 'bg-white/5';
  };

  const activityFilters = [
    { value: 'all', label: 'All Activities', icon: Activity },
    { value: 'mission', label: 'Missions', icon: Target },
    { value: 'habit', label: 'Habits', icon: CheckCircle },
    { value: 'achievement', label: 'Achievements', icon: Award },
    { value: 'xp', label: 'XP Gains', icon: Zap },
    { value: 'social', label: 'Social', icon: Users },
  ];

  // Safe check for activities length
  const hasActivities = activities && Array.isArray(activities) && activities.length > 0;

  return (
    <div className="glass-effect rounded-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Activity Feed</h3>
            {newActivityCount > 0 && (
              <span className="px-2 py-0.5 bg-primary-500 text-xs text-white rounded-full">
                {newActivityCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`p-1.5 rounded-lg transition ${
                autoScroll ? 'text-primary-400 hover:text-primary-300' : 'text-gray-400 hover:text-white'
              }`}
              title={autoScroll ? 'Auto-scroll on' : 'Auto-scroll off'}
            >
              {autoScroll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setActivities([]);
                fetchActivities(1);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <div className="flex flex-wrap gap-2">
                {activityFilters.map((filterOption) => {
                  const Icon = filterOption.icon;
                  return (
                    <button
                      key={filterOption.value}
                      onClick={() => handleFilterChange(filterOption.value)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
                        ${filter === filterOption.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{filterOption.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Activity List */}
      <div 
        ref={feedRef}
        className="max-h-[500px] overflow-y-auto"
      >
        {isLoading && !hasActivities ? (
          <div className="p-8 text-center">
            <Loader className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
            <p className="mt-2 text-sm text-gray-400">Loading activities...</p>
          </div>
        ) : !hasActivities ? (
          <div className="p-8 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-white">No activities yet</h4>
            <p className="text-xs text-gray-400">Start completing missions to see activity here</p>
          </div>
        ) : (
          <>
            {newActivityCount > 0 && (
              <div className="sticky top-0 z-10 p-2 bg-primary-500/10 border-b border-primary-500/20">
                <button
                  onClick={clearNewActivities}
                  className="w-full text-xs text-primary-400 hover:text-primary-300 font-medium"
                >
                  Mark all as read ({newActivityCount})
                </button>
              </div>
            )}

            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity?.type);
              const isLast = index === activities.length - 1;
              
              return (
                <div
                  key={activity?.id || index}
                  ref={isLast ? lastActivityRef : null}
                  className={`
                    group relative p-3 border-b border-white/5 hover:bg-white/5 transition cursor-pointer
                    ${activity?.isNew ? 'bg-primary-500/5' : ''}
                  `}
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="flex items-start gap-3">
                    {/* Activity Icon */}
                    <div className={`p-2 rounded-lg ${getActivityBgColor(activity?.type)} flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${getActivityColor(activity?.type)}`} />
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {activity?.title || 'Activity'}
                          </p>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {activity?.content || ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {activity?.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : 'Just now'}
                          </span>
                        </div>
                      </div>

                      {/* Activity Metadata */}
                      {activity?.metadata && (
                        <div className="mt-1 flex items-center gap-3">
                          {activity.metadata.xp && (
                            <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                              <Zap className="w-3 h-3" />
                              +{activity.metadata.xp} XP
                            </span>
                          )}
                          {activity.metadata.streak && (
                            <span className="text-xs text-orange-400 flex items-center gap-0.5">
                              <Flame className="w-3 h-3" />
                              {activity.metadata.streak} day streak
                            </span>
                          )}
                          {activity.metadata.rank && (
                            <span className="text-xs text-purple-400 flex items-center gap-0.5">
                              <Star className="w-3 h-3" />
                              Rank {activity.metadata.rank}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmark(activity?.id);
                            }}
                            className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${activity?.bookmarked ? 'fill-primary-400 text-primary-400' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(activity);
                            }}
                            className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info('Activity reported for review');
                            }}
                            className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && hasActivities && (
              <div className="p-4 text-center">
                <Loader className="w-6 h-6 text-primary-400 animate-spin mx-auto" />
              </div>
            )}

            {!hasMore && hasActivities && (
              <div className="p-4 text-center">
                <p className="text-xs text-gray-400">No more activities to show</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedActivity && (
          <ActivityDetailModal
            activity={selectedActivity}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedActivity(null);
            }}
            onShare={handleShare}
            onBookmark={handleBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Activity Detail Modal
const ActivityDetailModal = ({ activity, onClose, onShare, onBookmark }) => {
  const Icon = getActivityIcon(activity?.type);
  
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
        className="bg-dark-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${getActivityBgColor(activity?.type)}`}>
                <Icon className={`w-6 h-6 ${getActivityColor(activity?.type)}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{activity?.title || 'Activity'}</h3>
                <p className="text-sm text-gray-400">
                  {activity?.timestamp ? format(new Date(activity.timestamp), 'PPP p') : 'Just now'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-gray-300">{activity?.content || ''}</p>
            
            {activity?.metadata && (
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(activity.metadata).map(([key, value]) => (
                    <div key={key} className="p-2 bg-white/5 rounded">
                      <p className="text-xs text-gray-400 capitalize">{key}</p>
                      <p className="text-sm font-medium text-white">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => {
                onShare(activity);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-primary-500 rounded-lg text-white hover:bg-primary-600 transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => {
                onBookmark(activity?.id);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-white/5 rounded-lg text-white hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              {activity?.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper functions for modal
const getActivityIcon = (type) => {
  if (!type) return Activity;
  
  const icons = {
    mission: Target,
    habit: CheckCircle,
    achievement: Award,
    level_up: TrendingUp,
    rank_up: Star,
    social: Users,
    message: MessageCircle,
    health: Heart,
    learning: Brain,
    xp: Zap,
    reward: Sparkles,
  };
  return icons[type] || Activity;
};

const getActivityColor = (type) => {
  if (!type) return 'text-gray-400';
  
  const colors = {
    mission: 'text-blue-400',
    habit: 'text-green-400',
    achievement: 'text-yellow-400',
    level_up: 'text-purple-400',
    rank_up: 'text-red-400',
    social: 'text-pink-400',
    message: 'text-cyan-400',
    health: 'text-red-400',
    learning: 'text-indigo-400',
    xp: 'text-yellow-400',
    reward: 'text-orange-400',
  };
  return colors[type] || 'text-gray-400';
};

const getActivityBgColor = (type) => {
  if (!type) return 'bg-white/5';
  
  const colors = {
    mission: 'bg-blue-500/10',
    habit: 'bg-green-500/10',
    achievement: 'bg-yellow-500/10',
    level_up: 'bg-purple-500/10',
    rank_up: 'bg-red-500/10',
    social: 'bg-pink-500/10',
    message: 'bg-cyan-500/10',
    health: 'bg-red-500/10',
    learning: 'bg-indigo-500/10',
    xp: 'bg-yellow-500/10',
    reward: 'bg-orange-500/10',
  };
  return colors[type] || 'bg-white/5';
};

export default ActivityFeed;