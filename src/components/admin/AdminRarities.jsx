// src/pages/admin/smallData/AdminRarities.jsx
import React, { useState, useEffect } from 'react';
import { Diamond, Plus, Edit2, Trash2, Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import AdminModal from '../../../components/admin/AdminModal';
import AdminTable from '../../../components/admin/AdminTable';
import AdminStatsCard from '../../../components/admin/AdminStatsCard';
import { toast } from 'react-toastify';

const AdminRarities = () => {
  const { user } = useAuth();
  const [rarities, setRarities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [formData, setFormData] = useState({ name: '', level: 1, color: '#7d26ff', backgroundColor: 'rgba(125,38,255,0.1)', icon: 'Star', dropRate: 100, description: '', isActive: true });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => { fetchRarities(); }, [searchTerm]);

  const fetchRarities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/rarities?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setRarities(data.rarities || []);
    } catch (error) {
      console.error('Error fetching rarities:', error);
      toast.error('Failed to load rarities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.level) errors.level = 'Level is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix form errors');
      return;
    }

    try {
      const url = modalType === 'create' ? '/api/admin/rarities' : `/api/admin/rarities/${selected.id}`;
      const method = modalType === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save rarity');
      toast.success(`Rarity ${modalType === 'create' ? 'created' : 'updated'} successfully`);
      setShowModal(false);
      fetchRarities();
    } catch (error) {
      console.error('Error saving rarity:', error);
      toast.error(error.message || 'Failed to save rarity');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'level', label: 'Level', sortable: true },
    { key: 'dropRate', label: 'Drop Rate', sortable: true },
    { key: 'isActive', label: 'Active', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  if (isLoading && rarities.length === 0) return <AdminLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold gradient-text">Rarity Management</h1><p className="text-gray-400">Manage rarity levels</p></div>
        <Button variant="gradient" icon={Plus} onClick={() => { setFormData({ name: '', level: 1, color: '#7d26ff', backgroundColor: 'rgba(125,38,255,0.1)', icon: 'Star', dropRate: 100, description: '', isActive: true }); setModalType('create'); setShowModal(true); }}>Create Rarity</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard icon={Diamond} label="Total Rarities" value={rarities.length || 0} color="primary" />
        <AdminStatsCard icon={CheckCircle} label="Active" value={rarities.filter(c => c.isActive).length || 0} color="success" />
        <AdminStatsCard icon={XCircle} label="Inactive" value={rarities.filter(c => !c.isActive).length || 0} color="danger" />
        <AdminStatsCard icon={Diamond} label="Levels" value={rarities.length} color="info" />
      </div>

      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex gap-3">
          <Input icon={Search} placeholder="Search rarities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
          <Button variant="outline" icon={RefreshCw} onClick={fetchRarities}>Refresh</Button>
        </div>
      </div>

      <AdminTable columns={columns} data={rarities} isLoading={isLoading}
        renderCell={(column, row) => {
          if (column.key === 'name') return <span className="text-white font-medium">{row.name}</span>;
          if (column.key === 'dropRate') return <span className="text-purple-400">{row.dropRate}%</span>;
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

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'create' ? 'Create Rarity' : 'Rarity Details'} size="lg" confirmText={modalType === 'view' ? 'Close' : 'Save'} showCancel={modalType !== 'view'} onConfirm={modalType === 'view' ? () => setShowModal(false) : handleSubmit}>
        {modalType === 'view' && selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: `${selected.backgroundColor}` }}><Diamond className="w-10 h-10" style={{ color: selected.color }} /></div>
              <div><h3 className="text-xl font-bold text-white">{selected.name}</h3><p className="text-gray-400">Level: {selected.level}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg"><p className="text-xs text-gray-400">Drop Rate</p><p className="text-purple-400">{selected.dropRate}%</p></div>
              <div className="p-3 bg-white/5 rounded-lg"><p className="text-xs text-gray-400">Status</p><p className={selected.isActive ? 'text-green-400' : 'text-gray-400'}>{selected.isActive ? 'Active' : 'Inactive'}</p></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" name="name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: null }); }} error={formErrors.name} required />
              <Input label="Level" type="number" name="level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} error={formErrors.level} required />
            </div>
            <Input label="Drop Rate (%)" type="number" name="dropRate" value={formData.dropRate} onChange={(e) => setFormData({ ...formData, dropRate: parseFloat(e.target.value) })} />
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

export default AdminRarities;