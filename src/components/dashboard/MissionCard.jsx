// src/components/dashboard/MissionCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Star, 
  TrendingUp,
  Flame,
  Zap
} from 'lucide-react';
import { completeMission } from '../../store/slices/userSlice';

const MissionCard = ({ mission }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  const progressPercentage = (mission.progress / mission.maxProgress) * 100;

  const difficultyColors = {
    easy: 'text-green-400 border-green-400',
    medium: 'text-yellow-400 border-yellow-400',
    hard: 'text-orange-400 border-orange-400',
    legendary: 'text-red-400 border-red-400'
  };

  const difficultyIcons = {
    easy: '★',
    medium: '★★',
    hard: '★★★',
    legendary: '★★★★'
  };

  const handleComplete = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await dispatch(completeMission(mission.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 rounded-lg border ${difficultyColors[mission.difficulty]} p-4 hover:bg-white/10 transition cursor-pointer`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {mission.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : mission.status === 'active' ? (
                <Circle className="w-5 h-5 text-blue-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-400">
                {difficultyIcons[mission.difficulty]}
              </span>
            </div>
            <h3 className="font-medium text-white">{mission.name}</h3>
          </div>
          <p className="text-sm text-gray-400 mt-1">{mission.description}</p>
          
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="w-4 h-4" />
              <span className="text-sm">{mission.xpReward} XP</span>
            </div>
            {mission.type === 'daily' && (
              <div className="flex items-center space-x-1 text-blue-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Daily</span>
              </div>
            )}
            {mission.streak && (
              <div className="flex items-center space-x-1 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="text-sm">{mission.streak} day streak</span>
              </div>
            )}
            {mission.timeEstimate && (
              <div className="flex items-center space-x-1 text-purple-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm">{mission.timeEstimate}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-sm text-gray-400">
            {mission.progress}/{mission.maxProgress}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-2 rounded-full bg-gradient-to-r ${
              mission.difficulty === 'easy' ? 'from-green-400 to-green-500' :
              mission.difficulty === 'medium' ? 'from-yellow-400 to-yellow-500' :
              mission.difficulty === 'hard' ? 'from-orange-400 to-orange-500' :
              'from-red-400 to-red-500'
            }`}
          />
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Requirements:</p>
              <ul className="text-sm text-gray-300 list-disc list-inside">
                {mission.requirements?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
                {!mission.requirements && (
                  <li>Complete all subtasks</li>
                )}
              </ul>
            </div>
            {mission.status !== 'completed' && (
              <button 
                onClick={handleComplete}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Completing...' : 'Complete Mission'}
              </button>
            )}
            {mission.status === 'completed' && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Completed!</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MissionCard;