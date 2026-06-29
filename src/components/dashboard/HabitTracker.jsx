// src/components/dashboard/HabitTracker.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { CheckCircle, Circle, Flame, Plus, Clock } from 'lucide-react';
import { completeHabit } from '../../store/slices/userSlice';

const HabitTracker = ({ habits = [] }) => {
  const dispatch = useDispatch();
  const [showAddHabit, setShowAddHabit] = useState(false);

  const handleComplete = async (habitId) => {
    try {
      await dispatch(completeHabit(habitId));
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Every day',
      weekly: 'Weekly',
      custom: 'Custom'
    };
    return labels[frequency] || frequency;
  };

  return (
    <div className="space-y-3">
      {habits.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No habits yet. Start building one!</p>
          <button 
            onClick={() => setShowAddHabit(true)}
            className="mt-2 text-purple-400 hover:text-purple-300"
          >
            + Add Habit
          </button>
        </div>
      ) : (
        habits.map((habit) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={() => handleComplete(habit.id)}
                  className={`transition ${
                    habit.completedToday 
                      ? 'text-green-400' 
                      : 'text-gray-500 hover:text-green-400'
                  }`}
                >
                  {habit.completedToday ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div>
                  <p className="text-sm font-medium text-white">{habit.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{getFrequencyLabel(habit.frequency)}</span>
                    {habit.duration && (
                      <>
                        <span>•</span>
                        <span>{habit.duration} min</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {habit.streak > 0 && (
                  <div className="flex items-center space-x-1 text-orange-400">
                    <Flame className="w-3 h-3" />
                    <span className="text-xs font-medium">{habit.streak}</span>
                  </div>
                )}
                <span className="text-xs text-gray-400">
                  {habit.completionRate || 0}%
                </span>
              </div>
            </div>
            
            {/* Progress bar for weekly habits */}
            {habit.frequency === 'weekly' && (
              <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-purple-400 rounded-full h-1"
                  style={{ width: `${habit.weeklyProgress || 0}%` }}
                />
              </div>
            )}
          </motion.div>
        ))
      )}

      {/* Add Habit Modal */}
      {showAddHabit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Habit</h3>
            <form className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Habit Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 rounded-lg px-3 py-2 text-white border border-white/10"
                  placeholder="e.g., Morning Meditation"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Frequency</label>
                <select className="w-full bg-white/5 rounded-lg px-3 py-2 text-white border border-white/10">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Duration (minutes)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 rounded-lg px-3 py-2 text-white border border-white/10"
                  placeholder="15"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-white"
                >
                  Create Habit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddHabit(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HabitTracker;