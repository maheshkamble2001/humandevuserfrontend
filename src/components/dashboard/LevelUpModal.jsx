// src/components/dashboard/LevelUpModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
  Star,
  Sparkles,
  Zap,
  Award,
  TrendingUp,
  Crown,
  Gem,
  Gift,
  ChevronRight,
  X,
  Check,
  Lock,
  Unlock,
  ArrowUp,
  Heart,
  Brain,
  Target,
  Flame,
  Users,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Camera,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  CheckCircle,
  PartyPopper,
  Rocket,
  Medal,
  Trophy,
  Star as StarIcon,
  Sparkle,
} from 'lucide-react';
import { clearNotifications } from '../../store/slices/userSlice';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';

const LevelUpModal = ({ data, onClose }) => {
  const dispatch = useDispatch();
  const [showRewards, setShowRewards] = useState(false);
  const [showUnlocks, setShowUnlocks] = useState(false);
  const [copied, setCopied] = useState(false);
  const [celebrationComplete, setCelebrationComplete] = useState(false);

  const {
    newLevel,
    oldLevel,
    newRank,
    oldRank,
    xpGained,
    rewards = [],
    unlocks = [],
    stats = {},
    message = '',
  } = data || {};

  // Trigger celebration effects
  useEffect(() => {
    if (data) {
      triggerCelebration();
      // Auto-show rewards after celebration
      setTimeout(() => setShowRewards(true), 1000);
      // Auto-show unlocks after rewards
      setTimeout(() => setShowUnlocks(true), 2000);
      // Mark as complete
      setTimeout(() => setCelebrationComplete(true), 3000);
    }
  }, [data]);

  const triggerCelebration = () => {
    // Confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Fire multiple confetti bursts
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#7d26ff', '#ff0064', '#ffd700', '#00ff88', '#00ccff'],
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#7d26ff', '#ff0064', '#ffd700', '#00ff88', '#00ccff'],
      });
    }, 250);

    // Emoji rain
    const emojis = ['🎉', '🌟', '⭐', '✨', '🎊', '💫', '🎈', '🎁', '🏆', '👑'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
      const emoji = document.createElement('div');
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.position = 'absolute';
      emoji.style.fontSize = `${Math.random() * 20 + 20}px`;
      emoji.style.left = `${Math.random() * 100}%`;
      emoji.style.top = `-${Math.random() * 20}%`;
      emoji.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
      emoji.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(emoji);
    }

    // Clean up after animation
    setTimeout(() => {
      container.remove();
    }, 5000);
  };

  const handleShare = async (platform) => {
    const shareText = `🎉 I just reached Level ${newLevel} ${newRank ? `(Rank ${newRank})` : ''} in Life RPG! Join me on this journey to level up your life! 🚀`;
    const url = window.location.href;

    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offscreen/?url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${shareText} ${url}`);
          setCopied(true);
          toast.success('Copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: 'Level Up!',
              text: shareText,
              url: url,
            });
          }
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleClose = () => {
    dispatch(clearNotifications());
    if (onClose) onClose();
  };

  const getRankIcon = (rank) => {
    const icons = {
      'E': Star,
      'D': Star,
      'C': Star,
      'B': Gem,
      'A': Crown,
      'S': Trophy,
      'SS': Medal,
      'Mythic': PartyPopper,
    };
    return icons[rank] || Star;
  };

  const getRankColor = (rank) => {
    const colors = {
      'E': 'text-gray-400',
      'D': 'text-blue-400',
      'C': 'text-green-400',
      'B': 'text-yellow-400',
      'A': 'text-orange-400',
      'S': 'text-red-400',
      'SS': 'text-purple-400',
      'Mythic': 'text-pink-400',
    };
    return colors[rank] || 'text-gray-400';
  };

  const getRankBgColor = (rank) => {
    const colors = {
      'E': 'bg-gray-400/20',
      'D': 'bg-blue-400/20',
      'C': 'bg-green-400/20',
      'B': 'bg-yellow-400/20',
      'A': 'bg-orange-400/20',
      'S': 'bg-red-400/20',
      'SS': 'bg-purple-400/20',
      'Mythic': 'bg-pink-400/20',
    };
    return colors[rank] || 'bg-gray-400/20';
  };

  const getStatIcon = (stat) => {
    const icons = {
      discipline: Target,
      focus: Brain,
      confidence: Heart,
      consistency: Flame,
      communication: Users,
      resilience: Shield,
      creativity: Palette,
      leadership: Crown,
      emotionalIntelligence: Heart,
    };
    return icons[stat] || Star;
  };

  const getStatLabel = (stat) => {
    return stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  if (!data) return null;

  const RankIcon = newRank ? getRankIcon(newRank) : null;
  const isRankUp = newRank && newRank !== oldRank;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateZ: -10 }}
          animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateZ: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Glow */}
          <div className="absolute -inset-20 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 blur-3xl rounded-full" />

          <div className="relative glass-effect rounded-2xl border border-white/20 overflow-hidden">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 p-8 text-center">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-4 mb-2">
                  {isRankUp && RankIcon && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className={`w-16 h-16 rounded-full ${getRankBgColor(newRank)} flex items-center justify-center`}
                    >
                      <RankIcon className={`w-8 h-8 ${getRankColor(newRank)}`} />
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <PartyPopper className="w-12 h-12 text-yellow-400" />
                  </motion.div>
                </div>

                <motion.h2
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-4xl font-bold text-white"
                >
                  {isRankUp ? '🌟 Rank Up!' : '🎉 Level Up!'}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/90 text-lg mt-2"
                >
                  {message || `You've reached Level ${newLevel}!`}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-4 mt-3"
                >
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="text-sm">Previous:</span>
                    <span className="font-bold">Level {oldLevel}</span>
                    {oldRank && (
                      <>
                        <span className="text-white/40">→</span>
                        <span className={`font-bold ${getRankColor(oldRank)}`}>
                          Rank {oldRank}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-sm">New:</span>
                    <span className="font-bold text-2xl text-yellow-400">
                      Level {newLevel}
                    </span>
                    {isRankUp && (
                      <span className={`font-bold text-2xl ${getRankColor(newRank)}`}>
                        Rank {newRank}
                      </span>
                    )}
                  </div>
                </motion.div>

                {xpGained && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full"
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">+{xpGained} XP</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Stats Improvements */}
              {stats && Object.keys(stats).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-400" />
                    Stats Improved
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(stats).map(([stat, value], index) => {
                      const StatIcon = getStatIcon(stat);
                      return (
                        <motion.div
                          key={stat}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + index * 0.1 }}
                          className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                        >
                          <StatIcon className="w-4 h-4 text-primary-400" />
                          <span className="text-xs text-gray-300 flex-1">
                            {getStatLabel(stat)}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">{value.old}%</span>
                            <ArrowUp className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">{value.new}%</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Rewards */}
              {rewards && rewards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: showRewards ? 1 : 0, y: showRewards ? 0 : 20 }}
                  transition={{ delay: 1.6 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Gift className="w-4 h-4 text-secondary-400" />
                    Rewards Unlocked
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {rewards.map((reward, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8 + index * 0.1 }}
                        className="flex items-center gap-2 p-2 bg-secondary-500/10 rounded-lg border border-secondary-500/20"
                      >
                        <div className="w-8 h-8 rounded-full bg-secondary-500/20 flex items-center justify-center flex-shrink-0">
                          <Gift className="w-4 h-4 text-secondary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {reward.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {reward.description}
                          </p>
                        </div>
                        <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Unlocks */}
              {unlocks && unlocks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: showUnlocks ? 1 : 0, y: showUnlocks ? 0 : 20 }}
                  transition={{ delay: 2 }}
                  className="space-y-3"
                >
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-green-400" />
                    New Features Unlocked
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {unlocks.map((unlock, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.2 + index * 0.1 }}
                        className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {unlock.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {unlock.description}
                          </p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: celebrationComplete ? 1 : 0, y: celebrationComplete ? 0 : 20 }}
                transition={{ delay: 2.4 }}
                className="pt-4 border-t border-white/10"
              >
                <p className="text-xs text-gray-400 text-center mb-3">
                  Share your achievement!
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                    aria-label="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: celebrationComplete ? 1 : 0, y: celebrationComplete ? 0 : 20 }}
                transition={{ delay: 2.6 }}
                className="flex gap-3 pt-2"
              >
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Continue Your Journey
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    handleClose();
                    // Navigate to profile or rewards
                    window.location.href = '/profile';
                  }}
                >
                  View Profile
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </AnimatePresence>
  );
};

export default LevelUpModal;