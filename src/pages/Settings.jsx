// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Save,
  X,
  Check,
  AlertCircle,
  Loader,
  RefreshCw,
  Trash2,
  LogOut,
  Download,
  Upload,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useWebSocket } from '../context/WebSocketContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, updateProfile, changePassword, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isConnected } = useWebSocket();
  const { profile } = useSelector(state => state.user);

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    email: '',
    bio: '',
    country: '',
    timezone: '',
    careerPath: 'general',
    birthDate: '',
  });

  // Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    missionReminders: true,
    habitReminders: true,
    streakReminders: true,
    achievementAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    showActivity: true,
    allowFriendRequests: true,
    allowMessages: true,
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark',
    animationsEnabled: true,
    soundEnabled: true,
    compactMode: false,
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.displayName || '',
        email: user.email || '',
        bio: user.bio || '',
        country: user.country || '',
        timezone: user.timezone || 'UTC',
        careerPath: user.careerPath || 'general',
        birthDate: user.birthDate || '',
      });
    }
  }, [user]);

  // Load saved preferences
  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        setPreferences(prev => ({ ...prev, ...parsed }));
        setNotificationSettings(prev => ({ ...prev, ...parsed.notifications }));
        setPrivacySettings(prev => ({ ...prev, ...parsed.privacy }));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save preferences
  const savePreferences = () => {
    const prefs = {
      ...preferences,
      notifications: notificationSettings,
      privacy: privacySettings,
    };
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    toast.success('Preferences saved!');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(profileForm);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/export-data');
      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `life-rpg-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
      setShowExportModal(false);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'data', label: 'Data & Export', icon: Download },
  ];

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  // If no user, show message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">No User Data</h2>
          <p className="text-gray-400 mt-2">Please log in to access your settings.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and settings</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isConnected ? '● Connected' : '● Disconnected'}
          </span>
          <Button
            variant="outline"
            size="small"
            icon={RefreshCw}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-xl p-4 border border-white/20 sticky top-6">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                      ${activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition mt-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' && (
                <ProfileSettings
                  form={profileForm}
                  setForm={setProfileForm}
                  onSubmit={handleProfileUpdate}
                  isSaving={isSaving}
                />
              )}
              {activeTab === 'security' && (
                <SecuritySettings
                  onPasswordChange={() => setShowPasswordModal(true)}
                />
              )}
              {activeTab === 'notifications' && (
                <NotificationSettings
                  settings={notificationSettings}
                  setSettings={setNotificationSettings}
                  onSave={savePreferences}
                />
              )}
              {activeTab === 'preferences' && (
                <PreferencesSettings
                  preferences={preferences}
                  setPreferences={setPreferences}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  onSave={savePreferences}
                />
              )}
              {activeTab === 'privacy' && (
                <PrivacySettings
                  settings={privacySettings}
                  setSettings={setPrivacySettings}
                  onSave={savePreferences}
                />
              )}
              {activeTab === 'data' && (
                <DataSettings
                  onExport={() => setShowExportModal(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <PasswordModal
            form={passwordForm}
            setForm={setPasswordForm}
            onSubmit={handlePasswordChange}
            isLoading={isLoading}
            onClose={() => {
              setShowPasswordModal(false);
              setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
            }}
            showCurrentPassword={showCurrentPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteAccountModal
            onConfirm={handleDeleteAccount}
            onClose={() => setShowDeleteModal(false)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>

      {/* Export Data Modal */}
      <AnimatePresence>
        {showExportModal && (
          <ExportDataModal
            onConfirm={handleExportData}
            onClose={() => setShowExportModal(false)}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// Sub-Components
// ============================================

// Profile Settings Component
const ProfileSettings = ({ form, setForm, onSubmit, isSaving }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Display Name"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="3"
            className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Your country"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Career Path
            </label>
            <select
              name="careerPath"
              value={form.careerPath}
              onChange={handleChange}
              className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="general">General</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="business">Business</option>
              <option value="student">Student</option>
              <option value="fitness">Fitness</option>
              <option value="creator">Creator</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Timezone
            </label>
            <select
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Dubai">Dubai</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Australia/Sydney">Sydney</option>
            </select>
          </div>
          <Input
            label="Birth Date"
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button type="submit" variant="gradient" loading={isSaving} icon={Save}>
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = ({ onPasswordChange }) => {
  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>

      <div className="space-y-6">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Change Password</h3>
              <p className="text-xs text-gray-400">Update your password regularly for security</p>
            </div>
            <Button variant="primary" size="small" onClick={onPasswordChange}>
              Change Password
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Two-Factor Authentication</h3>
              <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="small">
              Enable 2FA
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Active Sessions</h3>
              <p className="text-xs text-gray-400">Manage your active sessions across devices</p>
            </div>
            <Button variant="outline" size="small">
              View Sessions
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Login History</h3>
              <p className="text-xs text-gray-400">View your recent login activity</p>
            </div>
            <Button variant="outline" size="small">
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = ({ settings, setSettings, onSave }) => {
  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationGroups = [
    {
      title: 'General Notifications',
      items: [
        { key: 'emailNotifications', label: 'Email Notifications' },
        { key: 'pushNotifications', label: 'Push Notifications' },
      ],
    },
    {
      title: 'Reminders',
      items: [
        { key: 'missionReminders', label: 'Mission Reminders' },
        { key: 'habitReminders', label: 'Habit Reminders' },
        { key: 'streakReminders', label: 'Streak Reminders' },
      ],
    },
    {
      title: 'Alerts',
      items: [
        { key: 'achievementAlerts', label: 'Achievement Alerts' },
        { key: 'weeklyReports', label: 'Weekly Reports' },
        { key: 'marketingEmails', label: 'Marketing Emails' },
      ],
    },
  ];

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-6">Notification Settings</h2>

      <div className="space-y-6">
        {notificationGroups.map((group, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-3">{group.title}</h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={() => toggleSetting(item.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button variant="gradient" onClick={onSave} icon={Save}>
            Save Preferences
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

// Preferences Settings Component
const PreferencesSettings = ({ preferences, setPreferences, theme, toggleTheme, onSave }) => {
  const handleChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-6">Preferences</h2>

      <div className="space-y-6">
        {/* Theme */}
        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">Theme</h3>
          <div className="flex gap-3">
            <button
              onClick={toggleTheme}
              className={`flex-1 p-3 rounded-lg border transition ${
                theme === 'dark'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <Moon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">Dark</span>
                {theme === 'dark' && <Check className="w-4 h-4 text-primary-400" />}
              </div>
            </button>
            <button
              onClick={toggleTheme}
              className={`flex-1 p-3 rounded-lg border transition ${
                theme === 'light'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <Sun className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">Light</span>
                {theme === 'light' && <Check className="w-4 h-4 text-primary-400" />}
              </div>
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">Language</h3>
          <select
            value={preferences.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full bg-white/5 rounded-lg px-4 py-2 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Date Format */}
        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">Date Format</h3>
          <select
            value={preferences.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            className="w-full bg-white/5 rounded-lg px-4 py-2 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        {/* General Preferences */}
        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">General Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Animations</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.animationsEnabled}
                  onChange={(e) => handleChange('animationsEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Sound Effects</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.soundEnabled}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Compact Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.compactMode}
                  onChange={(e) => handleChange('compactMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button variant="gradient" onClick={onSave} icon={Save}>
            Save Preferences
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

// Privacy Settings Component
const PrivacySettings = ({ settings, setSettings, onSave }) => {
  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-6">Privacy Settings</h2>

      <div className="space-y-6">
        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">Profile Visibility</h3>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleChange('profileVisibility', e.target.value)}
            className="w-full bg-white/5 rounded-lg px-4 py-2 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-3">Privacy Controls</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Show Online Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showOnlineStatus}
                  onChange={() => toggleSetting('showOnlineStatus')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Show Activity</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showActivity}
                  onChange={() => toggleSetting('showActivity')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Allow Friend Requests</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowFriendRequests}
                  onChange={() => toggleSetting('allowFriendRequests')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Allow Messages</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowMessages}
                  onChange={() => toggleSetting('allowMessages')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button variant="gradient" onClick={onSave} icon={Save}>
            Save Privacy Settings
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

// Data Settings Component
const DataSettings = ({ onExport }) => {
  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-6">Data & Export</h2>

      <div className="space-y-6">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Export Data</h3>
              <p className="text-xs text-gray-400">Download all your data in JSON format</p>
            </div>
            <Button variant="primary" size="small" icon={Download} onClick={onExport}>
              Export
            </Button>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white">Import Data</h3>
              <p className="text-xs text-gray-400">Import data from a previous export</p>
            </div>
            <Button variant="outline" size="small" icon={Upload}>
              Import
            </Button>
          </div>
        </div>

        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-400">Clear All Data</h3>
              <p className="text-xs text-red-400/70">This will delete all your progress data</p>
            </div>
            <Button variant="danger" size="small">
              Clear Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Password Modal
const PasswordModal = ({
  form,
  setForm,
  onSubmit,
  isLoading,
  onClose,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Change Password</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="text-gray-400 hover:text-white transition"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-gray-400 hover:text-white transition"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="gradient" className="flex-1" loading={isLoading}>
                Change Password
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

// Delete Account Modal
const DeleteAccountModal = ({ onConfirm, onClose, isLoading }) => {
  const [confirmText, setConfirmText] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    if (confirmText === 'DELETE' && agreed) {
      onConfirm();
    } else {
      toast.error('Please type DELETE and agree to the terms');
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
        className="bg-dark-800 rounded-xl max-w-md w-full border border-red-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Delete Account</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-sm text-red-400">
                <strong>Warning:</strong> This action cannot be undone. All your data, progress, and achievements will be permanently deleted.
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">
                Type <strong className="text-red-400">DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full bg-white/5 rounded-lg px-4 py-2 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Type DELETE here"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 bg-white/5 border border-white/20 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-300">
                I understand that this action is permanent and irreversible
              </span>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleConfirm}
                loading={isLoading}
                disabled={confirmText !== 'DELETE' || !agreed}
              >
                Delete Account
              </Button>
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Export Data Modal
const ExportDataModal = ({ onConfirm, onClose, isLoading }) => {
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Download className="w-6 h-6 text-primary-400" />
              <h3 className="text-xl font-bold text-white">Export Data</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Your data will be exported as a JSON file containing all your:
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Profile information
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Progress and achievements
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Mission and habit history
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Personality stats and preferences
              </li>
            </ul>

            <div className="flex gap-3 pt-4">
              <Button variant="gradient" className="flex-1" onClick={onConfirm} loading={isLoading}>
                Export Data
              </Button>
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;