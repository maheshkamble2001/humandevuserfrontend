// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchDailyMissions } from '../store/slices/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Zap,
  Award,
  Clock,
  Calendar,
  Activity,
  Target,
  Brain,
  Heart,
  Sparkles,
  Flame,
  Star,
  Users,
  UsersIcon,
  Gamepad2,
  BarChart3,
} from 'lucide-react';

// Import StatsCard and specialized cards
import StatsCard, {
  XPStatsCard,
  StreakStatsCard,
  MissionsStatsCard,
  HabitsStatsCard,
  AchievementsStatsCard,
  HealthStatsCard,
  SocialStatsCard,
} from '../components/dashboard/StatsCard';

import MissionCard from '../components/dashboard/MissionCard';
import LevelProgress from '../components/dashboard/LevelProgress';
import HabitTracker from '../components/dashboard/HabitTracker';
import PersonalityRadar from '../components/dashboard/PersonalityRadar';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';
import LevelUpModal from '../components/dashboard/LevelUpModal';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile, dailyMissions, isLoading, levelUp, rankUp } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState('overview');

  // Sample personality stats from user profile
  const personalityStats = profile?.personalityStats || {
    discipline: 65,
    focus: 70,
    confidence: 55,
    consistency: 60,
    communication: 75,
    resilience: 50,
    creativity: 80,
    leadership: 45,
    emotionalIntelligence: 70,
  };

  const handleStatClick = (statKey, value) => {
    console.log(`Stat clicked: ${statKey} - ${value}%`);
    // Navigate to stat details or show modal
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchDailyMissions());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profile?.avatar || '/default-avatar.png'}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-purple-500"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {profile?.displayName || 'Player'}
              </h1>
              <div className="flex items-center space-x-2 text-gray-400">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-yellow-400">Rank {profile?.rank || 'E'}</span>
                <span>• Level {profile?.level || 1}</span>
                <span>• {profile?.careerPath || 'General'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Coach</span>
            </button>
          </div>
        </div>

        {/* Level Progress */}
        <LevelProgress
          currentXP={profile?.xp || 0}
          maxXP={profile?.nextLevelXP || 1000}
          level={profile?.level || 1}
        />

        {/* Stats Grid */}
        <div className="space-y-6">
          {/* Basic Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={Zap}
              label="Total XP"
              value={profile?.totalXp || 1250}
              trend="up"
              trendValue="+12%"
              color="primary"
              tooltip="Total experience points earned"
            />

            <StatsCard
              icon={Flame}
              label="Streak"
              value={`${profile?.streak || 0} days`}
              trend="up"
              trendValue="+2"
              color="warning"
              progress={80}
              lastUpdated={new Date()}
            />

            <StatsCard
              icon={Target}
              label="Missions"
              value={`${profile?.missionsComplete || 0}/30`}
              subtitle="80% Complete"
              color="success"
              badges={[
                { label: 'Daily', color: 'info' },
                { label: 'Weekly', color: 'primary' },
              ]}
            />

            <StatsCard
              icon={Activity}
              label="Habits"
              value={profile?.habits?.length || 0}
              subtitle="Active Habits"
              stats={[
                { label: 'Completed', value: '8' },
                { label: 'Streak', value: '5 days' },
              ]}
            />
          </div>

          {/* Specialized Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <XPStatsCard
              xp={profile?.xp || 850}
              level={profile?.level || 12}
              rank={profile?.rank || 'B'}
              onClick={() => console.log('XP card clicked')}
            />

            <StreakStatsCard
              streak={profile?.streak || 14}
              bestStreak={profile?.bestStreak || 21}
              color="warning"
            />

            <MissionsStatsCard
              completed={profile?.missionsComplete || 18}
              total={30}
              color="info"
            />

            <HabitsStatsCard
              active={profile?.habits?.filter(h => h.isActive).length || 8}
              completed={profile?.habits?.filter(h => h.completedToday).length || 6}
              streak={profile?.streak || 14}
              color="success"
            />

            <AchievementsStatsCard
              unlocked={profile?.achievements?.length || 15}
              total={50}
              color="purple"
            />

            <HealthStatsCard
              score={profile?.healthScore || 85}
              steps={8742}
              calories={2150}
              color="danger"
            />
          </div>

          {/* Large Stats Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <StatsCard
              icon={Users}
              label="Community Growth"
              value="1,234"
              subtitle="Active Members"
              trend="up"
              trendValue="+18%"
              size="large"
              color="info"
              badges={[
                { label: '📈 Growing', color: 'success' },
                { label: '👥 Active', color: 'primary' },
              ]}
              stats={[
                { label: 'New This Week', value: '89' },
                { label: 'Engagement', value: '72%' },
              ]}
              onRefresh={() => console.log('Refreshing...')}
            />

            <StatsCard
              icon={Brain}
              label="AI Insights"
              value="24/7"
              subtitle="Active Learning"
              progress={65}
              color="purple"
              size="large"
              variant="gradient"
              tooltip="AI-powered learning suggestions"
              badges={[
                { label: '🤖 AI Powered', color: 'purple' },
                { label: '✨ Smart', color: 'info' },
              ]}
              stats={[
                { label: 'Suggestions', value: '12' },
                { label: 'Completion', value: '65%' },
              ]}
            >
              <div className="mt-3 p-2 bg-white/5 rounded-lg">
                <p className="text-xs text-gray-400">Latest Insight</p>
                <p className="text-sm text-white">Complete 3 more missions to level up!</p>
              </div>
            </StatsCard>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Missions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Missions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span>Daily Missions</span>
                </h2>
                <button className="text-sm text-purple-400 hover:text-purple-300">
                  View All →
                </button>
              </div>
              <div className="space-y-4">
                {dailyMissions?.length > 0 ? (
                  dailyMissions.map(mission => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                    <p>No missions available today</p>
                    <p className="text-sm">Check back later for new challenges!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Personality Radar */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>Personality Stats</span>
              </h2>
              <PersonalityRadar
                stats={personalityStats}
                onStatClick={handleStatClick}
                className="col-span-1"
              />
            </div>

            {/* Habit Tracker */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span>Habits</span>
              </h2>
              <HabitTracker habits={profile?.habits || []} />
            </div>

            {/* Quick Actions */}
            <QuickActions />
            {/* Quick Links to New Features */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Quick Access</span>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/achievements')}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-center group"
                >
                  <Award className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-300 group-hover:text-white">Achievements</span>
                </button>
                <button
                  onClick={() => navigate('/analytics')}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-center group"
                >
                  <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-300 group-hover:text-white">Analytics</span>
                </button>
                <button
                  onClick={() => navigate('/challenges')}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-center group"
                >
                  <Gamepad2 className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-300 group-hover:text-white">Challenges</span>
                </button>
                <button
                  onClick={() => navigate('/community')}
                  className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-center group"
                >
                  <UsersIcon className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-300 group-hover:text-white">Community</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      <AnimatePresence>
        {levelUp && (
          <LevelUpModal
            data={levelUp}
            onClose={() => {
              // Optional: handle close
            }}
          />
        )}

        {rankUp && (
          <LevelUpModal
            data={rankUp}
            onClose={() => {
              // Optional: handle close
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full"></div>
        <div className="flex-1">
          <div className="h-8 bg-gray-800 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-64"></div>
        </div>
      </div>
      <div className="h-24 bg-gray-800 rounded-lg mb-8"></div>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-96 bg-gray-800 rounded-lg"></div>
        <div className="h-96 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default Dashboard;