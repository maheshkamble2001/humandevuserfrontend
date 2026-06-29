// src/components/dashboard/LevelProgress.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Zap } from 'lucide-react';

const LevelProgress = ({ currentXP, maxXP, level }) => {
  const progress = Math.min((currentXP / maxXP) * 100, 100);
  const xpRemaining = Math.max(maxXP - currentXP, 0);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Award className="w-8 h-8 text-yellow-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Level {level}</h3>
            <p className="text-sm text-gray-400">
              {xpRemaining} XP until next level
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-purple-400">
            <Zap className="w-4 h-4" />
            <span className="text-sm">{currentXP.toLocaleString()} XP</span>
          </div>
          <div className="flex items-center space-x-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+{Math.floor(currentXP * 0.1)} XP/hr</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Level milestones */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-400">Level {level}</span>
        <span className="text-xs text-purple-400">→ Level {level + 1}</span>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-gray-400">Total Missions</p>
          <p className="text-sm font-semibold text-white">24</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Rank Progress</p>
          <p className="text-sm font-semibold text-yellow-400">78%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Streak</p>
          <p className="text-sm font-semibold text-orange-400">🔥 12 days</p>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;