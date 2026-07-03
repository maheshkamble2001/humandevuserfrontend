// src/components/admin/AdminTable.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Columns,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Link,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Star,
  Award,
  Crown,
  Shield,
  Zap,
  Flame,
  Heart,
  Brain,
  Target,
  Activity,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2 as TrashIcon,
  Eye as EyeIcon,
  Plus,
} from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';

const AdminTable = ({
  columns = [],
  data = [],
  isLoading = false,
  onRowClick,
  onRowSelect,
  selectedRows = [],
  onSelectRows,
  onSort,
  onSearch,
  onFilter,
  onPageChange,
  onExport,
  onImport,
  onRefresh,
  onDelete,
  onEdit,
  onView,
  onCopy,
  actions = [],
  bulkActions = [],
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 1,
  searchable = false,
  filterable = false,
  selectable = true,
  sortable = true,
  pagination = true,
  showActions = true,
  showCheckboxes = false,
  showRowNumbers = true,
  emptyMessage = 'No data available',
  loadingMessage = 'Loading...',
  className = '',
  striped = true,
  hoverable = true,
  bordered = true,
  compact = false,
  responsive = true,
  onBulkAction,
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  showView = true,
  showEdit = true,
  showDelete = true,
  showCopy = true,
  stickyHeader = false,
  maxHeight = '100%',
  rowActions = [],
  renderRowActions,
  customCellRenderers = {},
  emptyIcon = AlertCircle,
  emptyImage,
  emptyAction,
  emptyActionText = 'Add New',
  // Mobile responsive props
  mobileBreakpoint = 768,
  cardViewOnMobile = true,
  showFiltersOnMobile = false,
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(columns.map(c => c.key));
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showRowActions, setShowRowActions] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < mobileBreakpoint);
  const tableRef = useRef(null);
  const searchTimeout = useRef(null);

  // Handle resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint]);

  // Handle sort
  const handleSort = (column) => {
    if (!sortable || !column.sortable) return;

    let direction = 'asc';
    if (sortColumn === column.key) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortColumn(column.key);
    setSortDirection(direction);
    
    if (onSort) {
      onSort(column.key, direction);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, 300);
  };

  // Handle filter
  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    if (onFilter) {
      onFilter({ ...filters, [key]: value });
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    const newSelected = selectedAll ? [] : data.map(row => row.id);
    if (onSelectRows) {
      onSelectRows(newSelected);
    }
    setSelectedAll(!selectedAll);
  };

  // Handle row select
  const handleRowSelect = (rowId) => {
    const newSelected = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];
    
    if (onSelectRows) {
      onSelectRows(newSelected);
    }
    setSelectedAll(newSelected.length === data.length);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Handle row expand
  const handleRowExpand = (rowId) => {
    setExpandedRows(prev =>
      prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  // Get sort icon
  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return null;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3" />;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-500/20 text-green-400 border border-green-500/20',
      inactive: 'bg-gray-500/20 text-gray-400 border border-gray-500/20',
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20',
      completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
      failed: 'bg-red-500/20 text-red-400 border border-red-500/20',
      banned: 'bg-red-500/20 text-red-400 border border-red-500/20',
      verified: 'bg-green-500/20 text-green-400 border border-green-500/20',
      unverified: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20',
    };
    return badges[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
  };

  // Get rank badge
  const getRankBadge = (rank) => {
    const badges = {
      'E': 'bg-gray-500/20 text-gray-400 border border-gray-500/20',
      'D': 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
      'C': 'bg-green-500/20 text-green-400 border border-green-500/20',
      'B': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20',
      'A': 'bg-orange-500/20 text-orange-400 border border-orange-500/20',
      'S': 'bg-red-500/20 text-red-400 border border-red-500/20',
      'SS': 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
      'Mythic': 'bg-pink-500/20 text-pink-400 border border-pink-500/20',
    };
    return badges[rank] || badges['E'];
  };

  // Render cell content with custom renderer support
  const renderCell = (column, row, rowIndex) => {
    const value = row[column.key];
    
    // Check for custom renderer in column config
    if (column.render) {
      return column.render(value, row, rowIndex);
    }
    
    // Check for custom cell renderers map
    if (customCellRenderers[column.key]) {
      return customCellRenderers[column.key](value, row, rowIndex);
    }
    
    // Check for custom renderer by type
    if (column.type === 'status') {
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(value)}`}>
          {value || 'Unknown'}
        </span>
      );
    }
    
    if (column.type === 'rank') {
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRankBadge(value)}`}>
          {value || 'E'}
        </span>
      );
    }
    
    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString() : '-';
    }
    
    if (column.type === 'datetime') {
      return value ? new Date(value).toLocaleString() : '-';
    }
    
    if (column.type === 'boolean') {
      return value ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400" />
      );
    }
    
    if (column.type === 'avatar') {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {value?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
      );
    }
    
    if (column.type === 'money') {
      return <span className="font-medium text-green-400">${value?.toLocaleString() || 0}</span>;
    }
    
    if (column.type === 'percentage') {
      return <span className="font-medium text-blue-400">{value || 0}%</span>;
    }
    
    if (column.type === 'progress') {
      const val = Math.min(value || 0, 100);
      return (
        <div className="w-full max-w-[120px]">
          <div className="flex justify-between text-xs text-gray-400 mb-0.5">
            <span>{val}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
                val > 70 ? 'bg-green-400' : val > 40 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      );
    }
    
    if (column.type === 'badge') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400 border border-primary-500/20">
          {value || 'Unknown'}
        </span>
      );
    }
    
    // Default with truncation for long text
    if (value && typeof value === 'string' && value.length > 50) {
      return (
        <div className="relative group">
          <span className="line-clamp-2 break-words">{value}</span>
          {value.length > 50 && (
            <span className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-dark-800 text-xs text-white rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-normal max-w-[300px] z-10 shadow-xl border border-white/10">
              {value}
            </span>
          )}
        </div>
      );
    }
    
    return value !== undefined && value !== null ? value : '-';
  };

  // Get visible data
  const getVisibleData = () => {
    let filteredData = data;
    if (searchTerm) {
      filteredData = data.filter(row => {
        return columns.some(col => {
          const value = row[col.key];
          if (value && typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          if (value && typeof value === 'number') {
            return value.toString().includes(searchTerm);
          }
          return false;
        });
      });
    }
    return filteredData;
  };

  const visibleData = getVisibleData();
  const hasData = visibleData && visibleData.length > 0;

  // Default actions
  const defaultRowActions = [
    {
      icon: EyeIcon,
      label: 'View',
      color: 'text-gray-400 hover:text-white',
      show: showView,
      onClick: onView,
    },
    {
      icon: Pencil,
      label: 'Edit',
      color: 'text-blue-400 hover:text-blue-300',
      show: showEdit,
      onClick: onEdit,
    },
    {
      icon: TrashIcon,
      label: 'Delete',
      color: 'text-red-400 hover:text-red-300',
      show: showDelete,
      onClick: onDelete,
    },
    {
      icon: Copy,
      label: 'Copy',
      color: 'text-gray-400 hover:text-white',
      show: showCopy,
      onClick: onCopy,
    },
  ];

  if (isLoading) {
    return (
      <div className="glass-effect rounded-xl border border-white/10 overflow-hidden">
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Mobile Card View
  if (isMobile && cardViewOnMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile Toolbar */}
        <div className="glass-effect rounded-xl p-4 border border-white/10">
          <div className="flex flex-col gap-3">
            {searchable && (
              <Input
                icon={Search}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            )}
            <div className="flex flex-wrap gap-2">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              {onExport && (
                <button
                  onClick={onExport}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
              >
                <Columns className="w-4 h-4" />
              </button>
              {bulkActions.length > 0 && selectedRows.length > 0 && (
                <span className="text-xs text-gray-400 ml-auto self-center">
                  {selectedRows.length} selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3">
          {hasData ? (
            visibleData.map((row, index) => (
              <motion.div
                key={row.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="glass-effect rounded-xl p-4 border border-white/10 hover:border-white/20 transition"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {columns.slice(0, 2).map((col) => (
                      <div key={col.key} className="mb-1">
                        {col.key === columns[0].key && (
                          <div className="flex items-center gap-2">
                            {renderCell(col, row, index)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {selectable && showCheckboxes && (
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="w-4 h-4 mt-1 bg-white/5 border border-white/20 rounded focus:ring-primary-500 flex-shrink-0"
                    />
                  )}
                </div>

                {/* Card Body */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {columns.slice(2, 6).map((col) => (
                    <div key={col.key} className="text-sm">
                      <span className="text-xs text-gray-400 block">{col.label}:</span>
                      <span className="text-white break-words">{renderCell(col, row, index)}</span>
                    </div>
                  ))}
                </div>

                {/* Card Actions */}
                {showActions && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-1">
                    {onView && showView && (
                      <button
                        onClick={() => onView(row)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && showEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && showDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                    {actions.map((action, idx) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => action.onClick(row)}
                          className={`p-1.5 rounded-lg hover:bg-white/10 transition ${action.color || 'text-gray-400 hover:text-white'}`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Selection indicator */}
                {selectedRows.includes(row.id) && (
                  <div className="mt-2 text-xs text-primary-400">✓ Selected</div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="glass-effect rounded-xl p-12 text-center border border-white/10">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-white/5 rounded-full">
                  {React.createElement(emptyIcon, { className: "w-12 h-12 text-gray-500" })}
                </div>
                <p className="text-sm text-gray-400">{emptyMessage}</p>
                {emptyAction && (
                  <Button variant="gradient" size="small" onClick={emptyAction} icon={Plus}>
                    {emptyActionText}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <span className="px-2 py-2 text-sm text-gray-400">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className={`glass-effect rounded-xl border border-white/10 overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          {searchable && (
            <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
              <Input
                icon={Search}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
          )}
          
          {/* Filters */}
          {filterable && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
                title="Toggle columns"
              >
                <Columns className="w-4 h-4" />
              </button>
              {Object.keys(filters).map((key) => (
                <select
                  key={key}
                  value={filters[key] || ''}
                  onChange={(e) => handleFilter(key, e.target.value)}
                  className="bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All</option>
                </select>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            {onImport && (
              <button
                onClick={onImport}
                className="p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                title="Import"
              >
                <Upload className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div 
        className={`${responsive ? 'overflow-x-auto' : ''}`}
        style={{ maxHeight }}
      >
        <table 
          ref={tableRef}
          className={`w-full text-sm ${
            compact ? 'text-xs' : ''
          } ${bordered ? 'border-collapse' : ''}`}
        >
          {/* Table Header */}
          <thead className={`
            bg-white/5 border-b border-white/10
            ${stickyHeader ? 'sticky top-0 z-10 backdrop-blur-sm' : ''}
            ${headerClassName}
          `}>
            <tr>
              {/* Checkbox column */}
              {selectable && showCheckboxes && (
                <th className="px-3 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 bg-white/5 border border-white/20 rounded focus:ring-primary-500"
                  />
                </th>
              )}
              
              {/* Row number column */}
              {showRowNumbers && (
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 w-10">
                  #
                </th>
              )}
              
              {/* Data columns */}
              {columns.map((column) => {
                if (!visibleColumns.includes(column.key)) return null;
                
                return (
                  <th
                    key={column.key}
                    className={`
                      px-3 py-3 text-left text-xs font-medium text-gray-400
                      ${column.sortable ? 'cursor-pointer hover:text-white' : ''}
                      ${column.width ? `min-w-[${column.width}]` : ''}
                      ${column.align === 'center' ? 'text-center' : ''}
                      ${column.align === 'right' ? 'text-right' : ''}
                    `}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-1">
                      {column.icon && <column.icon className="w-3 h-3" />}
                      <span className="truncate">{column.label}</span>
                      {column.sortable && getSortIcon(column.key)}
                      {column.info && (
                        <span className="text-gray-500 cursor-help" title={column.info}>
                          <AlertCircle className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              
              {/* Actions column */}
              {showActions && (actions.length > 0 || onView || onEdit || onDelete) && (
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-400 min-w-[120px]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className={rowClassName}>
            {hasData ? (
              visibleData.map((row, rowIndex) => {
                const isSelected = selectedRows.includes(row.id);
                const isExpanded = expandedRows.includes(row.id);
                const isHovered = hoveredRow === row.id;
                
                return (
                  <React.Fragment key={row.id || rowIndex}>
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: rowIndex * 0.02 }}
                      className={`
                        border-b border-white/5 transition
                        ${hoverable ? 'hover:bg-white/5' : ''}
                        ${striped && rowIndex % 2 === 0 ? 'bg-white/5' : ''}
                        ${isSelected ? 'bg-primary-500/10 border-primary-500/20' : ''}
                        ${onRowClick ? 'cursor-pointer' : ''}
                        ${cellClassName}
                      `}
                      onClick={() => onRowClick?.(row)}
                      onMouseEnter={() => setHoveredRow(row.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Checkbox */}
                      {selectable && showCheckboxes && (
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRowSelect(row.id)}
                            className="w-4 h-4 bg-white/5 border border-white/20 rounded focus:ring-primary-500"
                          />
                        </td>
                      )}
                      
                      {/* Row number */}
                      {showRowNumbers && (
                        <td className="px-3 py-3 text-xs text-gray-400">
                          {(currentPage - 1) * pageSize + rowIndex + 1}
                        </td>
                      )}
                      
                      {/* Data cells */}
                      {columns.map((column) => {
                        if (!visibleColumns.includes(column.key)) return null;
                        
                        return (
                          <td
                            key={column.key}
                            className={`
                              px-3 py-3 ${compact ? 'py-2' : ''}
                              ${column.align === 'center' ? 'text-center' : ''}
                              ${column.align === 'right' ? 'text-right' : ''}
                              max-w-[300px] truncate
                            `}
                          >
                            {renderCell(column, row, rowIndex)}
                          </td>
                        );
                      })}
                      
                      {/* Actions */}
                      {showActions && (actions.length > 0 || onView || onEdit || onDelete) && (
                        <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            {/* Default actions */}
                            {onView && showView && (
                              <button
                                onClick={() => onView(row)}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                                title="View"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            )}
                            {onEdit && showEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && showDelete && (
                              <button
                                onClick={() => onDelete(row)}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-red-400"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                            {onCopy && showCopy && (
                              <button
                                onClick={() => onCopy(row)}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                                title="Copy"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            )}
                            
                            {/* Custom actions */}
                            {actions.map((action, index) => {
                              const Icon = action.icon;
                              return (
                                <button
                                  key={index}
                                  onClick={() => action.onClick(row)}
                                  className={`p-1.5 rounded-lg hover:bg-white/10 transition ${action.color || 'text-gray-400 hover:text-white'}`}
                                  title={action.label}
                                >
                                  <Icon className="w-4 h-4" />
                                </button>
                              );
                            })}
                            
                            {/* More actions dropdown */}
                            {(rowActions.length > 0 || renderRowActions) && (
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowRowActions(showRowActions === row.id ? null : row.id);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                                  title="More Actions"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                                
                                {showRowActions === row.id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-dark-800 rounded-lg shadow-xl border border-white/10 overflow-hidden z-50">
                                    <div className="py-1">
                                      {renderRowActions ? (
                                        renderRowActions(row, () => setShowRowActions(null))
                                      ) : (
                                        rowActions.map((action, idx) => {
                                          const Icon = action.icon;
                                          return (
                                            <button
                                              key={idx}
                                              onClick={() => {
                                                action.onClick(row);
                                                setShowRowActions(null);
                                              }}
                                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                                            >
                                              <Icon className="w-4 h-4" />
                                              {action.label}
                                            </button>
                                          );
                                        })
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Expand button */}
                            <button
                              onClick={() => handleRowExpand(row.id)}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                              title="Expand"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                    
                    {/* Expanded row */}
                    {isExpanded && row.expandedContent && (
                      <tr>
                        <td colSpan={
                          columns.length + 
                          (selectable && showCheckboxes ? 1 : 0) + 
                          (showRowNumbers ? 1 : 0) + 
                          (showActions ? 1 : 0)
                        }>
                          <div className="p-4 bg-white/5 border-t border-white/5">
                            {typeof row.expandedContent === 'function' 
                              ? row.expandedContent(row)
                              : row.expandedContent
                            }
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length + 
                    (selectable && showCheckboxes ? 1 : 0) + 
                    (showRowNumbers ? 1 : 0) + 
                    (showActions ? 1 : 0)
                  }
                  className="px-4 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    {emptyImage ? (
                      <img src={emptyImage} alt="Empty" className="w-32 h-32 opacity-50" />
                    ) : (
                      <div className="p-4 bg-white/5 rounded-full">
                        {React.createElement(emptyIcon, { className: "w-12 h-12 text-gray-500" })}
                      </div>
                    )}
                    <p className="text-sm">{emptyMessage}</p>
                    {emptyAction && (
                      <Button 
                        variant="gradient" 
                        size="small" 
                        onClick={emptyAction}
                        icon={Plus}
                      >
                        {emptyActionText}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      {selectable && selectedRows.length > 0 && bulkActions.length > 0 && (
        <div className="p-3 border-t border-white/10 bg-primary-500/5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-400">
              {selectedRows.length} selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {bulkActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    size="small"
                    variant="outline"
                    onClick={() => onBulkAction?.(action.value, selectedRows)}
                  >
                    {Icon && <Icon className="w-3 h-3 mr-1" />}
                    {action.label}
                  </Button>
                );
              })}
            </div>
            <button
              onClick={() => onSelectRows?.([])}
              className="ml-auto text-sm text-gray-400 hover:text-white transition"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="text-sm text-gray-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Column Selector Modal */}
      {showColumnSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl max-w-md w-full border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Toggle Columns</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {columns.map((column) => (
                <label
                  key={column.key}
                  className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => {
                      setVisibleColumns(prev =>
                        prev.includes(column.key)
                          ? prev.filter(k => k !== column.key)
                          : [...prev, column.key]
                      );
                    }}
                    className="w-4 h-4 bg-white/5 border border-white/20 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-300">{column.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="gradient"
                className="flex-1"
                onClick={() => setShowColumnSelector(false)}
              >
                Apply
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setVisibleColumns(columns.map(c => c.key));
                  setShowColumnSelector(false);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Pre-built column renderers
export const TableRenderer = {
  date: (value) => value ? new Date(value).toLocaleDateString() : '-',
  dateTime: (value) => value ? new Date(value).toLocaleString() : '-',
  status: (value) => {
    const colors = {
      active: 'bg-green-500/20 text-green-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-blue-500/20 text-blue-400',
      failed: 'bg-red-500/20 text-red-400',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-500/20 text-gray-400'}`}>
        {value || 'Unknown'}
      </span>
    );
  },
  rank: (value) => {
    const colors = {
      'E': 'bg-gray-500/20 text-gray-400',
      'D': 'bg-blue-500/20 text-blue-400',
      'C': 'bg-green-500/20 text-green-400',
      'B': 'bg-yellow-500/20 text-yellow-400',
      'A': 'bg-orange-500/20 text-orange-400',
      'S': 'bg-red-500/20 text-red-400',
      'SS': 'bg-purple-500/20 text-purple-400',
      'Mythic': 'bg-pink-500/20 text-pink-400',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors[value] || colors['E']}`}>
        {value || 'E'}
      </span>
    );
  },
  boolean: (value) => value ? (
    <CheckCircle className="w-4 h-4 text-green-400" />
  ) : (
    <XCircle className="w-4 h-4 text-red-400" />
  ),
  avatar: (value) => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
      <span className="text-xs font-bold text-white">
        {value?.[0]?.toUpperCase() || 'U'}
      </span>
    </div>
  ),
  money: (value) => `$${value?.toLocaleString() || 0}`,
  percentage: (value) => `${value || 0}%`,
  progress: (value) => (
    <div className="w-full bg-white/10 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
        style={{ width: `${Math.min(value || 0, 100)}%` }}
      />
    </div>
  ),
  badge: (value, row, index, color = 'primary') => {
    const colors = {
      primary: 'bg-primary-500/20 text-primary-400',
      success: 'bg-green-500/20 text-green-400',
      warning: 'bg-yellow-500/20 text-yellow-400',
      danger: 'bg-red-500/20 text-red-400',
      info: 'bg-blue-500/20 text-blue-400',
      gray: 'bg-gray-500/20 text-gray-400',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.primary}`}>
        {value || 'Unknown'}
      </span>
    );
  },
  link: (value, row, index, hrefKey = 'href') => {
    if (!value) return '-';
    const href = row[hrefKey] || '#';
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 hover:underline">
        {value}
      </a>
    );
  },
  json: (value) => {
    if (!value) return '-';
    return (
      <div className="relative group">
        <pre className="text-xs text-gray-300 max-h-16 overflow-y-auto p-2 bg-white/5 rounded">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  },
  tags: (value) => {
    if (!value || !Array.isArray(value) || value.length === 0) return '-';
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((tag, i) => (
          <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-primary-500/20 text-primary-400">
            {tag}
          </span>
        ))}
      </div>
    );
  },
  image: (value) => {
    if (!value) return '-';
    return (
      <img src={value} alt="Preview" className="w-8 h-8 object-cover rounded-lg" />
    );
  },
  actionButton: (value, row, index, actionConfig) => {
    const { label, icon: Icon, onClick, color = 'primary', variant = 'outline' } = actionConfig || {};
    if (!value) return '-';
    return (
      <Button
        size="small"
        variant={variant}
        onClick={() => onClick?.(row)}
        className={`text-${color}-400 border-${color}-400/20 hover:bg-${color}-400/10`}
      >
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {label || value}
      </Button>
    );
  },
};

export default AdminTable;