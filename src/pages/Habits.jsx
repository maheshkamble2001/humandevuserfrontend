// src/pages/Habits.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Plus,
  Flame,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  BarChart3,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { completeHabit } from '../store/slices/userSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Habits = () => {
  const dispatch = useDispatch();
  const { habits, isLoading } = useSelector(state => state.user);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch habits
  }, [dispatch]);

  const handleComplete = async (habitId) => {
    try {
      await dispatch(completeHabit(habitId));
      toast.success('Habit completed! 🔥');
    } catch (error) {
      toast.error('Failed to complete habit');
    }
  };

  const filteredHabits = habits?.filter(habit => {
    if (filter === 'all') return true;
    if (filter === 'active') return habit.isActive;
    if (filter === 'archived') return !habit.isActive;
    return true;
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Habits</h1>
          <p className="text-gray-400">Build and track your daily habits</p>
        </div>
        <Button variant="gradient" icon={Plus} onClick={() => setShowAddHabit(true)}>
          New Habit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Completed Today</p>
              <p className="text-lg font-bold text-white">5</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Longest Streak</p>
              <p className="text-lg font-bold text-white">14 days</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Active Habits</p>
              <p className="text-lg font-bold text-white">
                {habits?.filter(h => h.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Completions</p>
              <p className="text-lg font-bold text-white">
                {habits?.reduce((sum, h) => sum + h.totalCompletions, 0) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex gap-2">
          {['all', 'active', 'archived'].map((type) => (
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

      {/* Habit List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredHabits?.length === 0 ? (
            <div className="col-span-2 glass-effect rounded-xl p-12 text-center border border-white/20">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">No habits yet</h3>
              <p className="text-gray-400">Start building your first habit today!</p>
            </div>
          ) : (
            filteredHabits?.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-effect rounded-xl p-4 border ${
                  habit.isActive ? 'border-white/20' : 'border-white/10 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleComplete(habit.id)}
                      className="mt-1 transition hover:scale-110"
                    >
                      {habit.completedToday ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-green-400" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-semibold text-white">{habit.name}</h3>
                      <p className="text-sm text-gray-400">{habit.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{habit.duration || 15} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{habit.frequency}</span>
                        </div>
                        {habit.streak > 0 && (
                          <div className="flex items-center gap-1 text-xs text-orange-400">
                            <Flame className="w-3 h-3" />
                            <span>{habit.streak} day streak</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedHabit(habit)}
                      className="p-1 hover:bg-white/10 rounded-lg transition"
                    >
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => {/* Edit habit */}}
                      className="p-1 hover:bg-white/10 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => {/* Delete habit */}}
                      className="p-1 hover:bg-white/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                {habit.completionRate !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Completion Rate</span>
                      <span>{Math.round(habit.completionRate)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${habit.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddHabit && (
          <AddHabitModal onClose={() => setShowAddHabit(false)} />
        )}
      </AnimatePresence>

      {/* Habit Details Modal */}
      <AnimatePresence>
        {selectedHabit && (
          <HabitDetailsModal
            habit={selectedHabit}
            onClose={() => setSelectedHabit(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const AddHabitModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    duration: 15,
    category: 'general'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to create habit
      toast.success('Habit created successfully! 🎯');
      onClose();
    } catch (error) {
      toast.error('Failed to create habit');
    }
  };

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
          <h2 className="text-2xl font-bold text-white mb-4">Create New Habit</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Habit Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <Input
              label="Duration (minutes)"
              type="number"
              name="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="gradient" className="flex-1">
                Create Habit
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const HabitDetailsModal = ({ habit, onClose }) => (
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
            <h2 className="text-2xl font-bold text-white">{habit.name}</h2>
            <p className="text-gray-400 mt-1">{habit.description}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Streak</p>
            <p className="text-lg font-bold text-orange-400">{habit.streak} days</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Best Streak</p>
            <p className="text-lg font-bold text-primary-400">{habit.bestStreak} days</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Total Completions</p>
            <p className="text-lg font-bold text-white">{habit.totalCompletions}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Completion Rate</p>
            <p className="text-lg font-bold text-green-400">{Math.round(habit.completionRate)}%</p>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-2">Activity Log</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {habit.logs?.slice(0, 10).map((log, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">
                  {new Date(log.completedAt).toLocaleDateString()}
                </span>
                <span className="text-green-400">✓ Completed</span>
              </div>
            ))}
            {(!habit.logs || habit.logs.length === 0) && (
              <p className="text-sm text-gray-400">No activity yet</p>
            )}
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
    <div className="h-12 bg-white/5 rounded-xl"></div>
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
      ))}
    </div>
  </div>
);

export default Habits;