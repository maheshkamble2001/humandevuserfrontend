// src/pages/Challenges.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Target,
  Zap,
  Trophy,
  Clock,
  Calendar,
  Star,
  Award,
  Users,
  Rocket,
  Sparkles,
  Flame,
  Heart,
  Brain,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  CheckCircle,
  X,
  Loader,
  RefreshCw,
  Share2,
  Bookmark,
  Flag,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Search,
  Filter,
  Play,
  Pause,
  Timer,
  BarChart3,
  Activity,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Challenges = () => {
  const { user } = useAuth();
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [challenges, setChallenges] = useState([]);

  // Challenge data
  useEffect(() => {
    setChallenges([
      {
        id: 'daily-trivia',
        name: 'Daily Trivia',
        description: 'Answer 10 trivia questions',
        icon: Brain,
        xpReward: 50,
        difficulty: 'easy',
        category: 'learning',
        participants: 234,
        timeLeft: '2h',
      },
      {
        id: 'speed-mission',
        name: 'Speed Mission',
        description: 'Complete missions under time limit',
        icon: Zap,
        xpReward: 100,
        difficulty: 'medium',
        category: 'missions',
        participants: 156,
        timeLeft: '5h',
      },
      {
        id: 'fitness-challenge',
        name: 'Fitness Challenge',
        description: 'Complete workout streaks',
        icon: Flame,
        xpReward: 75,
        difficulty: 'medium',
        category: 'fitness',
        participants: 89,
        timeLeft: '1d',
      },
      {
        id: 'coding-battle',
        name: 'Coding Battle',
        description: 'Solve programming problems',
        icon: Gamepad2,
        xpReward: 150,
        difficulty: 'hard',
        category: 'career',
        participants: 67,
        timeLeft: '3d',
      },
      {
        id: 'memory-master',
        name: 'Memory Master',
        description: 'Test your memory skills',
        icon: Brain,
        xpReward: 60,
        difficulty: 'easy',
        category: 'learning',
        participants: 198,
        timeLeft: '4h',
      },
      {
        id: 'social-impact',
        name: 'Social Impact',
        description: 'Engage with community',
        icon: Users,
        xpReward: 80,
        difficulty: 'medium',
        category: 'social',
        participants: 123,
        timeLeft: '6h',
      },
    ]);
  }, []);

  const startChallenge = (challenge) => {
    setActiveChallenge(challenge);
    setShowChallengeModal(true);
    setScore(0);
    setTimer(30);
    setIsPlaying(false);
  };

  const playChallenge = () => {
    setIsPlaying(true);
    // Start timer
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPlaying(false);
          toast.success(`Challenge complete! Score: ${score}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate score increase
    const scoreInterval = setInterval(() => {
      if (isPlaying) {
        setScore(prev => prev + Math.floor(Math.random() * 5) + 1);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(scoreInterval);
    };
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-400 border-green-400',
      medium: 'text-yellow-400 border-yellow-400',
      hard: 'text-red-400 border-red-400',
    };
    return colors[difficulty] || 'text-gray-400';
  };

  const getDifficultyBadgeColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      hard: 'bg-red-500/20 text-red-400',
    };
    return colors[difficulty] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Challenges</h1>
          <p className="text-gray-400">Compete, learn, and earn rewards</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {challenges.length} active challenges
          </span>
          <Button variant="gradient" icon={Sparkles}>
            New Challenge
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-effect rounded-xl p-4 border border-white/20 text-center">
          <Target className="w-6 h-6 text-primary-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20 text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-xs text-gray-400">Won</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">8</p>
          <p className="text-xs text-gray-400">Current Streak</p>
        </div>
        <div className="glass-effect rounded-xl p-4 border border-white/20 text-center">
          <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">1,250</p>
          <p className="text-xs text-gray-400">XP Earned</p>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge, index) => {
          const Icon = challenge.icon;
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect rounded-xl p-4 border border-white/20 hover:border-white/30 transition cursor-pointer group"
              onClick={() => startChallenge(challenge)}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyBadgeColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mt-2">{challenge.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{challenge.description}</p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400">{challenge.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {challenge.participants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {challenge.timeLeft}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <Button
                  variant="gradient"
                  size="small"
                  className="w-full"
                  icon={Play}
                  onClick={(e) => {
                    e.stopPropagation();
                    startChallenge(challenge);
                  }}
                >
                  Start Challenge
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Challenge Modal */}
      <AnimatePresence>
        {showChallengeModal && activeChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowChallengeModal(false)}
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
                    <div className="p-2 bg-primary-500/20 rounded-lg">
                      <activeChallenge.icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{activeChallenge.name}</h3>
                      <p className="text-sm text-gray-400">{activeChallenge.description}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowChallengeModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Challenge Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <p className="text-xs text-gray-400">Score</p>
                      <p className="text-2xl font-bold text-white">{score}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="text-2xl font-bold text-white">{timer}s</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{Math.round((score / 100) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((score / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Challenge Actions */}
                  <div className="flex gap-3">
                    {!isPlaying ? (
                      <Button
                        variant="gradient"
                        className="flex-1"
                        icon={Play}
                        onClick={playChallenge}
                      >
                        Start Playing
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1"
                        icon={Pause}
                        onClick={() => setIsPlaying(false)}
                      >
                        Pause
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1" onClick={() => setShowChallengeModal(false)}>
                      Close
                    </Button>
                  </div>

                  {isPlaying && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                      <p className="text-sm text-green-400 animate-pulse">🎮 Playing... Keep going!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Challenges;