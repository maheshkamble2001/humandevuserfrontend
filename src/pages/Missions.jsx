// src/pages/Missions.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Award,
  Filter,
  Plus,
  Search,
  Zap,
  Flame,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react';
import { fetchDailyMissions, completeMission } from '../store/slices/userSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Missions = () => {
  const dispatch = useDispatch();
  const { dailyMissions, isLoading } = useSelector(state => state.user);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    dispatch(fetchDailyMissions());
  }, [dispatch]);

  const handleComplete = async (missionId) => {
    try {
      await dispatch(completeMission(missionId));
      toast.success('Mission completed! 🎉');
    } catch (error) {
      toast.error('Failed to complete mission');
    }
  };

  const filteredMissions = dailyMissions?.filter(mission => {
    const matchesFilter = filter === 'all' || mission.type === filter;
    const matchesSearch = mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mission.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-400 border-green-400',
      medium: 'text-yellow-400 border-yellow-400',
      hard: 'text-orange-400 border-orange-400',
      legendary: 'text-red-400 border-red-400'
    };
    return colors[difficulty] || 'text-gray-400';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'active') return <Circle className="w-5 h-5 text-blue-400" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Missions</h1>
          <p className="text-gray-400">Complete missions to earn XP and level up</p>
        </div>
        <Button variant="gradient" icon={Plus}>
          New Mission
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Active Missions</p>
              <p className="text-lg font-bold text-white">
                {dailyMissions?.filter(m => m.status === 'active').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Completed Today</p>
              <p className="text-lg font-bold text-white">
                {dailyMissions?.filter(m => m.status === 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total XP Earned</p>
              <p className="text-lg font-bold text-white">
                {dailyMissions?.reduce((sum, m) => sum + (m.xpEarned || 0), 0) || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Current Streak</p>
              <p className="text-lg font-bold text-white">12 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search missions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'daily', 'weekly', 'boss'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition
                  ${filter === type 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white/5 text-gray-400 hover:text-white'
                  }
                `}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredMissions?.length === 0 ? (
            <div className="glass-effect rounded-xl p-12 text-center border border-white/20">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">No missions found</h3>
              <p className="text-gray-400">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            filteredMissions?.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`mission-card border ${
                  mission.status === 'completed' 
                    ? 'border-green-500/30' 
                    : getDifficultyColor(mission.difficulty)
                }`}
                onClick={() => setSelectedMission(mission)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getStatusIcon(mission.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{mission.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-gray-400">
                        {mission.type}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(mission.difficulty)} bg-opacity-10`}>
                        {mission.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{mission.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4" />
                        <span>{mission.xpReward} XP</span>
                      </div>
                      {mission.timeEstimate && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{mission.timeEstimate}</span>
                        </div>
                      )}
                      {mission.deadline && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(mission.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            mission.status === 'completed' 
                              ? 'bg-green-400' 
                              : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                          }`}
                          style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">
                          {mission.progress} / {mission.maxProgress}
                        </span>
                        <span className="text-xs text-gray-400">
                          {Math.round((mission.progress / mission.maxProgress) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {mission.status === 'active' && (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(mission.id);
                        }}
                      >
                        Complete
                      </Button>
                    )}
                    {mission.status === 'completed' && (
                      <span className="text-xs text-green-400">✓ Completed</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Mission Detail Modal */}
      <AnimatePresence>
        {selectedMission && (
          <MissionDetailModal
            mission={selectedMission}
            onClose={() => setSelectedMission(null)}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const MissionDetailModal = ({ mission, onClose, onComplete }) => (
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
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{mission.name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(mission.difficulty)} bg-opacity-10`}>
                {mission.difficulty}
              </span>
            </div>
            <p className="text-gray-400 mt-1">{mission.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">Reward</p>
              <p className="text-lg font-bold text-yellow-400">{mission.xpReward} XP</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-400">Type</p>
              <p className="text-lg font-bold text-white capitalize">{mission.type}</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Requirements</h4>
            <ul className="space-y-2">
              {mission.requirements?.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
              {!mission.requirements && (
                <li className="text-sm text-gray-400">No specific requirements</li>
              )}
            </ul>
          </div>

          <div className="flex gap-3">
            {mission.status === 'active' && (
              <Button
                variant="gradient"
                icon={CheckCircle}
                className="flex-1"
                onClick={() => {
                  onComplete(mission.id);
                  onClose();
                }}
              >
                Complete Mission
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 w-48 bg-white/5 rounded"></div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-20 bg-white/5 rounded-xl"></div>
      ))}
    </div>
    <div className="h-16 bg-white/5 rounded-xl"></div>
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
    ))}
  </div>
);

export default Missions;