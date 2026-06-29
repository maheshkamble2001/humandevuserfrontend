// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Target,
  Activity,
  Briefcase,
  Trophy,
  Settings,
  Users,
  Sparkles,
  Zap,
  Crown,
  BarChart3,
  Gamepad2,
  Award,
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Target, label: 'Missions', path: '/missions' },
    { icon: Activity, label: 'Habits', path: '/habits' },
    { icon: Briefcase, label: 'Career', path: '/career' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Award, label: 'Achievements', path: '/achievements' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Gamepad2, label: 'Challenges', path: '/challenges' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Life RPG</h1>
            <p className="text-xs text-gray-400">Level Up Your Life</p>
          </div>
        </div>
      </div>

      {/* User Level Badge */}
      <div className="p-4 border-b border-white/10">
        <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white">Level 12</span>
            </div>
            <span className="text-xs text-yellow-400">Rank B</span>
          </div>
          <div className="mt-2 w-full bg-dark-700 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full w-[65%]"></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">650 XP / 1,000 XP</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2 rounded-lg transition
              ${isActive 
                ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg p-3 border border-primary-500/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-white">AI Coach</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Get personalized advice</p>
          <button className="mt-2 w-full px-3 py-1.5 bg-primary-500 rounded-lg text-xs text-white hover:bg-primary-600 transition">
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;