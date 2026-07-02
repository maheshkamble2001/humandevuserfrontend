// src/pages/admin/AdminAchievements.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Copy,
  RefreshCw,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Star,
  Crown,
  Gem,
  Medal,
  Sparkles,
  Zap,
  Target,
  Users,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Camera,
  Heart,
  Brain,
  Shield,
  Flame,
  Trophy,
  Gift,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  Loader,
  MoreVertical,
  Share2,
  Bookmark,
  Flag,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

const AdminAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unlocked: 0,
    locked: 0,
    byRarity: { common: 0, rare: 0, epic: 0, legendary: 0 },
  });

  // Achievement form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    rarity: 'common',
    xpReward: 50,
    icon: 'Award',
    requirements: '',
    maxProgress: 1,
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Available icons
  const availableIcons = {
    Award, Star, Crown, Gem, Medal, Sparkles, Zap, Target, Users, 
    BookOpen, Code, Palette, Briefcase, GraduationCap, Dumbbell, 
    Camera, Heart, Brain, Shield, Flame, Trophy, Gift, 
  };

  useEffect(() => {
    fetchAchievements();
  }, [currentPage, filter, searchTerm]);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/achievements?page=${currentPage}&limit=20&filter=${filter}&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAchievements(data.achievements || []);
      setTotalPages(data.totalPages || 1);
      setStats(data.stats || {
        total: 0,
        unlocked: 0,
        locked: 0,
        byRarity: { common: 0, rare: 0, epic: 0, legendary: 0 },
      });
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (achievement) => {
    setSelectedAchievement(achievement);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (achievement) => {
    setSelectedAchievement(achievement);
    setFormData({
      name: achievement.name || '',
      description: achievement.description || '',
      category: achievement.category || 'general',
      rarity: achievement.rarity || 'common',
      xpReward: achievement.xpReward || 50,
      icon: achievement.icon || 'Award',
      requirements: achievement.requirements ? JSON.stringify(achievement.requirements, null, 2) : '',
      maxProgress: achievement.maxProgress || 1,
      isActive: achievement.isActive !== undefined ? achievement.isActive : true,
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      rarity: 'common',
      xpReward: 50,
      icon: 'Award',
      requirements: '',
      maxProgress: 1,
      isActive: true,
    });
    setModalType('create');
    setShowModal(true);
  };

  const handleDelete = async (achievement) => {
    if (!window.confirm(`Are you sure you want to delete "${achievement.name}"?`)) return;

    try {
      await fetch(`/api/admin/achievements/${achievement.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Achievement deleted successfully');
      fetchAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast.error('Failed to delete achievement');
    }
  };

  const handleCopy = (achievement) => {
    const text = `${achievement.name}: ${achievement.description} (${achievement.rarity})`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      await fetch('/api/admin/achievements/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          achievementIds: selectedIds
        })
      });
      toast.success(`Successfully performed ${action} on ${selectedIds.length} achievements`);
      setSelectedAchievements([]);
      fetchAchievements();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.xpReward < 1) errors.xpReward = 'XP reward must be at least 1';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix form errors');
      return;
    }

    try {
      const url = modalType === 'create' 
        ? '/api/admin/achievements' 
        : `/api/admin/achievements/${selectedAchievement.id}`;
      
      const method = modalType === 'create' ? 'POST' : 'PUT';

      const data = {
        ...formData,
        requirements: formData.requirements ? JSON.parse(formData.requirements) : {},
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save achievement');
      }

      toast.success(`Achievement ${modalType === 'create' ? 'created' : 'updated'} successfully`);
      setShowModal(false);
      fetchAchievements();
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast.error(error.message || 'Failed to save achievement');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'rarity', label: 'Rarity', sortable: true },
    { key: 'xpReward', label: 'XP Reward', sortable: true },
    { key: 'unlocked', label: 'Unlocked', sortable: true },
    { key: 'isActive', label: 'Active', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
  ];

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-400 border-gray-400',
      rare: 'text-blue-400 border-blue-400',
      epic: 'text-purple-400 border-purple-400',
      legendary: 'text-yellow-400 border-yellow-400',
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBgColor = (rarity) => {
    const colors = {
      common: 'bg-gray-400/10',
      rare: 'bg-blue-400/10',
      epic: 'bg-purple-400/10',
      legendary: 'bg-yellow-400/10',
    };
    return colors[rarity] || colors.common;
  };

  const getRarityIcon = (rarity) => {
    const icons = {
      common: Star,
      rare: Gem,
      epic: Medal,
      legendary: Crown,
    };
    return icons[rarity] || Star;
  };

  if (isLoading && achievements.length === 0) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Achievement Management</h1>
          <p className="text-gray-400">Manage all achievements in the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" icon={Download}>
            Export
          </Button>
          <Button variant="outline" size="small" icon={Upload}>
            Import
          </Button>
          <Button variant="gradient" size="small" icon={Plus} onClick={handleCreate}>
            Create Achievement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Award}
          label="Total Achievements"
          value={stats.total || 0}
          color="primary"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Unlocked"
          value={stats.unlocked || 0}
          color="success"
        />
        <AdminStatsCard
          icon={Lock}
          label="Locked"
          value={stats.locked || 0}
          color="danger"
        />
        <AdminStatsCard
          icon={Crown}
          label="Legendary"
          value={stats.byRarity?.legendary || 0}
          color="warning"
          badge="Rare"
        />
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="missions">Missions</option>
              <option value="habits">Habits</option>
              <option value="social">Social</option>
              <option value="career">Career</option>
              <option value="fitness">Fitness</option>
              <option value="learning">Learning</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Achievements Table */}
      <AdminTable
        columns={columns}
        data={achievements}
        isLoading={isLoading}
        onRowClick={handleView}
        selectedRows={selectedAchievements}
        onSelectRows={setSelectedAchievements}
        bulkActions={[
          { label: 'Activate', value: 'activate', icon: CheckCircle },
          { label: 'Deactivate', value: 'deactivate', icon: XCircle },
          { label: 'Delete', value: 'delete', icon: Trash2 },
        ]}
        onBulkAction={handleBulkAction}
        renderCell={(column, row) => {
          if (column.key === 'name') {
            const Icon = availableIcons[row.icon] || Award;
            return (
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${getRarityColor(row.rarity)}`} />
                <span className="text-white">{row.name}</span>
              </div>
            );
          }
          if (column.key === 'rarity') {
            const RarityIcon = getRarityIcon(row.rarity);
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRarityBgColor(row.rarity)} ${getRarityColor(row.rarity)}`}>
                <RarityIcon className="w-3 h-3 inline mr-1" />
                {row.rarity}
              </span>
            );
          }
          if (column.key === 'unlocked') {
            return (
              <span className="text-sm">
                {row.unlocked || 0} / {row.total || 0}
              </span>
            );
          }
          if (column.key === 'isActive') {
            return row.isActive ? (
              <span className="text-xs text-green-400">Active</span>
            ) : (
              <span className="text-xs text-gray-400">Inactive</span>
            );
          }
          if (column.key === 'xpReward') {
            return <span className="text-yellow-400">{row.xpReward} XP</span>;
          }
          return row[column.key];
        }}
        actions={[
          { icon: Eye, label: 'View', onClick: handleView },
          { icon: Edit2, label: 'Edit', onClick: handleEdit },
          { icon: Trash2, label: 'Delete', onClick: handleDelete, color: 'text-red-400 hover:text-red-300' },
          { icon: Copy, label: 'Copy', onClick: handleCopy },
        ]}
      />

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormErrors({});
        }}
        title={modalType === 'create' ? 'Create Achievement' : modalType === 'edit' ? 'Edit Achievement' : 'Achievement Details'}
        size="lg"
        confirmText={modalType === 'view' ? 'Close' : 'Save'}
        showCancel={modalType !== 'view'}
        onConfirm={modalType === 'view' ? () => setShowModal(false) : handleSubmit}
        confirmVariant={modalType === 'view' ? 'outline' : 'gradient'}
      >
        {modalType === 'view' && selectedAchievement ? (
          <AchievementDetailView achievement={selectedAchievement} />
        ) : (
          <AchievementForm
            formData={formData}
            formErrors={formErrors}
            onChange={handleFormChange}
            availableIcons={availableIcons}
            isEdit={modalType === 'edit'}
          />
        )}
      </AdminModal>
    </div>
  );
};

// Achievement Detail View Component
const AchievementDetailView = ({ achievement }) => {
  const Icon = achievement.icon ? availableIcons[achievement.icon] : Award;
  const RarityIcon = getRarityIcon(achievement.rarity);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${getRarityBgColor(achievement.rarity)}`}>
          <Icon className={`w-12 h-12 ${getRarityColor(achievement.rarity)}`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{achievement.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <RarityIcon className={`w-4 h-4 ${getRarityColor(achievement.rarity)}`} />
            <span className={`text-sm font-medium ${getRarityColor(achievement.rarity)}`}>
              {achievement.rarity.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-400">{achievement.category}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className={`text-sm ${achievement.isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {achievement.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <p className="text-gray-300">{achievement.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">XP Reward</p>
          <p className="text-lg font-bold text-yellow-400">{achievement.xpReward} XP</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Max Progress</p>
          <p className="text-lg font-bold text-white">{achievement.maxProgress || 1}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Unlocked</p>
          <p className="text-lg font-bold text-green-400">{achievement.unlocked || 0}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Created</p>
          <p className="text-lg font-bold text-white">
            {achievement.createdAt ? new Date(achievement.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {achievement.requirements && Object.keys(achievement.requirements).length > 0 && (
        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Requirements</h4>
          <pre className="text-xs text-gray-400 whitespace-pre-wrap">
            {JSON.stringify(achievement.requirements, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Achievement Form Component
const AchievementForm = ({ formData, formErrors, onChange, availableIcons, isEdit }) => {
  const Icon = availableIcons[formData.icon] || Award;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={onChange}
            error={formErrors.name}
            placeholder="Enter achievement name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Icon
          </label>
          <div className="flex gap-2">
            <div className={`p-2 rounded-lg ${formData.rarity ? getRarityBgColor(formData.rarity) : 'bg-white/5'}`}>
              <Icon className={`w-6 h-6 ${formData.rarity ? getRarityColor(formData.rarity) : 'text-gray-400'}`} />
            </div>
            <select
              name="icon"
              value={formData.icon}
              onChange={onChange}
              className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.keys(availableIcons).map((iconName) => (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows="3"
          className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Describe the achievement..."
          required
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-400">{formErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="general">General</option>
            <option value="missions">Missions</option>
            <option value="habits">Habits</option>
            <option value="social">Social</option>
            <option value="career">Career</option>
            <option value="fitness">Fitness</option>
            <option value="learning">Learning</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Rarity
          </label>
          <select
            name="rarity"
            value={formData.rarity}
            onChange={onChange}
            className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="XP Reward"
            type="number"
            name="xpReward"
            value={formData.xpReward}
            onChange={onChange}
            error={formErrors.xpReward}
            min="1"
            required
          />
        </div>
        <div>
          <Input
            label="Max Progress"
            type="number"
            name="maxProgress"
            value={formData.maxProgress}
            onChange={onChange}
            min="1"
            placeholder="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Requirements (JSON)
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={onChange}
          rows="4"
          className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          placeholder='{"type": "missions", "count": 10}'
        />
        <p className="text-xs text-gray-400 mt-1">Enter requirements as a JSON object</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={onChange}
          className="w-4 h-4 bg-white/5 border border-white/20 rounded focus:ring-primary-500"
        />
        <label className="text-sm text-gray-300">Active</label>
      </div>
    </div>
  );
};

// Helper functions
const getRarityColor = (rarity) => {
  const colors = {
    common: 'text-gray-400 border-gray-400',
    rare: 'text-blue-400 border-blue-400',
    epic: 'text-purple-400 border-purple-400',
    legendary: 'text-yellow-400 border-yellow-400',
  };
  return colors[rarity] || colors.common;
};

const getRarityBgColor = (rarity) => {
  const colors = {
    common: 'bg-gray-400/10',
    rare: 'bg-blue-400/10',
    epic: 'bg-purple-400/10',
    legendary: 'bg-yellow-400/10',
  };
  return colors[rarity] || colors.common;
};

const getRarityIcon = (rarity) => {
  const icons = {
    common: Star,
    rare: Gem,
    epic: Medal,
    legendary: Crown,
  };
  return icons[rarity] || Star;
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
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
      ))}
    </div>
    <div className="h-16 bg-white/5 rounded-xl"></div>
    <div className="h-96 bg-white/5 rounded-xl"></div>
  </div>
);

export default AdminAchievements;