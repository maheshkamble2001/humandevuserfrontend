// src/components/AIPreferences.jsx
import React, { useState } from 'react';
import { useAI } from '../hooks/useAI';
import { motion } from 'framer-motion';
import {
  Brain,
  Settings,
  MessageSquare,
  Sparkles,
  Zap,
  Heart,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import Button from './common/Button';

const AIPreferences = () => {
  const {
    preferences,
    settings,
    updatePreference,
    updateSetting,
    metrics,
    getAdvice,
    generateMissions,
  } = useAI();

  const [showPreferences, setShowPreferences] = useState(false);

  const toneOptions = [
    { value: 'motivational', label: '🔥 Motivational', icon: Sparkles },
    { value: 'supportive', label: '🤗 Supportive', icon: Heart },
    { value: 'strict', label: '💪 Strict', icon: Zap },
    { value: 'casual', label: '😊 Casual', icon: MessageSquare },
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const focusAreas = [
    { id: 'career', label: 'Career', icon: Target },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'productivity', label: 'Productivity', icon: TrendingUp },
    { id: 'mindset', label: 'Mindset', icon: Brain },
  ];

  return (
    <div className="glass-effect rounded-xl p-4 border border-white/20">
      <button
        onClick={() => setShowPreferences(!showPreferences)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-white">AI Preferences</span>
          <span className="text-xs text-gray-400">
            ({preferences.tone} • {preferences.frequency})
          </span>
        </div>
        {showPreferences ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {showPreferences && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-4"
        >
          {/* Tone Preference */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Communication Tone</label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updatePreference({ tone: option.value })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    preferences.tone === option.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <option.icon className="w-3 h-3" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Preference */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Advice Frequency</label>
            <div className="flex flex-wrap gap-2">
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updatePreference({ frequency: option.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs transition ${
                    preferences.frequency === option.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Focus Areas</label>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => {
                    const newAreas = preferences.focusAreas.includes(area.id)
                      ? preferences.focusAreas.filter(a => a !== area.id)
                      : [...preferences.focusAreas, area.id];
                    updatePreference({ focusAreas: newAreas });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
                    preferences.focusAreas.includes(area.id)
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <area.icon className="w-3 h-3" />
                  <span>{area.label}</span>
                  {preferences.focusAreas.includes(area.id) && (
                    <Check className="w-3 h-3 ml-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Daily Advice</p>
                <p className="text-xs text-gray-400">Get daily AI advice automatically</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dailyAdviceEnabled}
                  onChange={() => updateSetting({ dailyAdviceEnabled: !settings.dailyAdviceEnabled })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-sm text-white">Auto-Generate Missions</p>
                <p className="text-xs text-gray-400">AI suggests missions automatically</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoGenerateMissions}
                  onChange={() => updateSetting({ autoGenerateMissions: !settings.autoGenerateMissions })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="small"
              variant="outline"
              icon={Sparkles}
              onClick={getAdvice}
              className="flex-1"
            >
              Get Daily Advice
            </Button>
            <Button
              size="small"
              variant="outline"
              icon={Target}
              onClick={() => generateMissions()}
              className="flex-1"
            >
              Generate Missions
            </Button>
          </div>

          {/* Metrics */}
          <div className="pt-2 border-t border-white/10">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <p className="text-xs text-gray-400">Interactions</p>
                <p className="text-sm font-bold text-white">{metrics.totalInteractions}</p>
              </div>
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <p className="text-xs text-gray-400">Response Time</p>
                <p className="text-sm font-bold text-white">{metrics.averageResponseTime}s</p>
              </div>
              <div className="text-center p-2 bg-white/5 rounded-lg">
                <p className="text-xs text-gray-400">Satisfaction</p>
                <p className="text-sm font-bold text-green-400">{metrics.satisfactionRate}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIPreferences;