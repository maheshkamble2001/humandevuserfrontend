// src/pages/admin/AdminDesignCheck.jsx
import React from 'react';
import {
  Users,
  Target,
  Activity,
  Award,
  Gamepad2,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminChart from '../../components/admin/AdminChart';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AdminDesignCheck = () => {
  // Sample data
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', level: 12, rank: 'B', xp: 1250 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', level: 8, rank: 'C', xp: 850 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', level: 25, rank: 'A', xp: 3200 },
  ];

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'level', label: 'Level', sortable: true },
    { key: 'rank', label: 'Rank', sortable: true },
    { key: 'xp', label: 'XP', sortable: true },
  ];

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Design Check</h1>
          <p className="text-gray-400">Verify all admin components are working</p>
        </div>
        <Button variant="gradient" icon={Plus}>
          Add New
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Users}
          label="Total Users"
          value={1250}
          change={12}
          color="primary"
        />
        <AdminStatsCard
          icon={Target}
          label="Missions"
          value={856}
          change={8}
          color="success"
        />
        <AdminStatsCard
          icon={Activity}
          label="Habits"
          value={234}
          change={5}
          color="info"
        />
        <AdminStatsCard
          icon={Award}
          label="Achievements"
          value={567}
          change={-3}
          color="warning"
        />
      </div>

      {/* Search and Filter */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="small" icon={Filter}>
              Filter
            </Button>
            <Button variant="outline" size="small" icon={Plus}>
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminChart
          data={chartData}
          type="bar"
          xKey="name"
          yKey="value"
          title="Monthly Users"
          height={300}
        />
        <AdminChart
          data={chartData}
          type="line"
          xKey="name"
          yKey="value"
          title="User Growth"
          height={300}
        />
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={sampleData}
        onRowClick={(row) => console.log('Row clicked:', row)}
        renderCell={(column, row) => {
          if (column.key === 'status') {
            return (
              <span className={`px-2 py-1 rounded-full text-xs ${
                row.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {row.status}
              </span>
            );
          }
          if (column.key === 'rank') {
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                row.rank === 'A' ? 'bg-orange-500/20 text-orange-400' :
                row.rank === 'B' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {row.rank}
              </span>
            );
          }
          if (column.key === 'xp') {
            return <span className="text-yellow-400">{row.xp}</span>;
          }
          return row[column.key];
        }}
        actions={[
          { icon: Eye, label: 'View', onClick: (row) => console.log('View:', row) },
          { icon: Edit2, label: 'Edit', onClick: (row) => console.log('Edit:', row) },
          { icon: Trash2, label: 'Delete', onClick: (row) => console.log('Delete:', row), color: 'text-red-400 hover:text-red-300' },
        ]}
      />

      {/* Buttons */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-3">Button Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
        </div>
      </div>

      {/* Loading States */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <h3 className="text-sm font-semibold text-white mb-3">Loading States</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Loader className="w-5 h-5 text-primary-400 animate-spin" />
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
          <Button loading>Loading</Button>
          <Button variant="gradient" loading>Loading</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDesignCheck;