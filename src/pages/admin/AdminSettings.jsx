// src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  Globe,
  Server,
  Database,
  Cloud,
  Shield,
  User,
  Mail,
  Bell,
  Zap,
  Target,
  Activity,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Palette,
  Code,
  Dumbbell,
  Camera,
  Heart,
  Brain,
  Flame,
  Star,
  Crown,
  Gem,
  Medal,
  Sparkles,
  Gift,
  Clock,
  Calendar,
  MapPin,
  Link,
  FileText,
  Image,
  Video,
  Music,
  MessageCircle,
  Phone,
  Video as VideoIcon,
  Share2,
  Bookmark,
  Flag,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AdminModal from '../../components/admin/AdminModal';
import { toast } from 'react-toastify';

const AdminSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Settings sections
  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'gamification', label: 'Gamification', icon: Award },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Cloud },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSettings(data);
      setOriginalSettings(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
      setHasChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      const response = await fetch('/api/admin/settings/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSettings(data);
      setOriginalSettings(JSON.parse(JSON.stringify(data)));
      setHasChanges(false);
      toast.success('Settings reset to default');
      setShowResetModal(false);
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/settings/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Settings exported successfully');
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast.error('Failed to export settings');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      setSettings(data);
      setOriginalSettings(JSON.parse(JSON.stringify(data)));
      setHasChanges(true);
      toast.success('Settings imported successfully');
      setShowImportModal(false);
    } catch (error) {
      console.error('Error importing settings:', error);
      toast.error('Failed to import settings');
    }
  };

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const renderSettingInput = (section, key, config) => {
    const value = settings[section]?.[key];

    switch (config.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleSettingChange(section, key, e.target.value)}
            placeholder={config.placeholder}
            className="flex-1"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => handleSettingChange(section, key, parseInt(e.target.value) || 0)}
            min={config.min}
            max={config.max}
            className="flex-1"
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSettingChange(section, key, !value)}
              className={`relative w-12 h-6 rounded-full transition ${
                value ? 'bg-primary-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
                  value ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
            <span className="text-sm text-gray-400">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSettingChange(section, key, e.target.value)}
            className="flex-1 bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {config.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#7d26ff'}
              onChange={(e) => handleSettingChange(section, key, e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10"
            />
            <Input
              value={value || '#7d26ff'}
              onChange={(e) => handleSettingChange(section, key, e.target.value)}
              className="flex-1"
            />
          </div>
        );
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleSettingChange(section, key, e.target.value)}
            rows={config.rows || 3}
            className="flex-1 bg-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={config.placeholder}
          />
        );
      case 'array':
        return (
          <div className="space-y-2">
            {Array.isArray(value) && value.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArray = [...value];
                    newArray[index] = e.target.value;
                    handleSettingChange(section, key, newArray);
                  }}
                  className="flex-1"
                />
                <button
                  onClick={() => {
                    const newArray = value.filter((_, i) => i !== index);
                    handleSettingChange(section, key, newArray);
                  }}
                  className="p-1.5 rounded hover:bg-white/10 transition text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newArray = [...(value || []), ''];
                handleSettingChange(section, key, newArray);
              }}
              className="text-sm text-primary-400 hover:text-primary-300 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSection = (sectionId) => {
    const sectionConfigs = {
      general: [
        { key: 'siteName', label: 'Site Name', type: 'text', placeholder: 'Enter site name' },
        { key: 'siteDescription', label: 'Site Description', type: 'textarea', rows: 2, placeholder: 'Enter site description' },
        { key: 'timezone', label: 'Timezone', type: 'select', options: [
          { value: 'UTC', label: 'UTC' },
          { value: 'America/New_York', label: 'Eastern Time' },
          { value: 'America/Chicago', label: 'Central Time' },
          { value: 'America/Denver', label: 'Mountain Time' },
          { value: 'America/Los_Angeles', label: 'Pacific Time' },
          { value: 'Europe/London', label: 'London' },
          { value: 'Europe/Paris', label: 'Paris' },
          { value: 'Asia/Dubai', label: 'Dubai' },
          { value: 'Asia/Tokyo', label: 'Tokyo' },
          { value: 'Australia/Sydney', label: 'Sydney' },
        ] },
        { key: 'defaultLanguage', label: 'Default Language', type: 'select', options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'ja', label: 'Japanese' },
          { value: 'zh', label: 'Chinese' },
        ] },
        { key: 'maintenanceMode', label: 'Maintenance Mode', type: 'boolean' },
      ],
      appearance: [
        { key: 'primaryColor', label: 'Primary Color', type: 'color' },
        { key: 'secondaryColor', label: 'Secondary Color', type: 'color' },
        { key: 'darkMode', label: 'Dark Mode Default', type: 'boolean' },
        { key: 'customCSS', label: 'Custom CSS', type: 'textarea', rows: 4, placeholder: 'Enter custom CSS' },
        { key: 'customJS', label: 'Custom JavaScript', type: 'textarea', rows: 4, placeholder: 'Enter custom JavaScript' },
      ],
      features: [
        { key: 'missionsEnabled', label: 'Missions', type: 'boolean' },
        { key: 'habitsEnabled', label: 'Habits', type: 'boolean' },
        { key: 'achievementsEnabled', label: 'Achievements', type: 'boolean' },
        { key: 'challengesEnabled', label: 'Challenges', type: 'boolean' },
        { key: 'leaderboardEnabled', label: 'Leaderboard', type: 'boolean' },
        { key: 'communityEnabled', label: 'Community', type: 'boolean' },
        { key: 'aiCoachEnabled', label: 'AI Coach', type: 'boolean' },
        { key: 'analyticsEnabled', label: 'Analytics', type: 'boolean' },
      ],
      gamification: [
        { key: 'xpMultiplier', label: 'XP Multiplier', type: 'number', min: 0.1, max: 10 },
        { key: 'dailyRewardEnabled', label: 'Daily Rewards', type: 'boolean' },
        { key: 'dailyRewardAmount', label: 'Daily Reward XP', type: 'number', min: 10, max: 1000 },
        { key: 'streakBonusEnabled', label: 'Streak Bonuses', type: 'boolean' },
        { key: 'streakMultiplier', label: 'Streak Multiplier', type: 'number', min: 1, max: 5 },
        { key: 'levelCap', label: 'Maximum Level', type: 'number', min: 10, max: 999 },
        { key: 'achievementTiers', label: 'Achievement Tiers', type: 'array' },
      ],
      social: [
        { key: 'facebookUrl', label: 'Facebook URL', type: 'text', placeholder: 'https://facebook.com/...' },
        { key: 'twitterUrl', label: 'Twitter URL', type: 'text', placeholder: 'https://twitter.com/...' },
        { key: 'instagramUrl', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/...' },
        { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'text', placeholder: 'https://linkedin.com/...' },
        { key: 'youtubeUrl', label: 'YouTube URL', type: 'text', placeholder: 'https://youtube.com/...' },
        { key: 'discordUrl', label: 'Discord URL', type: 'text', placeholder: 'https://discord.gg/...' },
        { key: 'githubUrl', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
      ],
      email: [
        { key: 'smtpHost', label: 'SMTP Host', type: 'text', placeholder: 'smtp.example.com' },
        { key: 'smtpPort', label: 'SMTP Port', type: 'number', min: 1, max: 65535 },
        { key: 'smtpUsername', label: 'SMTP Username', type: 'text', placeholder: 'username' },
        { key: 'smtpPassword', label: 'SMTP Password', type: 'text', placeholder: 'password' },
        { key: 'smtpEncryption', label: 'SMTP Encryption', type: 'select', options: [
          { value: 'none', label: 'None' },
          { value: 'ssl', label: 'SSL' },
          { value: 'tls', label: 'TLS' },
        ] },
        { key: 'fromEmail', label: 'From Email', type: 'text', placeholder: 'noreply@example.com' },
        { key: 'fromName', label: 'From Name', type: 'text', placeholder: 'Life RPG' },
      ],
      security: [
        { key: 'registrationEnabled', label: 'Registration', type: 'boolean' },
        { key: 'emailVerification', label: 'Email Verification', type: 'boolean' },
        { key: 'twoFactorAuth', label: 'Two-Factor Authentication', type: 'boolean' },
        { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'number', min: 5, max: 1440 },
        { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number', min: 3, max: 10 },
        { key: 'passwordMinLength', label: 'Minimum Password Length', type: 'number', min: 6, max: 20 },
        { key: 'rateLimiting', label: 'Rate Limiting', type: 'boolean' },
        { key: 'rateLimitMax', label: 'Rate Limit (requests per minute)', type: 'number', min: 10, max: 1000 },
      ],
      integrations: [
        { key: 'googleAnalytics', label: 'Google Analytics ID', type: 'text', placeholder: 'UA-XXXXXXXX-X' },
        { key: 'facebookPixel', label: 'Facebook Pixel ID', type: 'text', placeholder: 'XXXXXXXXXXXXXXX' },
        { key: 'stripeKey', label: 'Stripe Public Key', type: 'text', placeholder: 'pk_test_...' },
        { key: 'stripeSecret', label: 'Stripe Secret Key', type: 'text', placeholder: 'sk_test_...' },
        { key: 'githubEnabled', label: 'GitHub Integration', type: 'boolean' },
        { key: 'githubClientId', label: 'GitHub Client ID', type: 'text', placeholder: 'Client ID' },
        { key: 'googleEnabled', label: 'Google Integration', type: 'boolean' },
        { key: 'googleClientId', label: 'Google Client ID', type: 'text', placeholder: 'Client ID' },
      ],
      advanced: [
        { key: 'debugMode', label: 'Debug Mode', type: 'boolean' },
        { key: 'logLevel', label: 'Log Level', type: 'select', options: [
          { value: 'error', label: 'Error' },
          { value: 'warn', label: 'Warn' },
          { value: 'info', label: 'Info' },
          { value: 'debug', label: 'Debug' },
        ] },
        { key: 'cacheEnabled', label: 'Cache Enabled', type: 'boolean' },
        { key: 'cacheDuration', label: 'Cache Duration (minutes)', type: 'number', min: 1, max: 1440 },
        { key: 'backupEnabled', label: 'Auto Backup', type: 'boolean' },
        { key: 'backupFrequency', label: 'Backup Frequency (hours)', type: 'number', min: 1, max: 168 },
        { key: 'allowedDomains', label: 'Allowed Domains', type: 'array' },
        { key: 'blockedIPs', label: 'Blocked IPs', type: 'array' },
      ],
    };

    const configs = sectionConfigs[sectionId] || [];
    const sectionData = settings[sectionId] || {};

    return (
      <div className="space-y-6">
        {configs.map((config) => (
          <div key={config.key} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">
              {config.label}
            </label>
            {renderSettingInput(sectionId, config.key, config)}
            {config.description && (
              <p className="text-xs text-gray-400">{config.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">System Settings</h1>
          <p className="text-gray-400">Manage your platform configuration</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-yellow-400">• Unsaved changes</span>
          )}
          <Button
            variant="outline"
            size="small"
            icon={RefreshCw}
            onClick={fetchSettings}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={Download}
            onClick={() => setShowExportModal(true)}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="small"
            icon={Upload}
            onClick={() => setShowImportModal(true)}
          >
            Import
          </Button>
          <Button
            variant="gradient"
            size="small"
            icon={Save}
            onClick={handleSave}
            loading={isSaving}
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-xl p-4 border border-white/20 sticky top-6">
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                      ${activeSection === section.id
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowResetModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-effect rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold text-white mb-6 capitalize">
                {sections.find(s => s.id === activeSection)?.label} Settings
              </h2>
              {renderSection(activeSection)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Confirm Save Modal */}
      <AdminModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Changes"
        variant="warning"
        confirmText="Save Changes"
        onConfirm={handleSave}
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-300">
              You have unsaved changes. Are you sure you want to save these settings?
            </p>
            <p className="text-xs text-gray-400 mt-1">
              This will apply the changes immediately to all users.
            </p>
          </div>
        </div>
      </AdminModal>

      {/* Reset Modal */}
      <AdminModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Settings"
        variant="danger"
        confirmText="Reset"
        onConfirm={handleReset}
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-300">
              This will reset all settings to their default values.
            </p>
            <p className="text-sm text-red-400 mt-1">
              This action cannot be undone!
            </p>
          </div>
        </div>
      </AdminModal>

      {/* Export Modal */}
      <AdminModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Settings"
        confirmText="Export"
        onConfirm={handleExport}
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Export all settings as a JSON file for backup or migration.
          </p>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">
              The export includes all configuration settings including:
            </p>
            <ul className="text-xs text-gray-400 list-disc list-inside mt-1 space-y-0.5">
              <li>General settings</li>
              <li>Appearance configuration</li>
              <li>Feature toggles</li>
              <li>Gamification settings</li>
              <li>Social media links</li>
              <li>Email configuration</li>
              <li>Security settings</li>
              <li>Integration keys</li>
            </ul>
          </div>
        </div>
      </AdminModal>

      {/* Import Modal */}
      <AdminModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Settings"
        confirmText="Import"
        onConfirm={() => document.getElementById('import-file').click()}
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Import settings from a JSON file.
          </p>
          <div className="p-4 border-2 border-dashed border-white/20 rounded-lg text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Click the Import button to select a file</p>
            <input
              id="import-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
          <p className="text-xs text-yellow-400">
            Warning: This will overwrite all current settings!
          </p>
        </div>
      </AdminModal>
    </div>
  );
};

// Loading Skeleton
const AdminLoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="h-4 w-64 bg-white/5 rounded mt-2"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-24 bg-white/5 rounded"></div>
        <div className="h-10 w-32 bg-white/5 rounded"></div>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-6">
      <div className="h-96 bg-white/5 rounded-xl"></div>
      <div className="col-span-3 h-96 bg-white/5 rounded-xl"></div>
    </div>
  </div>
);

export default AdminSettings;