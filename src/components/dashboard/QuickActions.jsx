// src/components/dashboard/QuickActions.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Target,
  Activity,
  Brain,
  Plus,
  Clock,
  Calendar,
  Star,
  Sparkles,
  Flame,
  Trophy,
  Users,
  BookOpen,
  Code,
  Heart,
  Palette,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Camera,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader,
  Check,
  X,
  AlertCircle,
  Gift,
  Rocket,
  TrendingUp,
  Award,
  Crown,
  Gem,
  Shield,
  Eye,
  EyeOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Settings,
  HelpCircle,
  MessageCircle,
  Share2,
  Bookmark,
  Flag,
  MoreVertical,
  BarChart3,
  Gamepad2,
} from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';

const QuickActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAdvice, getMotivation, generateMissions } = useAI();
  const { profile } = useSelector(state => state.user);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const [customActions, setCustomActions] = useState([]);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionName, setNewActionName] = useState('');
  const [newActionIcon, setNewActionIcon] = useState('Zap');
  const [newActionRoute, setNewActionRoute] = useState('');

  // Available icons for custom actions
  const availableIcons = {
    Zap, Target, Activity, Brain, Plus, Clock, Calendar, Star, Sparkles,
    Flame, Trophy, Users, BookOpen, Code, Heart, Palette, Briefcase,
    GraduationCap, Dumbbell, Camera, Rocket, TrendingUp, Award, Crown,
    Gem, Shield, Settings, HelpCircle, MessageCircle, Share2, Bookmark,
    Flag, Play, Pause, Volume2, VolumeX, Moon, Sun,
  };

  // Default quick actions
  const defaultActions = [
    {
      id: 'daily-advice',
      icon: Sparkles,
      label: 'Daily Advice',
      description: 'Get AI-powered advice',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      action: async () => {
        setIsLoading(true);
        try {
          const advice = await getAdvice();
          setActionResult({
            title: 'Daily Advice',
            content: advice.message,
            type: 'advice',
          });
          setShowResultModal(true);
          toast.success('Daily advice ready! ✨');
        } catch (error) {
          toast.error('Failed to get advice');
        } finally {
          setIsLoading(false);
        }
      },
    },
    {
      id: 'quick-mission',
      icon: Target,
      label: 'Quick Mission',
      description: 'Generate a random mission',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      action: async () => {
        setIsLoading(true);
        try {
          const missions = await generateMissions({ count: 1 });
          setActionResult({
            title: 'New Mission Generated',
            content: missions[0]?.name || 'Complete a random task',
            type: 'mission',
          });
          setShowResultModal(true);
          toast.success('Mission generated! 🎯');
        } catch (error) {
          toast.error('Failed to generate mission');
        } finally {
          setIsLoading(false);
        }
      },
    },
    {
      id: 'track-habit',
      icon: Activity,
      label: 'Track Habit',
      description: 'Log your daily habits',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
      action: () => {
        navigate('/habits');
      },
    },
    {
      id: 'motivation',
      icon: Flame,
      label: 'Get Motivated',
      description: 'Boost your motivation',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400',
      action: async () => {
        setIsLoading(true);
        try {
          const motivation = await getMotivation();
          setActionResult({
            title: '🔥 Motivation Boost',
            content: motivation.message,
            type: 'motivation',
          });
          setShowResultModal(true);
          toast.success('Motivation delivered! 🔥');
        } catch (error) {
          toast.error('Failed to get motivation');
        } finally {
          setIsLoading(false);
        }
      },
    },
    {
      id: 'career-progress',
      icon: Briefcase,
      label: 'Career Progress',
      description: 'Check your career growth',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
      action: () => {
        navigate('/career');
      },
    },
    {
      id: 'leaderboard',
      icon: Trophy,
      label: 'Leaderboard',
      description: 'See where you rank',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400',
      action: () => {
        navigate('/leaderboard');
      },
    },
    {
      id: 'brain-boost',
      icon: Brain,
      label: 'Brain Boost',
      description: 'AI-powered learning',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
      action: () => {
        navigate('/learning');
      },
    },
    {
      id: 'social-share',
      icon: Users,
      label: 'Share Progress',
      description: 'Share your achievements',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
      action: () => {
        const shareText = `🎮 I'm level ${profile?.level || 1} in Life RPG! Join me on this journey to level up your life! 🚀`;
        if (navigator.share) {
          navigator.share({
            title: 'Life RPG Progress',
            text: shareText,
            url: window.location.href,
          }).catch(console.error);
        } else {
          navigator.clipboard.writeText(shareText);
          toast.success('Copied to clipboard!');
        }
      },
    },
    {
      id: 'achievements',
      icon: Award,
      label: 'Achievements',
      description: 'View your achievements',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400',
      action: () => {
        navigate('/achievements');
      },
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      description: 'View your progress',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      action: () => {
        navigate('/analytics');
      },
    },
    {
      id: 'challenges',
      icon: Gamepad2,
      label: 'Challenges',
      description: 'Play mini-games',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      action: () => {
        navigate('/challenges');
      },
    },
    {
      id: 'community',
      icon: Users,
      label: 'Community',
      description: 'Connect with others',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
      action: () => {
        navigate('/community');
      },
    },
  ];

  // Load custom actions from localStorage
  useEffect(() => {
    const savedActions = localStorage.getItem('customQuickActions');
    if (savedActions) {
      try {
        setCustomActions(JSON.parse(savedActions));
      } catch (error) {
        console.error('Error loading custom actions:', error);
      }
    }
  }, []);

  // Save custom actions to localStorage
  useEffect(() => {
    localStorage.setItem('customQuickActions', JSON.stringify(customActions));
  }, [customActions]);

  // Combine default and custom actions
  useEffect(() => {
    const allActions = [...defaultActions, ...customActions];
    setQuickActions(showAllActions ? allActions : allActions.slice(0, 4));
  }, [showAllActions, customActions]);

  const handleAddCustomAction = () => {
    if (!newActionName.trim()) {
      toast.error('Please enter an action name');
      return;
    }

    const IconComponent = availableIcons[newActionIcon] || Zap;

    const newAction = {
      id: `custom-${Date.now()}`,
      icon: IconComponent,
      label: newActionName,
      description: 'Custom quick action',
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-400',
      isCustom: true,
      action: () => {
        if (newActionRoute) {
          navigate(newActionRoute);
        } else {
          toast.info(`Action: ${newActionName}`);
        }
      },
    };

    setCustomActions(prev => [...prev, newAction]);
    setNewActionName('');
    setNewActionIcon('Zap');
    setNewActionRoute('');
    setShowAddAction(false);
    toast.success('Custom action added!');
  };

  const handleRemoveCustomAction = (actionId) => {
    setCustomActions(prev => prev.filter(action => action.id !== actionId));
    toast.info('Action removed');
  };

  const handleActionClick = async (action) => {
    setActiveAction(action.id);
    try {
      await action.action();
    } catch (error) {
      console.error('Action error:', error);
    } finally {
      setActiveAction(null);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 🌅';
    if (hour < 17) return 'Good Afternoon ☀️';
    return 'Good Evening 🌙';
  };

  return (
    <div className="glass-effect rounded-xl p-4 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAddAction(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
            title="Add custom action"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-3 p-2 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg">
        <p className="text-sm text-gray-300">
          {getGreeting()}, {user?.displayName || 'Player'}! 👋
          <span className="block text-xs text-gray-400 mt-0.5">
            Level {profile?.level || 1} • {profile?.xp || 0} XP
          </span>
        </p>
      </div>

      {/* Quick Actions Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isExpanded ? 'expanded' : 'collapsed'}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-2 gap-2"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isActive = activeAction === action.id;

            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleActionClick(action)}
                disabled={isActive || isLoading}
                className={`
                  relative p-3 rounded-lg text-left transition-all
                  ${action.bgColor || 'bg-white/5'}
                  hover:bg-white/10 border border-white/5
                  ${isActive ? 'ring-2 ring-primary-500' : ''}
                  ${action.isCustom ? 'border-dashed border-gray-500/30' : ''}
                  group
                `}
              >
                <div className="flex items-start gap-2">
                  <div className={`p-1.5 rounded-lg ${action.bgColor || 'bg-white/5'}`}>
                    <Icon className={`w-4 h-4 ${action.textColor || 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {action.description}
                    </p>
                  </div>
                  {action.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCustomAction(action.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition p-0.5 hover:bg-white/10 rounded"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <Loader className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                {action.id === 'daily-advice' && (
                  <div className="absolute -top-1 -right-1">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Show More / Less */}
      {defaultActions.length > 4 && (
        <button
          onClick={() => setShowAllActions(!showAllActions)}
          className="mt-3 w-full text-xs text-gray-400 hover:text-white transition flex items-center justify-center gap-1"
        >
          {showAllActions ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              Show More ({defaultActions.length - 4} more)
            </>
          )}
        </button>
      )}

      {/* Action Result Modal */}
      <AnimatePresence>
        {showResultModal && actionResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResultModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-xl max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{actionResult.title}</h3>
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-4 bg-white/5 rounded-lg mb-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {actionResult.content}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={() => setShowResultModal(false)}
                  >
                    Got it!
                  </Button>
                  {actionResult.type === 'advice' && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(actionResult.content);
                        toast.success('Copied to clipboard!');
                      }}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Custom Action Modal */}
      <AnimatePresence>
        {showAddAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddAction(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-800 rounded-xl max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Add Custom Action</h3>

                <div className="space-y-4">
                  <Input
                    label="Action Name"
                    value={newActionName}
                    onChange={(e) => setNewActionName(e.target.value)}
                    placeholder="Enter action name"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Icon
                    </label>
                    <select
                      value={newActionIcon}
                      onChange={(e) => setNewActionIcon(e.target.value)}
                      className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {Object.keys(availableIcons).map((iconName) => (
                        <option key={iconName} value={iconName}>
                          {iconName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Route (optional)"
                    value={newActionRoute}
                    onChange={(e) => setNewActionRoute(e.target.value)}
                    placeholder="/habits"
                  />
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={handleAddCustomAction}
                  >
                    Add Action
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddAction(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActions;