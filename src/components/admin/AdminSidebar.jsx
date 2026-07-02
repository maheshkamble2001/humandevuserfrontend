// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Target,
  Activity,
  Award,
  Gamepad2,
  BarChart3,
  Settings,
  FileText,
  Shield,
  Bell,
  Mail,
  TrendingUp,
  Crown,
  Star,
  Zap,
  Gift,
  Calendar,
  MessageCircle,
  Database,
  Cloud,
  Server,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      section: 'Main',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Target, label: 'Missions', path: '/admin/missions' },
        { icon: Activity, label: 'Habits', path: '/admin/habits' },
        { icon: Award, label: 'Achievements', path: '/admin/achievements' },
        { icon: Gamepad2, label: 'Challenges', path: '/admin/challenges' },
      ]
    },
    {
      section: 'Analytics',
      items: [
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: TrendingUp, label: 'Reports', path: '/admin/reports' },
        { icon: Users, label: 'User Activity', path: '/admin/activity' },
      ]
    },
    {
      section: 'Content',
      items: [
        { icon: Crown, label: 'Badges', path: '/admin/badges' },
        { icon: Star, label: 'Titles', path: '/admin/titles' },
        { icon: Gift, label: 'Rewards', path: '/admin/rewards' },
        { icon: Calendar, label: 'Events', path: '/admin/events' },
        { icon: MessageCircle, label: 'Announcements', path: '/admin/announcements' },
      ]
    },
    {
      section: 'System',
      items: [
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
        { icon: FileText, label: 'Logs', path: '/admin/logs' },
        { icon: Shield, label: 'Security', path: '/admin/security' },
        { icon: Database, label: 'Backup', path: '/admin/backup' },
        { icon: Cloud, label: 'Integrations', path: '/admin/integrations' },
        { icon: Server, label: 'System Status', path: '/admin/status' },
      ]
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-dark-800/95 backdrop-blur-lg border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold gradient-text">Admin Panel</h2>
                <p className="text-xs text-gray-400">Life RPG Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            {menuItems.map((section, idx) => (
              <div key={idx} className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.section}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                          ${isActive
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg p-3 border border-primary-500/20">
              <p className="text-xs text-gray-400">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-400">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;