// src/pages/admin/AdminHabits.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
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
  BarChart3,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

const AdminHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byCategory: {},
    byFrequency: {},
    avgStreak: 0,
    totalCompletions: 0,
  });

  // Habit form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    frequency: 'daily',
    duration: 15,
    streak: 0,
    bestStreak: 0,
    totalCompletions: 0,
    completionRate: 0,
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Habit categories
  const categories = [
    { value: 'general', label: 'General', icon: Activity },
    { value: 'health', label: 'Health', icon: Heart },
    { value: 'fitness', label: 'Fitness', icon: Dumbbell },
    { value: 'learning', label: 'Learning', icon: BookOpen },
    { value: 'productivity', label: 'Productivity', icon: Zap },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'mindfulness', label: 'Mindfulness', icon: Brain },
    { value: 'career', label: 'Career', icon: Briefcase },
    { value: 'creative', label: 'Creative', icon: Palette },
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom' },
  ];

  useEffect(() => {
    fetchHabits();
  }, [currentPage, filter, searchTerm]);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/habits?page=${currentPage}&limit=20&filter=${filter}&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setHabits(data.habits || []);
      setTotalPages(data.totalPages || 1);
      setStats(data.stats || {
        total: 0,
        active: 0,
        inactive: 0,
        byCategory: {},
        byFrequency: {},
        avgStreak: 0,
        totalCompletions: 0,
      });
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (habit) => {
    setSelectedHabit(habit);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (habit) => {
    setSelectedHabit(habit);
    setFormData({
      name: habit.name || '',
      description: habit.description || '',
      category: habit.category || 'general',
      frequency: habit.frequency || 'daily',
      duration: habit.duration || 15,
      streak: habit.streak || 0,
      bestStreak: habit.bestStreak || 0,
      totalCompletions: habit.totalCompletions || 0,
      completionRate: habit.completionRate || 0,
      isActive: habit.isActive !== undefined ? habit.isActive : true,
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      frequency: 'daily',
      duration: 15,
      streak: 0,
      bestStreak: 0,
      totalCompletions: 0,
      completionRate: 0,
      isActive: true,
    });
    setModalType('create');
    setShowModal(true);
  };

  const handleDelete = async (habit) => {
    if (!window.confirm(`Are you sure you want to delete "${habit.name}"?`)) return;

    try {
      await fetch(`/api/admin/habits/${habit.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Habit deleted successfully');
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const handleCopy = (habit) => {
    const text = `${habit.name}: ${habit.description} (${habit.frequency})`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      await fetch('/api/admin/habits/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          habitIds: selectedIds
        })
      });
      toast.success(`Successfully performed ${action} on ${selectedIds.length} habits`);
      setSelectedHabits([]);
      fetchHabits();
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
    if (formData.duration < 1) errors.duration = 'Duration must be at least 1 minute';
    if (formData.duration > 1440) errors.duration = 'Duration cannot exceed 1440 minutes (24 hours)';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix form errors');
      return;
    }

    try {
      const url = modalType === 'create' 
        ? '/api/admin/habits' 
        : `/api/admin/habits/${selectedHabit.id}`;
      
      const method = modalType === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save habit');
      }

      toast.success(`Habit ${modalType === 'create' ? 'created' : 'updated'} successfully`);
      setShowModal(false);
      fetchHabits();
    } catch (error) {
      console.error('Error saving habit:', error);
      toast.error(error.message || 'Failed to save habit');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'frequency', label: 'Frequency', sortable: true },
    { key: 'streak', label: 'Streak', sortable: true },
    { key: 'totalCompletions', label: 'Completions', sortable: true },
    { key: 'completionRate', label: 'Rate', sortable: true },
    { key: 'isActive', label: 'Active', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      general: Activity,
      health: Heart,
      fitness: Dumbbell,
      learning: BookOpen,
      productivity: Zap,
      social: Users,
      mindfulness: Brain,
      career: Briefcase,
      creative: Palette,
    };
    return icons[category] || Activity;
  };

  const getFrequencyColor = (frequency) => {
    const colors = {
      daily: 'text-green-400',
      weekly: 'text-blue-400',
      custom: 'text-purple-400',
    };
    return colors[frequency] || 'text-gray-400';
  };

  const getTrendIcon = (rate) => {
    if (rate > 70) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (rate > 40) return <Minus className="w-3 h-3 text-yellow-400" />;
    return <TrendingDown className="w-3 h-3 text-red-400" />;
  };

  if (isLoading && habits.length === 0) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Habit Management</h1>
          <p className="text-gray-400">Manage all habits in the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" icon={Download}>
            Export
          </Button>
          <Button variant="outline" size="small" icon={Upload}>
            Import
          </Button>
          <Button variant="gradient" size="small" icon={Plus} onClick={handleCreate}>
            Create Habit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatsCard
          icon={Activity}
          label="Total Habits"
          value={stats.total || 0}
          color="primary"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Active"
          value={stats.active || 0}
          color="success"
        />
        <AdminStatsCard
          icon={XCircle}
          label="Inactive"
          value={stats.inactive || 0}
          color="danger"
        />
        <AdminStatsCard
          icon={Flame}
          label="Avg Streak"
          value={stats.avgStreak || 0}
          color="warning"
        />
        <AdminStatsCard
          icon={Target}
          label="Total Completions"
          value={stats.totalCompletions || 0}
          color="info"
        />
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search habits..."
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
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Frequencies</option>
              {frequencies.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Habits Table */}
      <AdminTable
        columns={columns}
        data={habits}
        isLoading={isLoading}
        onRowClick={handleView}
        selectedRows={selectedHabits}
        onSelectRows={setSelectedHabits}
        bulkActions={[
          { label: 'Activate', value: 'activate', icon: CheckCircle },
          { label: 'Deactivate', value: 'deactivate', icon: XCircle },
          { label: 'Delete', value: 'delete', icon: Trash2 },
        ]}
        onBulkAction={handleBulkAction}
        renderCell={(column, row) => {
          if (column.key === 'name') {
            const Icon = getCategoryIcon(row.category);
            return (
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-400" />
                <span className="text-white">{row.name}</span>
              </div>
            );
          }
          if (column.key === 'category') {
            return (
              <span className="text-sm text-gray-300 capitalize">
                {row.category}
              </span>
            );
          }
          if (column.key === 'frequency') {
            return (
              <span className={`text-sm font-medium ${getFrequencyColor(row.frequency)}`}>
                {row.frequency.charAt(0).toUpperCase() + row.frequency.slice(1)}
              </span>
            );
          }
          if (column.key === 'streak') {
            return (
              <span className="text-orange-400 font-medium">
                {row.streak || 0} days
              </span>
            );
          }
          if (column.key === 'totalCompletions') {
            return (
              <span className="text-white">
                {row.totalCompletions || 0}
              </span>
            );
          }
          if (column.key === 'completionRate') {
            const rate = row.completionRate || 0;
            return (
              <div className="flex items-center gap-2">
                {getTrendIcon(rate)}
                <span className={`text-sm font-medium ${
                  rate > 70 ? 'text-green-400' : rate > 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {Math.round(rate)}%
                </span>
                <div className="w-16 bg-white/10 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      rate > 70 ? 'bg-green-400' : rate > 40 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(rate, 100)}%` }}
                  />
                </div>
              </div>
            );
          }
          if (column.key === 'isActive') {
            return row.isActive ? (
              <span className="text-xs text-green-400">Active</span>
            ) : (
              <span className="text-xs text-gray-400">Inactive</span>
            );
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
        title={modalType === 'create' ? 'Create Habit' : modalType === 'edit' ? 'Edit Habit' : 'Habit Details'}
        size="lg"
        confirmText={modalType === 'view' ? 'Close' : 'Save'}
        showCancel={modalType !== 'view'}
        onConfirm={modalType === 'view' ? () => setShowModal(false) : handleSubmit}
        confirmVariant={modalType === 'view' ? 'outline' : 'gradient'}
      >
        {modalType === 'view' && selectedHabit ? (
          <HabitDetailView habit={selectedHabit} />
        ) : (
          <HabitForm
            formData={formData}
            formErrors={formErrors}
            onChange={handleFormChange}
            categories={categories}
            frequencies={frequencies}
            isEdit={modalType === 'edit'}
          />
        )}
      </AdminModal>
    </div>
  );
};

// Habit Detail View Component
const HabitDetailView = ({ habit }) => {
  const Icon = getCategoryIcon(habit.category);
  const rate = habit.completionRate || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-primary-500/10">
          <Icon className="w-12 h-12 text-primary-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{habit.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-medium ${getFrequencyColor(habit.frequency)}`}>
              {habit.frequency.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-400 capitalize">{habit.category}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className={`text-sm ${habit.isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {habit.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <p className="text-gray-300">{habit.description}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Streak</p>
          <p className="text-lg font-bold text-orange-400">{habit.streak || 0} days</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Best Streak</p>
          <p className="text-lg font-bold text-yellow-400">{habit.bestStreak || 0} days</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Completions</p>
          <p className="text-lg font-bold text-white">{habit.totalCompletions || 0}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Duration</p>
          <p className="text-lg font-bold text-white">{habit.duration || 15} min</p>
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Completion Rate</span>
          <span className={rate > 70 ? 'text-green-400' : rate > 40 ? 'text-yellow-400' : 'text-red-400'}>
            {Math.round(rate)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              rate > 70 ? 'bg-green-400' : rate > 40 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Habit Form Component
const HabitForm = ({
  formData,
  formErrors,
  onChange,
  categories,
  frequencies,
  isEdit,
}) => {
  const Icon = getCategoryIcon(formData.category);

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
            placeholder="Enter habit name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Category
          </label>
          <div className="flex gap-2">
            <div className="p-2 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-400" />
            </div>
            <select
              name="category"
              value={formData.category}
              onChange={onChange}
              className="flex-1 bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
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
          placeholder="Describe the habit..."
          required
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-400">{formErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Frequency
          </label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={onChange}
            className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {frequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Input
            label="Duration (minutes)"
            type="number"
            name="duration"
            value={formData.duration}
            onChange={onChange}
            error={formErrors.duration}
            min="1"
            max="1440"
            required
          />
        </div>
        <div>
          <Input
            label="Streak"
            type="number"
            name="streak"
            value={formData.streak}
            onChange={onChange}
            min="0"
            disabled={isEdit}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Best Streak"
            type="number"
            name="bestStreak"
            value={formData.bestStreak}
            onChange={onChange}
            min="0"
            disabled={isEdit}
          />
        </div>
        <div>
          <Input
            label="Total Completions"
            type="number"
            name="totalCompletions"
            value={formData.totalCompletions}
            onChange={onChange}
            min="0"
            disabled={isEdit}
          />
        </div>
      </div>

      <div>
        <Input
          label="Completion Rate (%)"
          type="number"
          name="completionRate"
          value={formData.completionRate}
          onChange={onChange}
          min="0"
          max="100"
          disabled={isEdit}
        />
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
const getCategoryIcon = (category) => {
  const icons = {
    general: Activity,
    health: Heart,
    fitness: Dumbbell,
    learning: BookOpen,
    productivity: Zap,
    social: Users,
    mindfulness: Brain,
    career: Briefcase,
    creative: Palette,
  };
  return icons[category] || Activity;
};

const getFrequencyColor = (frequency) => {
  const colors = {
    daily: 'text-green-400',
    weekly: 'text-blue-400',
    custom: 'text-purple-400',
  };
  return colors[frequency] || 'text-gray-400';
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
    <div className="grid grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
      ))}
    </div>
    <div className="h-16 bg-white/5 rounded-xl"></div>
    <div className="h-96 bg-white/5 rounded-xl"></div>
  </div>
);

export default AdminHabits;