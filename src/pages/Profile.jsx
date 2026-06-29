// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  Star,
  TrendingUp,
  Settings,
  Camera,
  Edit2,
  Save,
  X,
  Shield,
  Zap,
  Heart,
  Brain,
  Target,
  Clock,
  BarChart3,
  Users,
  Sparkles
} from 'lucide-react';
import { fetchUserProfile } from '../store/slices/userSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        country: profile.country || '',
        timezone: profile.timezone || '',
        careerPath: profile.careerPath || '',
        birthDate: profile.birthDate || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // API call to update profile
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const stats = [
    { icon: Zap, label: 'Total XP', value: profile?.totalXp?.toLocaleString() || '0', color: 'text-yellow-400' },
    { icon: Target, label: 'Missions Completed', value: profile?.missionsComplete || 0, color: 'text-blue-400' },
    { icon: Heart, label: 'Health Score', value: `${profile?.healthScore || 0}%`, color: 'text-red-400' },
    { icon: Users, label: 'Community Rank', value: `#${profile?.communityRank || 0}`, color: 'text-purple-400' },
  ];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Profile</h1>
          <p className="text-gray-400">Manage your account and progression</p>
        </div>
        <Button
          variant={isEditing ? 'primary' : 'outline'}
          icon={isEditing ? Save : Edit2}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Card */}
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {profile?.displayName?.[0] || 'U'}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-primary-500 rounded-full hover:bg-primary-600 transition">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? (
                  <Input
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="max-w-xs"
                  />
                ) : (
                  profile?.displayName || 'Player'
                )}
              </h2>
              <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                Rank {profile?.rank || 'E'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{profile?.email || 'player@email.com'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{profile?.careerPath || 'General'}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{profile?.country || 'Earth'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(profile?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {isEditing ? (
          <div className="mt-4">
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              className="w-full bg-white/5 rounded-lg px-4 py-2 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
            />
          </div>
        ) : (
          profile?.bio && (
            <p className="mt-4 text-gray-300">{profile.bio}</p>
          )
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex space-x-6">
          {['overview', 'achievements', 'stats', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 text-sm font-medium transition border-b-2
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
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab profile={profile} />}
        {activeTab === 'achievements' && <AchievementsTab />}
        {activeTab === 'stats' && <StatsTab profile={profile} />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

const OverviewTab = ({ profile }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Personality Stats</h3>
      <div className="space-y-3">
        {Object.entries(profile?.personalityStats || {}).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 capitalize">{key}</span>
              <span className="text-white">{Math.round(value)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-white">Completed mission: "Daily Exercise"</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
            <span className="text-xs text-yellow-400">+25 XP</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AchievementsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[
      { name: 'First Mission', icon: Star, description: 'Complete your first mission', unlocked: true },
      { name: 'Level 10', icon: TrendingUp, description: 'Reach level 10', unlocked: true },
      { name: 'Habit Master', icon: Zap, description: 'Maintain a 30-day streak', unlocked: false },
      { name: 'Social Butterfly', icon: Users, description: 'Connect with 10 friends', unlocked: false },
      { name: 'Career Focus', icon: Briefcase, description: 'Complete 50 career missions', unlocked: false },
      { name: 'Legendary', icon: Award, description: 'Reach rank S', unlocked: false },
    ].map((achievement, index) => (
      <div
        key={index}
        className={`glass-effect rounded-xl p-4 border ${
          achievement.unlocked ? 'border-primary-500/30' : 'border-white/10 opacity-50'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            achievement.unlocked ? 'bg-primary-500/20 text-primary-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            <achievement.icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{achievement.name}</h4>
            <p className="text-xs text-gray-400">{achievement.description}</p>
            {achievement.unlocked && (
              <span className="text-xs text-primary-400">✓ Unlocked</span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const StatsTab = ({ profile }) => (
  <div className="glass-effect rounded-xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold text-white mb-4">Detailed Statistics</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400">Total Missions</p>
        <p className="text-lg font-bold text-white">{profile?.totalMissions || 0}</p>
      </div>
      <div className="p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400">Success Rate</p>
        <p className="text-lg font-bold text-green-400">{profile?.successRate || 0}%</p>
      </div>
      <div className="p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400">Current Streak</p>
        <p className="text-lg font-bold text-orange-400">{profile?.streak || 0} days</p>
      </div>
      <div className="p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400">Total XP Earned</p>
        <p className="text-lg font-bold text-yellow-400">{profile?.totalXp?.toLocaleString() || 0}</p>
      </div>
      <div className="p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400">Habits Formed</p>
        <p className="text-lg font-bold text-purple-400">{profile?.habits?.length || 0}</p>
      </div>
      <div className="p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400">Community Rank</p>
        <p className="text-lg font-bold text-blue-400">#{profile?.communityRank || 0}</p>
      </div>
    </div>
  </div>
);

const SettingsTab = () => (
  <div className="space-y-6">
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Email Notifications</p>
            <p className="text-xs text-gray-400">Receive updates about missions and progress</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Dark Mode</p>
            <p className="text-xs text-gray-400">Toggle dark theme</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
          </label>
        </div>
      </div>
    </div>
    
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
      <div className="space-y-4">
        <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm">
          Delete Account
        </button>
        <p className="text-xs text-gray-400">This action cannot be undone</p>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-48 bg-white/5 rounded"></div>
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-white/5 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 w-48 bg-white/5 rounded"></div>
          <div className="h-4 w-64 bg-white/5 rounded"></div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
      ))}
    </div>
  </div>
);

export default Profile;