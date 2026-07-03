// src/pages/admin/AdminChallenges.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2,
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
  Play,
  Pause,
  Timer,
  BarChart3,
  Activity,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

const AdminChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    byType: {},
    byDifficulty: {},
  });

  // Challenge form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'trivia',
    difficulty: 'medium',
    xpReward: 50,
    timeLimit: 60,
    score: 0,
    status: 'pending',
    metadata: '',
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Challenge types
  const challengeTypes = [
    { value: 'trivia', label: 'Trivia', icon: Brain },
    { value: 'speed', label: 'Speed', icon: Zap },
    { value: 'fitness', label: 'Fitness', icon: Dumbbell },
    { value: 'coding', label: 'Coding', icon: Code },
    { value: 'memory', label: 'Memory', icon: Brain },
    { value: 'social', label: 'Social', icon: Users },
    { value: 'creative', label: 'Creative', icon: Palette },
    { value: 'strategy', label: 'Strategy', icon: Shield },
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'hard', label: 'Hard', color: 'text-orange-400' },
    { value: 'expert', label: 'Expert', color: 'text-red-400' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-gray-400' },
    { value: 'active', label: 'Active', color: 'text-blue-400' },
    { value: 'completed', label: 'Completed', color: 'text-green-400' },
    { value: 'failed', label: 'Failed', color: 'text-red-400' },
  ];

  useEffect(() => {
    fetchChallenges();
  }, [currentPage, filter, searchTerm]);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/challenges?page=${currentPage}&limit=20&filter=${filter}&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setChallenges(data.challenges || []);
      setTotalPages(data.totalPages || 1);
      setStats(data.stats || {
        total: 0,
        active: 0,
        completed: 0,
        failed: 0,
        pending: 0,
        byType: {},
        byDifficulty: {},
      });
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (challenge) => {
    setSelectedChallenge(challenge);
    setModalType('view');
    setShowModal(true);
  };

  const handleEdit = (challenge) => {
    setSelectedChallenge(challenge);
    setFormData({
      name: challenge.name || '',
      description: challenge.description || '',
      type: challenge.type || 'trivia',
      difficulty: challenge.difficulty || 'medium',
      xpReward: challenge.xpReward || 50,
      timeLimit: challenge.timeLimit || 60,
      score: challenge.score || 0,
      status: challenge.status || 'pending',
      metadata: challenge.metadata ? JSON.stringify(challenge.metadata, null, 2) : '',
      isActive: challenge.isActive !== undefined ? challenge.isActive : true,
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      type: 'trivia',
      difficulty: 'medium',
      xpReward: 50,
      timeLimit: 60,
      score: 0,
      status: 'pending',
      metadata: '',
      isActive: true,
    });
    setModalType('create');
    setShowModal(true);
  };

  const handleDelete = async (challenge) => {
    if (!window.confirm(`Are you sure you want to delete "${challenge.name}"?`)) return;

    try {
      await fetch(`/api/admin/challenges/${challenge.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Challenge deleted successfully');
      fetchChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      toast.error('Failed to delete challenge');
    }
  };

  const handleCopy = (challenge) => {
    const text = `${challenge.name}: ${challenge.description} (${challenge.difficulty})`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      await fetch('/api/admin/challenges/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          challengeIds: selectedIds
        })
      });
      toast.success(`Successfully performed ${action} on ${selectedIds.length} challenges`);
      setSelectedChallenges([]);
      fetchChallenges();
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
    if (formData.timeLimit < 10) errors.timeLimit = 'Time limit must be at least 10 seconds';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix form errors');
      return;
    }

    try {
      const url = modalType === 'create' 
        ? '/api/admin/challenges' 
        : `/api/admin/challenges/${selectedChallenge.id}`;
      
      const method = modalType === 'create' ? 'POST' : 'PUT';

      const data = {
        ...formData,
        metadata: formData.metadata ? JSON.parse(formData.metadata) : {},
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
        throw new Error(error.message || 'Failed to save challenge');
      }

      toast.success(`Challenge ${modalType === 'create' ? 'created' : 'updated'} successfully`);
      setShowModal(false);
      fetchChallenges();
    } catch (error) {
      console.error('Error saving challenge:', error);
      toast.error(error.message || 'Failed to save challenge');
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
    { key: 'type', label: 'Type', sortable: true },
    { key: 'difficulty', label: 'Difficulty', sortable: true },
    { key: 'xpReward', label: 'XP Reward', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'participants', label: 'Participants', sortable: true },
    { key: 'isActive', label: 'Active', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
  ];

  const getTypeIcon = (type) => {
    const icons = {
      trivia: Brain,
      speed: Zap,
      fitness: Dumbbell,
      coding: Code,
      memory: Brain,
      social: Users,
      creative: Palette,
      strategy: Shield,
    };
    return icons[type] || Gamepad2;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-400',
      medium: 'text-yellow-400',
      hard: 'text-orange-400',
      expert: 'text-red-400',
    };
    return colors[difficulty] || 'text-gray-400';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-gray-400',
      active: 'text-blue-400',
      completed: 'text-green-400',
      failed: 'text-red-400',
    };
    return colors[status] || 'text-gray-400';
  };

  if (isLoading && challenges.length === 0) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Challenge Management</h1>
          <p className="text-gray-400">Manage all challenges in the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" icon={Download}>
            Export
          </Button>
          <Button variant="outline" size="small" icon={Upload}>
            Import
          </Button>
          <Button variant="gradient" size="small" icon={Plus} onClick={handleCreate}>
            Create Challenge
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatsCard
          icon={Gamepad2}
          label="Total Challenges"
          value={stats.total || 0}
          color="primary"
        />
        <AdminStatsCard
          icon={Play}
          label="Active"
          value={stats.active || 0}
          color="info"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completed || 0}
          color="success"
        />
        <AdminStatsCard
          icon={XCircle}
          label="Failed"
          value={stats.failed || 0}
          color="danger"
        />
        <AdminStatsCard
          icon={Clock}
          label="Pending"
          value={stats.pending || 0}
          color="warning"
        />
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search challenges..."
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
              <option value="all">All Types</option>
              {challengeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Difficulties</option>
              {difficultyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenges Table */}
      <AdminTable
        columns={columns}
        data={challenges}
        isLoading={isLoading}
        onRowClick={handleView}
        selectedRows={selectedChallenges}
        onSelectRows={setSelectedChallenges}
        bulkActions={[
          { label: 'Activate', value: 'activate', icon: Play },
          { label: 'Deactivate', value: 'deactivate', icon: Pause },
          { label: 'Delete', value: 'delete', icon: Trash2 },
        ]}
        onBulkAction={handleBulkAction}
        renderCell={(column, row) => {
          if (column.key === 'name') {
            const Icon = getTypeIcon(row.type);
            return (
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-400" />
                <span className="text-white">{row.name}</span>
              </div>
            );
          }
          if (column.key === 'type') {
            return (
              <span className="text-sm text-gray-300 capitalize">
                {row.type}
              </span>
            );
          }
          if (column.key === 'difficulty') {
            return (
              <span className={`text-sm font-medium ${getDifficultyColor(row.difficulty)}`}>
                {row.difficulty.charAt(0).toUpperCase() + row.difficulty.slice(1)}
              </span>
            );
          }
          if (column.key === 'status') {
            return (
              <span className={`text-sm font-medium ${getStatusColor(row.status)}`}>
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </span>
            );
          }
          if (column.key === 'xpReward') {
            return <span className="text-yellow-400">{row.xpReward} XP</span>;
          }
          if (column.key === 'participants') {
            return (
              <span className="text-white">
                {row.participants || 0}
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
        title={modalType === 'create' ? 'Create Challenge' : modalType === 'edit' ? 'Edit Challenge' : 'Challenge Details'}
        size="lg"
        confirmText={modalType === 'view' ? 'Close' : 'Save'}
        showCancel={modalType !== 'view'}
        onConfirm={modalType === 'view' ? () => setShowModal(false) : handleSubmit}
        confirmVariant={modalType === 'view' ? 'outline' : 'gradient'}
      >
        {modalType === 'view' && selectedChallenge ? (
          <ChallengeDetailView challenge={selectedChallenge} />
        ) : (
          <ChallengeForm
            formData={formData}
            formErrors={formErrors}
            onChange={handleFormChange}
            challengeTypes={challengeTypes}
            difficultyLevels={difficultyLevels}
            statusOptions={statusOptions}
            isEdit={modalType === 'edit'}
          />
        )}
      </AdminModal>
    </div>
  );
};

// Challenge Detail View Component
const ChallengeDetailView = ({ challenge }) => {
  const Icon = getTypeIcon(challenge.type);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-primary-500/10">
          <Icon className="w-12 h-12 text-primary-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{challenge.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-sm text-gray-400 capitalize">{challenge.type}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className={`text-sm ${getStatusColor(challenge.status)}`}>
              {challenge.status}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className={`text-sm ${challenge.isActive ? 'text-green-400' : 'text-gray-400'}`}>
              {challenge.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <p className="text-gray-300">{challenge.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">XP Reward</p>
          <p className="text-lg font-bold text-yellow-400">{challenge.xpReward} XP</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Time Limit</p>
          <p className="text-lg font-bold text-white">{challenge.timeLimit}s</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">Participants</p>
          <p className="text-lg font-bold text-white">{challenge.participants || 0}</p>
        </div>
      </div>

      {challenge.metadata && Object.keys(challenge.metadata).length > 0 && (
        <div className="p-4 bg-white/5 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Metadata</h4>
          <pre className="text-xs text-gray-400 whitespace-pre-wrap">
            {JSON.stringify(challenge.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Challenge Form Component
const ChallengeForm = ({
  formData,
  formErrors,
  onChange,
  challengeTypes,
  difficultyLevels,
  statusOptions,
  isEdit,
}) => {
  const Icon = getTypeIcon(formData.type);

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
            placeholder="Enter challenge name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Type
          </label>
          <div className="flex gap-2">
            <div className="p-2 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-400" />
            </div>
            <select
              name="type"
              value={formData.type}
              onChange={onChange}
              className="flex-1 bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {challengeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
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
          placeholder="Describe the challenge..."
          required
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-400">{formErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={onChange}
            className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {difficultyLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
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
            label="Time Limit (seconds)"
            type="number"
            name="timeLimit"
            value={formData.timeLimit}
            onChange={onChange}
            error={formErrors.timeLimit}
            min="10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Input
            label="Score"
            type="number"
            name="score"
            value={formData.score}
            onChange={onChange}
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Metadata (JSON)
        </label>
        <textarea
          name="metadata"
          value={formData.metadata}
          onChange={onChange}
          rows="3"
          className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
          placeholder='{"category": "sports", "rounds": 3}'
        />
        <p className="text-xs text-gray-400 mt-1">Enter metadata as a JSON object</p>
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
const getTypeIcon = (type) => {
  const icons = {
    trivia: Brain,
    speed: Zap,
    fitness: Dumbbell,
    coding: Code,
    memory: Brain,
    social: Users,
    creative: Palette,
    strategy: Shield,
  };
  return icons[type] || Gamepad2;
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-orange-400',
    expert: 'text-red-400',
  };
  return colors[difficulty] || 'text-gray-400';
};

const getStatusColor = (status) => {
  const colors = {
    pending: 'text-gray-400',
    active: 'text-blue-400',
    completed: 'text-green-400',
    failed: 'text-red-400',
  };
  return colors[status] || 'text-gray-400';
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

export default AdminChallenges;