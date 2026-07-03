// src/pages/admin/smallData/AdminDifficulties.jsx
import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit2, Trash2, Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AdminModal from '../../components/admin/AdminModal';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import { toast } from 'react-toastify';

const AdminDifficulties = () => {
  const { user } = useAuth();
  const [difficulties, setDifficulties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [formData, setFormData] = useState({ name: '', value: 1, color: '#7d26ff', icon: 'Star', xpMultiplier: 1.0, description: '', isActive: true });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => { fetchDifficulties(); }, [searchTerm]);

  const fetchDifficulties = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/difficulties?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setDifficulties(data.difficulties || []);
    } catch (error) {
      console.error('Error fetching difficulties:', error);
      toast.error('Failed to load difficulties');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.value) errors.value = 'Value is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix form errors');
      return;
    }

    try {
      const url = modalType === 'create' ? '/api/admin/difficulties' : `/api/admin/difficulties/${selected.id}`;
      const method = modalType === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save difficulty');
      toast.success(`Difficulty ${modalType === 'create' ? 'created' : 'updated'} successfully`);
      setShowModal(false);
      fetchDifficulties();
    } catch (error) {
      console.error('Error saving difficulty:', error);
      toast.error(error.message || 'Failed to save difficulty');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete difficulty "${item.name}"?`)) return;
    try {
      await fetch(`/api/admin/difficulties/${item.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Difficulty deleted successfully');
      fetchDifficulties();
    } catch (error) {
      console.error('Error deleting difficulty:', error);
      toast.error('Failed to delete difficulty');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'value', label: 'Value', sortable: true },
    { key: 'xpMultiplier', label: 'XP Multiplier', sortable: true },
    { key: 'isActive', label: 'Active', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  if (isLoading && difficulties.length === 0) return <AdminLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold gradient-text">Difficulty Management</h1><p className="text-gray-400">Manage difficulty levels</p></div>
        <Button variant="gradient" icon={Plus} onClick={() => { setFormData({ name: '', value: 1, color: '#7d26ff', icon: 'Star', xpMultiplier: 1.0, description: '', isActive: true }); setModalType('create'); setShowModal(true); }}>Create Difficulty</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard icon={Target} label="Total Difficulties" value={difficulties.length || 0} color="primary" />
        <AdminStatsCard icon={CheckCircle} label="Active" value={difficulties.filter(c => c.isActive).length || 0} color="success" />
        <AdminStatsCard icon={XCircle} label="Inactive" value={difficulties.filter(c => !c.isActive).length || 0} color="danger" />
        <AdminStatsCard icon={Target} label="Levels" value={difficulties.length} color="info" />
      </div>

      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex gap-3">
          <Input icon={Search} placeholder="Search difficulties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
          <Button variant="outline" icon={RefreshCw} onClick={fetchDifficulties}>Refresh</Button>
        </div>
      </div>

      <AdminTable columns={columns} data={difficulties} isLoading={isLoading}
        renderCell={(column, row) => {
          if (column.key === 'name') return <span className="text-white font-medium">{row.name}</span>;
          if (column.key === 'xpMultiplier') return <span className="text-yellow-400">{row.xpMultiplier}x</span>;
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

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'create' ? 'Create Difficulty' : 'Difficulty Details'} size="lg" confirmText={modalType === 'view' ? 'Close' : 'Save'} showCancel={modalType !== 'view'} onConfirm={modalType === 'view' ? () => setShowModal(false) : handleSubmit}>
        {modalType === 'view' && selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: `${selected.color}20` }}><Target className="w-10 h-10" style={{ color: selected.color }} /></div>
              <div><h3 className="text-xl font-bold text-white">{selected.name}</h3><p className="text-gray-400">Value: {selected.value}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg"><p className="text-xs text-gray-400">XP Multiplier</p><p className="text-yellow-400">{selected.xpMultiplier}x</p></div>
              <div className="p-3 bg-white/5 rounded-lg"><p className="text-xs text-gray-400">Status</p><p className={selected.isActive ? 'text-green-400' : 'text-gray-400'}>{selected.isActive ? 'Active' : 'Inactive'}</p></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" name="name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: null }); }} error={formErrors.name} required />
              <Input label="Value" type="number" name="value" value={formData.value} onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })} error={formErrors.value} required />
            </div>
            <Input label="XP Multiplier" type="number" step="0.1" name="xpMultiplier" value={formData.xpMultiplier} onChange={(e) => setFormData({ ...formData, xpMultiplier: parseFloat(e.target.value) })} />
            <Input label="Description" name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            </div>
          </div>
        )}
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

export default AdminDifficulties;