// frontend/src/components/teams/TeamCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Zap, Crown, Shield, Heart } from 'lucide-react';
import Button from '../common/Button';

const TeamCard = ({ team, onJoin, onView }) => {
  const getRankColor = (rank) => {
    const colors = {
      'S': 'text-yellow-400 border-yellow-400',
      'A': 'text-purple-400 border-purple-400',
      'B': 'text-blue-400 border-blue-400',
      'C': 'text-green-400 border-green-400',
    };
    return colors[rank] || 'text-gray-400';
  };

  const getRankIcon = (rank) => {
    const icons = {
      'S': Crown,
      'A': Shield,
      'B': Heart,
      'C': Users,
    };
    return icons[rank] || Users;
  };

  const RankIcon = getRankIcon(team.rank);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-effect rounded-xl p-4 border border-white/20 hover:border-primary-500/30 transition"
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0`}>
          <span className="text-2xl font-bold text-white">
            {team.name?.[0] || 'T'}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{team.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getRankColor(team.rank)}`}>
              {team.rank || 'C'}
            </span>
          </div>
          
          <p className="text-sm text-gray-400 line-clamp-2">{team.description}</p>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              <span>{team.members || 0}/{team.maxMembers || 10}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>{team.xp || 0} XP</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Trophy className="w-3 h-3 text-primary-400" />
              <span>Level {team.level || 1}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          variant="gradient"
          size="small"
          className="flex-1"
          onClick={() => onJoin?.(team.id)}
        >
          Join Team
        </Button>
        <Button
          variant="outline"
          size="small"
          className="flex-1"
          onClick={() => onView?.(team.id)}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default TeamCard;