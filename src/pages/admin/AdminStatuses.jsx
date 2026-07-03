// src/pages/admin/smallData/AdminStatuses.jsx
import React, { useState, useEffect } from 'react';
import { Activity, Plus, Edit2, Trash2, Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import AdminModal from '../../../components/admin/AdminModal';
import AdminTable from '../../../components/admin/AdminTable';
import AdminStatsCard from '../../../components/admin/AdminStatsCard';
import { toast } from 'react-toastify';

const AdminStatuses = () => {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [formData, setFormData] = useState({ name: '', type: 'user', color: '#7d26ff', backgroundColor: 'rgba(125,38,255,0.1)', icon: 'CheckCircle', order: 0, isActive: true });
  const [formErrors, setFormErrors] = useState({});

  const statusTypes = [
    { value: 'user', label: 'User' },
    { value: 'mission', label: 'Mission' },
    { value: 'habit', label: 'Habit' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'friend', label: 'Friend' },
    { value: 'post', label: 'Post' },
  ];

  useEffect(() => { fetchStatuses(); }, [searchTerm]);

  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/statuses?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setStatuses(data.statuses || []);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      toast.error('Failed to load statuses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.type) errors.type = 'Type is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix form errors');
      return;
    }

    try {
      const url = modalType === 'create' ? '/api/admin/statuses' : `/api/admin/statuses/${selected.id}`;
      const method = modalType === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save status');
      toast.success(`Status ${modalType === 'create' ? 'created' : 'updated'} successfully`);
      setShowModal(false);
      fetchStatuses();
    } catch (error) {
      console.error('Error saving status:', error);
      toast.error(error.message || 'Failed to save status');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'order', label: 'Order', sortable: true },
    { key: 'isActive', label: 'Active', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  if (isLoading && statuses.length === 0) return <AdminLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold gradient-text">Status Management</h1><p className="text-gray-400">Manage status types</p></div>
        <Button variant="gradient" icon={Plus} onClick={() => { setFormData({ name: '', type: 'user', color: '#7d26ff', backgroundColor: 'rgba(125,38,255,0.1)', icon: 'CheckCircle', order: 0, isActive: true }); setModalType('create'); setShowModal(true); }}>Create Status</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard icon={Activity} label="Total Statuses" value={statuses.length || 0} color="primary" />
        <AdminStatsCard icon={CheckCircle} label="Active" value={statuses.filter(c => c.isActive).length || 0} color="success" />
        <AdminStatsCard icon={XCircle} label="Inactive" value={statuses.filter(c => !c.isActive).length || 0} color="danger" />
        <AdminStatsCard icon={Activity} label="Types" value={statusTypes.length} color="info" />
      </div>

      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex gap-3">
          <Input icon={Search} placeholder="Search statuses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
          <Button variant="outline" icon={RefreshCw} onClick={fetchStatuses}>Refresh</Button>
        </div>
      </div>

      <AdminTable columns={columns} data={statuses} isLoading={isLoading}
        renderCell={(column, row) => {
          if (column.key === 'name') return <span className="text-white font-medium">{row.name}</span>;
          if (column.key === 'type') return <span className="text-sm text-gray-300 capitalize">{row.type}</span>;
          if (column.key === 'isActive') return row.isActive ? <span className="text-xs text-green-400">Active</span> : <span className="text-xs text-gray-400">Inactive</span>;
          if (column.key === 'actions') return (
            <div className="flex items-center gap-2">
              <button onClick={() => { setSelected(row); setModalType('view'); setShowModal(true); }} className="p-1 hover:bg-white/10 rounded"><Eye className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => { setSelected(row); setFormData(row); setModalType('edit'); setShowModal(true); }} className="p-1 hover:bg-white/10 rounded"><Edit2 className="w-4 h-4 text-blue-400" /></button>
              <button onClick={() => handleDelete(row)} className="p-1 hover:bg-white/10 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          );
          return row[column.key];
        }}
      />

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'create' ? 'Create Status' : 'Status Details'} size="lg" confirmText={modalType === 'view' ? 'Close' : 'Save'} showCancel={modalType !== 'view'} onConfirm={modalType === 'view' ? () => setShowModal(false) : handleSubmit}>
        {/* Similar modal content as others */}
      </AdminModal>
    </div>
  );
};

const AdminLoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between"><div><div className="h-8 w-48 bg-white/5 rounded"></div><div className="h-4 w-64 bg-white/5 rounded mt-2"></div></div><div className="h-10 w-32 bg-white/5 rounded"></div></div>
    <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl"></div>)}</div>
    <div className="h-96 bg-white/5 rounded-xl"></div>
  </div>
);

export default AdminStatuses;