// src/pages/admin/smallData/AdminCategories.jsx
import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  X,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Loader,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AdminModal from '../../components/admin/AdminModal';
import AdminTable from '../../components/admin/AdminTable';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import { toast } from 'react-toastify';

const AdminCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'mission',
    description: '',
    icon: 'FolderOpen',
    color: '#7d26ff',
    order: 0,
    isActive: true,
    parentId: null,
  });

  const [formErrors, setFormErrors] = useState({});

  const categoryTypes = [
    { value: 'mission', label: 'Mission' },
    { value: 'habit', label: 'Habit' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'post', label: 'Post' },
  ];

  const iconOptions = [
    'FolderOpen', 'Target', 'Activity', 'Award', 'Gamepad2',
    'BookOpen', 'Heart', 'Brain', 'Users', 'Star',
    'Sparkles', 'Zap', 'Flame', 'Trophy', 'Crown',
    'Gem', 'Medal', 'Shield', 'Briefcase', 'Palette',
  ];

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/categories?page=${currentPage}&limit=20&search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setCategories(data.categories || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix form errors');
      return;
    }

    try {
      const url = modalType === 'create' ? '/api/admin/categories' : `/api/admin/categories/${selectedCategory.id}`;
      const method = modalType === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save category');

      toast.success(`Category ${modalType === 'create' ? 'created' : 'updated'} successfully`);
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete category "${category.name}"?`)) return;

    try {
      await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'order', label: 'Order', sortable: true },
    { key: 'isActive', label: 'Active', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  if (isLoading && categories.length === 0) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Category Management</h1>
          <p className="text-gray-400">Manage all categories</p>
        </div>
        <Button variant="gradient" icon={Plus} onClick={() => {
          setFormData({ name: '', slug: '', type: 'mission', description: '', icon: 'FolderOpen', color: '#7d26ff', order: 0, isActive: true, parentId: null });
          setModalType('create');
          setShowModal(true);
        }}>Create Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard icon={FolderOpen} label="Total Categories" value={categories.length || 0} color="primary" />
        <AdminStatsCard icon={CheckCircle} label="Active" value={categories.filter(c => c.isActive).length || 0} color="success" />
        <AdminStatsCard icon={XCircle} label="Inactive" value={categories.filter(c => !c.isActive).length || 0} color="danger" />
        <AdminStatsCard icon={FolderOpen} label="Types" value={categoryTypes.length} color="info" />
      </div>

      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex gap-3">
          <Input icon={Search} placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
          <Button variant="outline" icon={RefreshCw} onClick={fetchCategories}>Refresh</Button>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        renderCell={(column, row) => {
          if (column.key === 'name') {
            return <span className="text-white font-medium">{row.name}</span>;
          }
          if (column.key === 'type') {
            return <span className="text-sm text-gray-300 capitalize">{row.type}</span>;
          }
          if (column.key === 'isActive') {
            return row.isActive ? <span className="text-xs text-green-400">Active</span> : <span className="text-xs text-gray-400">Inactive</span>;
          }
          if (column.key === 'actions') {
            return (
              <div className="flex items-center gap-2">
                <button onClick={() => { setSelectedCategory(row); setModalType('view'); setShowModal(true); }} className="p-1 hover:bg-white/10 rounded"><Eye className="w-4 h-4 text-gray-400" /></button>
                <button onClick={() => { setSelectedCategory(row); setFormData(row); setModalType('edit'); setShowModal(true); }} className="p-1 hover:bg-white/10 rounded"><Edit2 className="w-4 h-4 text-blue-400" /></button>
                <button onClick={() => handleDelete(row)} className="p-1 hover:bg-white/10 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            );
          }
          return row[column.key];
        }}
      />

      <AdminModal isOpen={showModal} onClose={() => setShowModal(false)} title={modalType === 'create' ? 'Create Category' : 'Category Details'} size="lg" confirmText={modalType === 'view' ? 'Close' : 'Save'} showCancel={modalType !== 'view'} onConfirm={modalType === 'view' ? () => setShowModal(false) : handleSubmit}>
        {modalType === 'view' && selectedCategory ? (
          <CategoryDetailView category={selectedCategory} />
        ) : (
          <CategoryForm formData={formData} formErrors={formErrors} onChange={(e) => {
            const { name, value, type, checked } = e.target;
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
            if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
          }} categoryTypes={categoryTypes} iconOptions={iconOptions} isEdit={modalType === 'edit'} />
        )}
      </AdminModal>
    </div>
  );
};

const CategoryDetailView = ({ category }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-2xl" style={{ backgroundColor: `${category.color}20` }}>
        <FolderOpen className="w-10 h-10" style={{ color: category.color }} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{category.name}</h3>
        <p className="text-gray-400">Slug: {category.slug}</p>
      </div>
    </div>
    <div className="p-4 bg-white/5 rounded-lg"><p className="text-gray-300">{category.description || 'No description'}</p></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 bg-white/5 rounded-lg"><p className="text-xs text-gray-400">Type</p><p className="text-white capitalize">{category.type}</p></div>
      <div className="p-3 bg-white/5 rounded-lg"><p className="text-xs text-gray-400">Order</p><p className="text-white">{category.order}</p></div>
    </div>
  </div>
);

const CategoryForm = ({ formData, formErrors, onChange, categoryTypes, iconOptions, isEdit }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <Input label="Name" name="name" value={formData.name} onChange={onChange} error={formErrors.name} required />
      <Input label="Slug" name="slug" value={formData.slug} onChange={onChange} error={formErrors.slug} required />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
      <select name="type" value={formData.type} onChange={onChange} className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10">
        {categoryTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
      <textarea name="description" value={formData.description} onChange={onChange} rows="2" className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Icon</label>
        <select name="icon" value={formData.icon} onChange={onChange} className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10">
          {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Color</label>
        <div className="flex gap-2">
          <input type="color" name="color" value={formData.color} onChange={onChange} className="w-12 h-12 rounded-lg cursor-pointer" />
          <input type="text" name="color" value={formData.color} onChange={onChange} className="flex-1 bg-white/5 rounded-lg px-4 py-2.5 text-white border border-white/10" />
        </div>
      </div>
    </div>
    <Input label="Order" type="number" name="order" value={formData.order} onChange={onChange} />
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={onChange} />
        <span className="text-sm text-gray-300">Active</span>
      </label>
    </div>
  </div>
);

const AdminLoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between"><div><div className="h-8 w-48 bg-white/5 rounded"></div><div className="h-4 w-64 bg-white/5 rounded mt-2"></div></div><div className="h-10 w-32 bg-white/5 rounded"></div></div>
    <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl"></div>)}</div>
    <div className="h-96 bg-white/5 rounded-xl"></div>
  </div>
);

export default AdminCategories;