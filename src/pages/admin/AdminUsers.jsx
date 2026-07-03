// src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  User,
  Mail,
  Calendar,
  Shield,
  Crown,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Ban,
  RefreshCw,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Loader,
  Users, // ✅ ADD THIS IMPORT
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filter, searchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users?page=${currentPage}&limit=20&filter=${filter}&search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    try {
      await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: bulkAction,
          userIds: selectedUsers
        })
      });
      toast.success(`Successfully performed ${bulkAction} on selected users`);
      setSelectedUsers([]);
      setBulkAction('');
      fetchUsers();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'displayName', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'level', label: 'Level', sortable: true },
    { key: 'rank', label: 'Rank', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Joined', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-500/20 text-green-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      banned: 'bg-red-500/20 text-red-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
    };
    return badges[status] || badges.active;
  };

  const getRankBadge = (rank) => {
    const badges = {
      'E': 'bg-gray-500/20 text-gray-400',
      'D': 'bg-blue-500/20 text-blue-400',
      'C': 'bg-green-500/20 text-green-400',
      'B': 'bg-yellow-500/20 text-yellow-400',
      'A': 'bg-orange-500/20 text-orange-400',
      'S': 'bg-red-500/20 text-red-400',
      'SS': 'bg-purple-500/20 text-purple-400',
      'Mythic': 'bg-pink-500/20 text-pink-400',
    };
    return badges[rank] || badges['E'];
  };

  if (isLoading && users.length === 0) {
    return (
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
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">User Management</h1>
          <p className="text-gray-400">Manage all users of the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" icon={Download}>
            Export
          </Button>
          <Button variant="outline" size="small" icon={Upload}>
            Import
          </Button>
          <Button variant="gradient" size="small" icon={Plus}>
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Users}
          label="Total Users"
          value={users.length || 0}
          color="primary"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Active"
          value={users.filter(u => u.status === 'active').length || 0}
          color="success"
        />
        <AdminStatsCard
          icon={XCircle}
          label="Inactive"
          value={users.filter(u => u.status === 'inactive').length || 0}
          color="danger"
        />
        <AdminStatsCard
          icon={Crown}
          label="Admins"
          value={users.filter(u => u.role === 'admin').length || 0}
          color="warning"
        />
      </div>

      {/* Filters */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search users..."
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
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Bulk Actions</option>
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
              <option value="ban">Ban</option>
              <option value="unban">Unban</option>
              <option value="delete">Delete</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedUsers.length === 0}
              className="px-4 py-2 bg-primary-500 rounded-lg text-white hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <AdminTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        onRowClick={handleViewUser}
        selectedRows={selectedUsers}
        onSelectRows={setSelectedUsers}
        renderCell={(column, row) => {
          if (column.key === 'status') {
            return (
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(row.status)}`}>
                {row.status}
              </span>
            );
          }
          if (column.key === 'rank') {
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRankBadge(row.rank)}`}>
                {row.rank}
              </span>
            );
          }
          if (column.key === 'actions') {
            return (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewUser(row);
                  }}
                  className="p-1 hover:bg-white/10 rounded transition"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditUser(row);
                  }}
                  className="p-1 hover:bg-white/10 rounded transition"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(row.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            );
          }
          return row[column.key];
        }}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, users.length + ((currentPage - 1) * 20))} of {users.length + ((currentPage - 1) * 20)} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="px-3 py-2 text-sm text-gray-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'view' ? 'User Details' : 'Edit User'}
        size="lg"
      >
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            mode={modalType}
            onClose={() => setShowModal(false)}
            onUpdate={fetchUsers}
          />
        )}
      </AdminModal>
    </div>
  );
};

// User Detail Modal Component
const UserDetailModal = ({ user, mode, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      toast.success('User updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'view') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user.displayName?.[0] || 'U'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{user.displayName}</h3>
            <p className="text-gray-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(user.status)}`}>
                {user.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRankBadge(user.rank)}`}>
                {user.rank}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Level</p>
            <p className="text-lg font-bold text-white">{user.level}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Total XP</p>
            <p className="text-lg font-bold text-yellow-400">{user.xp?.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Joined</p>
            <p className="text-sm text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-xs text-gray-400">Streak</p>
            <p className="text-lg font-bold text-orange-400">{user.streak || 0} days</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="gradient" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => window.open(`/profile/${user.id}`, '_blank')}>
            View Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Display Name"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
      />
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="gradient" className="flex-1" loading={isLoading}>
          Save Changes
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// Helper functions
const getStatusBadge = (status) => {
  const badges = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    banned: 'bg-red-500/20 text-red-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
  };
  return badges[status] || badges.active;
};

const getRankBadge = (rank) => {
  const badges = {
    'E': 'bg-gray-500/20 text-gray-400',
    'D': 'bg-blue-500/20 text-blue-400',
    'C': 'bg-green-500/20 text-green-400',
    'B': 'bg-yellow-500/20 text-yellow-400',
    'A': 'bg-orange-500/20 text-orange-400',
    'S': 'bg-red-500/20 text-red-400',
    'SS': 'bg-purple-500/20 text-purple-400',
    'Mythic': 'bg-pink-500/20 text-pink-400',
  };
  return badges[rank] || badges['E'];
};

export default AdminUsers;