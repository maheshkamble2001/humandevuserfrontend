// src/pages/Achievements.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Star,
  Crown,
  Gem,
  Medal,
  Sparkles,
  Zap,
  Target,
  Flame,
  Heart,
  Brain,
  Users,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Camera,
  Gift,
  CheckCircle,
  Lock,
  Unlock,
  TrendingUp,
  Clock,
  Calendar,
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
  Filter,
  BarChart3,
  Activity,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    locked: 0,
    rarity: { common: 0, rare: 0, epic: 0, legendary: 0 },
  });

  // Achievement data
  const achievementData = {
    missions: [
      { id: 'first-mission', name: 'First Mission', description: 'Complete your first mission', icon: Target, rarity: 'common', xp: 50 },
      { id: 'mission-master', name: 'Mission Master', description: 'Complete 100 missions', icon: Target, rarity: 'epic', xp: 500 },
      { id: 'daily-grind', name: 'Daily Grind', description: 'Complete 30 daily missions', icon: Calendar, rarity: 'rare', xp: 200 },
      { id: 'weekly-warrior', name: 'Weekly Warrior', description: 'Complete 10 weekly missions', icon: Clock, rarity: 'rare', xp: 250 },
    ],
    habits: [
      { id: 'habit-starter', name: 'Habit Starter', description: 'Create your first habit', icon: Activity, rarity: 'common', xp: 25 },
      { id: 'streak-master', name: 'Streak Master', description: 'Maintain a 30-day streak', icon: Flame, rarity: 'epic', xp: 400 },
      { id: 'habit-collector', name: 'Habit Collector', description: 'Create 10 habits', icon: Activity, rarity: 'rare', xp: 150 },
    ],
    career: [
      { id: 'career-starter', name: 'Career Starter', description: 'Choose your first career path', icon: Briefcase, rarity: 'common', xp: 50 },
      { id: 'skill-master', name: 'Skill Master', description: 'Reach 80% in any skill', icon: Brain, rarity: 'rare', xp: 200 },
      { id: 'career-legend', name: 'Career Legend', description: 'Reach level 50 in any career', icon: Crown, rarity: 'legendary', xp: 1000 },
    ],
    social: [
      { id: 'first-friend', name: 'First Friend', description: 'Add your first friend', icon: Users, rarity: 'common', xp: 50 },
      { id: 'social-butterfly', name: 'Social Butterfly', description: 'Add 50 friends', icon: Users, rarity: 'epic', xp: 500 },
      { id: 'community-hero', name: 'Community Hero', description: 'Get 100 likes on your posts', icon: Heart, rarity: 'rare', xp: 300 },
    ],
    leveling: [
      { id: 'level-10', name: 'Level 10 Achiever', description: 'Reach level 10', icon: Star, rarity: 'common', xp: 100 },
      { id: 'level-25', name: 'Level 25 Veteran', description: 'Reach level 25', icon: Star, rarity: 'rare', xp: 250 },
      { id: 'level-50', name: 'Level 50 Legend', description: 'Reach level 50', icon: Star, rarity: 'epic', xp: 500 },
      { id: 'max-level', name: 'Max Level', description: 'Reach the maximum level', icon: Crown, rarity: 'legendary', xp: 1000 },
    ],
  };

  // Combine all achievements with unlock status
  useEffect(() => {
    const allAchievements = [];
    let unlockedCount = 0;

    Object.values(achievementData).forEach(category => {
      category.forEach(achievement => {
        // Check if unlocked (mock - in production, check against user's achievements)
        const isUnlocked = Math.random() > 0.5;
        if (isUnlocked) unlockedCount++;
        allAchievements.push({
          ...achievement,
          unlocked: isUnlocked,
          unlockedAt: isUnlocked ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
          category: Object.keys(achievementData).find(key => 
            achievementData[key].includes(achievement)
          ),
        });
      });
    });

    setAchievements(allAchievements);
    setStats({
      total: allAchievements.length,
      unlocked: unlockedCount,
      locked: allAchievements.length - unlockedCount,
      rarity: {
        common: allAchievements.filter(a => a.rarity === 'common' && a.unlocked).length,
        rare: allAchievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
        epic: allAchievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
        legendary: allAchievements.filter(a => a.rarity === 'legendary' && a.unlocked).length,
      },
    });
  }, []);

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-400 border-gray-400',
      rare: 'text-blue-400 border-blue-400',
      epic: 'text-purple-400 border-purple-400',
      legendary: 'text-yellow-400 border-yellow-400',
    };
    return colors[rarity] || 'text-gray-400';
  };

  const getRarityBgColor = (rarity) => {
    const colors = {
      common: 'bg-gray-400/10',
      rare: 'bg-blue-400/10',
      epic: 'bg-purple-400/10',
      legendary: 'bg-yellow-400/10',
    };
    return colors[rarity] || 'bg-gray-400/10';
  };

  const getRarityIcon = (rarity) => {
    const icons = {
      common: Star,
      rare: Gem,
      epic: Medal,
      legendary: Crown,
    };
    return icons[rarity] || Star;
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
                          (filter === 'unlocked' && achievement.unlocked) ||
                          (filter === 'locked' && !achievement.unlocked);
    return matchesSearch && matchesFilter;
  });

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setShowDetail(true);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Achievements</h1>
          <p className="text-gray-400">Track your progress and unlock rewards</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {stats.unlocked} / {stats.total} unlocked
          </span>
          <Button variant="outline" size="small" icon={Share2}>
            Share Progress
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-effect rounded-xl p-4 border border-white/20 text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.unlocked}</p>
          <p className="text-xs text-gray-400">Unlocked</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20 text-center">
          <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.locked}</p>
          <p className="text-xs text-gray-400">Locked</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20 text-center">
          <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.rarity.common + stats.rarity.rare}</p>
          <p className="text-xs text-gray-400">Common/Rare</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20 text-center">
          <Crown className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{stats.rarity.epic + stats.rarity.legendary}</p>
          <p className="text-xs text-gray-400">Epic/Legendary</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'unlocked', 'locked'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const RarityIcon = getRarityIcon(achievement.rarity);
          const isUnlocked = achievement.unlocked;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                glass-effect rounded-xl p-4 border cursor-pointer transition-all
                ${isUnlocked 
                  ? `border-${achievement.rarity}-500/30 hover:border-${achievement.rarity}-500/50` 
                  : 'border-white/10 opacity-60 hover:opacity-80'
                }
                hover:scale-[1.02] hover:shadow-xl
              `}
              onClick={() => handleAchievementClick(achievement)}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${getRarityBgColor(achievement.rarity)}`}>
                  <Icon className={`w-6 h-6 ${getRarityColor(achievement.rarity)}`} />
                </div>
                <div className="flex items-center gap-1">
                  <RarityIcon className={`w-4 h-4 ${getRarityColor(achievement.rarity)}`} />
                  <span className="text-xs text-gray-400">{achievement.rarity}</span>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-semibold text-white">{achievement.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs">{achievement.xp} XP</span>
                </div>
                {isUnlocked ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Unlocked</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">Locked</span>
                  </div>
                )}
              </div>

              {isUnlocked && achievement.unlockedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedAchievement && (
          <AchievementDetailModal
            achievement={selectedAchievement}
            onClose={() => {
              setShowDetail(false);
              setSelectedAchievement(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const AchievementDetailModal = ({ achievement, onClose }) => {
  const Icon = achievement.icon;
  const RarityIcon = getRarityIcon(achievement.rarity);

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
        className="bg-dark-800 rounded-xl max-w-md w-full border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${getRarityBgColor(achievement.rarity)}`}>
                <Icon className={`w-8 h-8 ${getRarityColor(achievement.rarity)}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{achievement.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <RarityIcon className={`w-4 h-4 ${getRarityColor(achievement.rarity)}`} />
                  <span className={`text-sm ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                  {achievement.unlocked && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Unlocked
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">{achievement.description}</p>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Reward</span>
                <span className="text-sm text-yellow-400 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {achievement.xp} XP
                </span>
              </div>
            </div>

            {achievement.unlocked && achievement.unlockedAt && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-400">
                  ✅ Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {!achievement.unlocked && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-400">
                  🔒 Keep working to unlock this achievement!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Complete more missions and build habits to progress.
                </p>
              </div>
            )}

            <Button
              variant="gradient"
              className="w-full"
              onClick={() => {
                if (achievement.unlocked) {
                  navigator.clipboard.writeText(`🎮 I unlocked the "${achievement.name}" achievement in Life RPG!`);
                  toast.success('Copied to clipboard!');
                }
              }}
            >
              {achievement.unlocked ? 'Share Achievement' : 'Work Towards This'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const getRarityColor = (rarity) => {
  const colors = {
    common: 'text-gray-400 border-gray-400',
    rare: 'text-blue-400 border-blue-400',
    epic: 'text-purple-400 border-purple-400',
    legendary: 'text-yellow-400 border-yellow-400',
  };
  return colors[rarity] || 'text-gray-400';
};

const getRarityBgColor = (rarity) => {
  const colors = {
    common: 'bg-gray-400/10',
    rare: 'bg-blue-400/10',
    epic: 'bg-purple-400/10',
    legendary: 'bg-yellow-400/10',
  };
  return colors[rarity] || 'bg-gray-400/10';
};

const getRarityIcon = (rarity) => {
  const icons = {
    common: Star,
    rare: Gem,
    epic: Medal,
    legendary: Crown,
  };
  return icons[rarity] || Star;
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
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-24 bg-white/5 rounded-xl"></div>
      ))}
    </div>
    <div className="h-16 bg-white/5 rounded-xl"></div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-48 bg-white/5 rounded-xl"></div>
      ))}
    </div>
  </div>
);

export default Achievements;