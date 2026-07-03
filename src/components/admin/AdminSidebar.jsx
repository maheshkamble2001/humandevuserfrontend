// src/components/admin/AdminSidebar.jsx
// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// Main Icons
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
  CalendarDays,
  MessageCircle,
  Database,
  Cloud,
  Server,
  Lock,
  UserCog,
  User,
} from 'lucide-react';

// Small Data Icons
import {
  FolderOpen,
  Diamond,
  Briefcase,
  Globe,
  Clock,
  Palette,
  Languages,
} from 'lucide-react';

// Action Icons
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  X,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Unlock,
  Ban,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Play,
  Pause,
} from 'lucide-react';

// ... rest of the component
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
      ]
    },
    {
      section: 'Management',
      items: [
        { icon: Shield, label: 'Roles', path: '/admin/roles' },
        { icon: Lock, label: 'Permissions', path: '/admin/permissions' },
        { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
        { icon: Target, label: 'Difficulties', path: '/admin/difficulties' },
        { icon: Diamond, label: 'Rarities', path: '/admin/rarities' },
        { icon: Activity, label: 'Statuses', path: '/admin/statuses' },
        { icon: Crown, label: 'Ranks', path: '/admin/ranks' },
        { icon: Briefcase, label: 'Career Paths', path: '/admin/career-paths' },
        { icon: Star, label: 'Badges', path: '/admin/badges' },
        { icon: Gift, label: 'Rewards', path: '/admin/rewards' },
        { icon: Bell, label: 'Notification Types', path: '/admin/notification-types' },
        { icon: CalendarDays, label: 'Mission Types', path: '/admin/mission-types' },
        { icon: Gamepad2, label: 'Challenge Types', path: '/admin/challenge-types' },
        { icon: Globe, label: 'Countries', path: '/admin/countries' },
        { icon: Clock, label: 'Timezones', path: '/admin/timezones' },
        { icon: Palette, label: 'Themes', path: '/admin/themes' },
        { icon: Languages, label: 'Languages', path: '/admin/languages' },
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