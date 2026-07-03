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
  searchable = true,
  filterable = true,
  selectable = true,
  sortable = true,
  pagination = true,
  showActions = true,
  showCheckboxes = true,
  showRowNumbers = true,
  emptyMessage = 'No data available',
  loadingMessage = 'Loading...',
  className = '',
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  responsive = true,
  onBulkAction,
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
  const tableRef = useRef(null);
  const searchTimeout = useRef(null);

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
      active: 'bg-green-500/20 text-green-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-blue-500/20 text-blue-400',
      failed: 'bg-red-500/20 text-red-400',
      banned: 'bg-red-500/20 text-red-400',
      verified: 'bg-green-500/20 text-green-400',
      unverified: 'bg-yellow-500/20 text-yellow-400',
    };
    return badges[status] || 'bg-gray-500/20 text-gray-400';
  };

  // Get rank badge
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

  // Render cell content
  const renderCell = (column, row, rowIndex) => {
    const value = row[column.key];
    
    // Custom renderer
    if (column.render) {
      return column.render(value, row, rowIndex);
    }
    
    // Status column
    if (column.key === 'status') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(value)}`}>
          {value || 'Unknown'}
        </span>
      );
    }
    
    // Rank column
    if (column.key === 'rank') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRankBadge(value)}`}>
          {value || 'E'}
        </span>
      );
    }
    
    // Date column
    if (column.key === 'createdAt' || column.key === 'updatedAt' || column.key === 'date') {
      return value ? new Date(value).toLocaleDateString() : '-';
    }
    
    // Boolean column
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="w-4 h-4 text-green-400" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400" />
      );
    }
    
    // Default
    return value || '-';
  };

  // Get visible data
  const getVisibleData = () => {
    // Apply search
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

  if (isLoading) {
    return (
      <div className="glass-effect rounded-xl border border-white/20 overflow-hidden">
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-effect rounded-xl border border-white/20 overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          {searchable && (
            <div className="flex-1 min-w-[200px]">
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
                  {/* Options would be generated based on column */}
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
      <div className={`${responsive ? 'overflow-x-auto' : ''}`}>
        <table 
          ref={tableRef}
          className={`w-full text-sm ${
            compact ? 'text-xs' : ''
          } ${bordered ? 'border-collapse' : ''}`}
        >
          {/* Table Header */}
          <thead className="bg-white/5 border-b border-white/10">
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
                    className={`px-3 py-3 text-left text-xs font-medium text-gray-400 ${
                      column.sortable ? 'cursor-pointer hover:text-white' : ''
                    } ${column.width ? `w-${column.width}` : ''}`}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{column.label}</span>
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                );
              })}
              
              {/* Actions column */}
              {showActions && (actions.length > 0 || onView || onEdit || onDelete) && (
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-400 w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
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
                        ${isSelected ? 'bg-primary-500/10' : ''}
                        ${onRowClick ? 'cursor-pointer' : ''}
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
                            className={`px-3 py-3 ${compact ? 'py-2' : ''}`}
                          >
                            {renderCell(column, row, rowIndex)}
                          </td>
                        );
                      })}
                      
                      {/* Actions */}
                      {showActions && (actions.length > 0 || onView || onEdit || onDelete) && (
                        <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            {onView && (
                              <button
                                onClick={() => onView(row)}
                                className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(row)}
                                className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            {onCopy && (
                              <button
                                onClick={() => onCopy(row)}
                                className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
                                title="Copy"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            )}
                            {actions.map((action, index) => {
                              const Icon = action.icon;
                              return (
                                <button
                                  key={index}
                                  onClick={() => action.onClick(row)}
                                  className={`p-1 rounded hover:bg-white/10 transition ${action.color || 'text-gray-400 hover:text-white'}`}
                                  title={action.label}
                                >
                                  <Icon className="w-4 h-4" />
                                </button>
                              );
                            })}
                            {/* Expand button */}
                            <button
                              onClick={() => handleRowExpand(row.id)}
                              className="p-1 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
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
                        <td colSpan={columns.length + (selectable && showCheckboxes ? 2 : 1) + (showRowNumbers ? 1 : 0) + (showActions ? 1 : 0)}>
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
                  className="px-4 py-8 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-8 h-8 text-gray-500" />
                    <p>{emptyMessage}</p>
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              {selectedRows.length} selected
            </span>
            <div className="flex items-center gap-2">
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
        <div className="p-3 border-t border-white/10 flex items-center justify-between">
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
          <div className="bg-dark-800 rounded-xl max-w-md w-full border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Toggle Columns</h3>
            <div className="space-y-2">
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
  // Date renderer
  date: (value) => value ? new Date(value).toLocaleDateString() : '-',
  
  // DateTime renderer
  dateTime: (value) => value ? new Date(value).toLocaleString() : '-',
  
  // Status renderer
  status: (value) => {
    const colors = {
      active: 'bg-green-500/20 text-green-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-blue-500/20 text-blue-400',
      failed: 'bg-red-500/20 text-red-400',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[value] || 'bg-gray-500/20 text-gray-400'}`}>
        {value || 'Unknown'}
      </span>
    );
  },
  
  // Rank renderer
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
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[value] || colors['E']}`}>
        {value || 'E'}
      </span>
    );
  },
  
  // Boolean renderer
  boolean: (value) => value ? (
    <CheckCircle className="w-4 h-4 text-green-400" />
  ) : (
    <XCircle className="w-4 h-4 text-red-400" />
  ),
  
  // Avatar renderer
  avatar: (value) => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
      <span className="text-xs font-bold text-white">
        {value?.[0]?.toUpperCase() || 'U'}
      </span>
    </div>
  ),
  
  // Money renderer
  money: (value) => `$${value?.toLocaleString() || 0}`,
  
  // Percentage renderer
  percentage: (value) => `${value || 0}%`,
  
  // Progress bar renderer
  progress: (value) => (
    <div className="w-full bg-white/10 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
        style={{ width: `${Math.min(value || 0, 100)}%` }}
      />
    </div>
  ),
};

export default AdminTable;