// frontend/src/components/DailyReward.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Zap, Check, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from './common/Button';
import { toast } from 'react-toastify';

const DailyReward = () => {
  const { user } = useAuth();
  const [reward, setReward] = useState(null);
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchDailyReward();
  }, []);

  const fetchDailyReward = async () => {
    try {
      const response = await fetch('/api/gamification/daily-reward', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setReward(data);
      setClaimed(data.claimed || false);
    } catch (error) {
      console.error('Error fetching daily reward:', error);
    }
  };

  const handleClaim = async () => {
    if (claimed) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/gamification/daily-reward', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.claimed) {
        setClaimed(true);
        setReward(data);
        toast.success(`🎉 ${data.message}`);
        // Update user XP
        if (user) {
          user.xp += data.reward;
        }
      }
    } catch (error) {
      toast.error('Failed to claim reward');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="w-6 h-6 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Daily Reward</h3>
      </div>

      <div className="text-center">
        {claimed ? (
          <div className="space-y-3">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-medium">Reward Claimed!</p>
              <p className="text-sm text-gray-400">+{reward?.reward || 0} XP</p>
            </div>
            <p className="text-xs text-gray-400">
              Next reward available in 24 hours
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              {reward?.streak > 0 && (
                <div className="absolute -top-1 -right-1 px-2 py-1 bg-yellow-500 rounded-full text-xs font-bold text-white">
                  {reward.streak}🔥
                </div>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold text-white">+{reward?.reward || 50} XP</p>
              <p className="text-sm text-gray-400">Claim your daily reward</p>
            </div>

            <Button
              variant="gradient"
              className="w-full"
              onClick={handleClaim}
              loading={loading}
              icon={Gift}
            >
              Claim Reward
            </Button>

            {reward?.streak > 0 && (
              <p className="text-xs text-gray-400">
                🔥 {reward.streak} day streak!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReward;