// src/pages/admin/AdminPermissions.jsx
import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Save,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import { toast } from 'react-toastify';

const AdminPermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/permissions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (role, permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/permissions', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(permissions)
      });
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  const permissionGroups = [
    { key: 'users', label: 'User Management' },
    { key: 'content', label: 'Content Management' },
    { key: 'settings', label: 'System Settings' },
    { key: 'reports', label: 'Reports & Analytics' },
    { key: 'backup', label: 'Backup & Restore' },
    { key: 'logs', label: 'System Logs' },
  ];

  const roleColors = {
    admin: 'text-red-400',
    moderator: 'text-purple-400',
    user: 'text-blue-400',
    guest: 'text-gray-400',
  };

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Permission Management</h1>
          <p className="text-gray-400">Manage role-based permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="small"
            icon={RefreshCw}
            onClick={fetchPermissions}
          >
            Refresh
          </Button>
          <Button
            variant="gradient"
            size="small"
            icon={Save}
            onClick={handleSave}
            loading={isSaving}
          >
            Save Permissions
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Shield}
          label="Total Roles"
          value={Object.keys(permissions).length || 0}
          color="primary"
        />
        <AdminStatsCard
          icon={Lock}
          label="Total Permissions"
          value={Object.values(permissions).reduce((sum, p) => sum + Object.keys(p).length, 0) || 0}
          color="info"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Enabled"
          value={Object.values(permissions).reduce((sum, p) => sum + Object.values(p).filter(v => v).length, 0) || 0}
          color="success"
        />
        <AdminStatsCard
          icon={XCircle}
          label="Disabled"
          value={Object.values(permissions).reduce((sum, p) => sum + Object.values(p).filter(v => !v).length, 0) || 0}
          color="danger"
        />
      </div>

      {/* Search */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="small" icon={Filter}>
            Filter
          </Button>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="glass-effect rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Permission</th>
                {Object.keys(permissions).map((role) => (
                  <th key={role} className={`px-4 py-3 text-center text-xs font-medium ${roleColors[role] || 'text-gray-400'}`}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionGroups.map((group) => (
                <React.Fragment key={group.key}>
                  <tr className="bg-white/5">
                    <td colSpan={Object.keys(permissions).length + 1} className="px-4 py-2 text-sm font-medium text-white">
                      {group.label}
                    </td>
                  </tr>
                  {Object.keys(permissions[Object.keys(permissions)[0]] || {}).filter(p => p.startsWith(group.key)).map((permission) => (
                    <tr key={permission} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-sm text-gray-300 capitalize">
                        {permission.split('_').join(' ')}
                      </td>
                      {Object.keys(permissions).map((role) => (
                        <td key={role} className="px-4 py-3 text-center">
                          <button
                            onClick={() => handlePermissionChange(role, permission, !permissions[role]?.[permission])}
                            className={`transition ${permissions[role]?.[permission] ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-white'}`}
                          >
                            {permissions[role]?.[permission] ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-400">Legend:</span>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">Allowed</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Denied</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Set all permissions for a role
              }}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              Set All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="h-96 bg-white/5 rounded-xl"></div>
  </div>
);

export default AdminPermissions;