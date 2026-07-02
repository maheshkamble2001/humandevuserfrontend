// src/components/admin/AdminChart.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
//   Radar,
  ScatterChart as ScatterChartIcon,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { toast } from 'react-toastify';

const AdminChart = ({
  data = [],
  type = 'bar',
  xKey = 'name',
  yKey = 'value',
  yKey2,
  yKey3,
  height = 300,
  title,
  loading = false,
  colors = ['#7d26ff', '#ff0064', '#00d4ff', '#00ff88', '#ffd700', '#ff6b6b'],
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  stacked = false,
  percentage = false,
  onDataPointClick,
  onRefresh,
  className = '',
  animationDuration = 500,
}) => {
  const [chartType, setChartType] = useState(type);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredData, setHoveredData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  // Available chart types
  const chartTypes = [
    { value: 'bar', label: 'Bar', icon: BarChart3 },
    { value: 'line', label: 'Line', icon: LineChartIcon },
    { value: 'area', label: 'Area', icon: AreaChartIcon },
    { value: 'pie', label: 'Pie', icon: PieChartIcon },
    { value: 'radar', label: 'Radar', icon: Radar },
    { value: 'scatter', label: 'Scatter', icon: ScatterChartIcon },
  ];

  // Color palette
  const colorPalette = [
    '#7d26ff', '#ff0064', '#00d4ff', '#00ff88', '#ffd700', 
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7',
    '#00b894', '#fd79a8', '#fdcb6e', '#6dd5fa', '#ff7675'
  ];

  // Handle chart type change
  const handleChartTypeChange = (type) => {
    setChartType(type);
    toast.info(`Switched to ${type} chart`);
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
      toast.success('Chart refreshed');
    }
  };

  // Handle export
  const handleExport = () => {
    if (chartRef.current) {
      // Export as SVG
      const svg = chartRef.current.querySelector('svg');
      if (svg) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chart-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Chart exported');
      }
    }
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect rounded-lg p-3 border border-white/20 shadow-xl">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-300">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render chart based on type
  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const commonProps = {
      dataKey: yKey,
      stroke: colors[0],
      fill: colors[0],
      fillOpacity: 0.3,
      animationDuration,
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis 
              dataKey={xKey} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              domain={percentage ? [0, 100] : ['auto', 'auto']}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
            {stacked ? (
              <>
                <Bar dataKey={yKey} stackId="a" fill={colors[0]} />
                {yKey2 && <Bar dataKey={yKey2} stackId="a" fill={colors[1]} />}
                {yKey3 && <Bar dataKey={yKey3} stackId="a" fill={colors[2]} />}
              </>
            ) : (
              <>
                <Bar 
                  dataKey={yKey} 
                  fill={colors[0]} 
                  onClick={(data) => onDataPointClick?.(data)}
                  onMouseEnter={(data) => setHoveredData(data)}
                  onMouseLeave={() => setHoveredData(null)}
                />
                {yKey2 && <Bar dataKey={yKey2} fill={colors[1]} />}
                {yKey3 && <Bar dataKey={yKey3} fill={colors[2]} />}
              </>
            )}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis 
              dataKey={xKey} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              domain={percentage ? [0, 100] : ['auto', 'auto']}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
            <Line 
              type="monotone" 
              dataKey={yKey} 
              stroke={colors[0]} 
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              onClick={(data) => onDataPointClick?.(data)}
            />
            {yKey2 && <Line type="monotone" dataKey={yKey2} stroke={colors[1]} strokeWidth={2} />}
            {yKey3 && <Line type="monotone" dataKey={yKey3} stroke={colors[2]} strokeWidth={2} />}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis 
              dataKey={xKey} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              domain={percentage ? [0, 100] : ['auto', 'auto']}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
            <Area 
              type="monotone" 
              dataKey={yKey} 
              stroke={colors[0]} 
              fill={colors[0]} 
              fillOpacity={0.2}
              onClick={(data) => onDataPointClick?.(data)}
            />
            {yKey2 && <Area type="monotone" dataKey={yKey2} stroke={colors[1]} fill={colors[1]} fillOpacity={0.2} />}
            {yKey3 && <Area type="monotone" dataKey={yKey3} stroke={colors[2]} fill={colors[2]} fillOpacity={0.2} />}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart {...chartProps}>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={colors[0]}
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              onClick={(data) => onDataPointClick?.(data)}
              onMouseEnter={(data) => setHoveredData(data)}
              onMouseLeave={() => setHoveredData(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colorPalette[index % colorPalette.length]} 
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart {...chartProps}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis 
              dataKey={xKey} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
            <Radar 
              name={yKey} 
              dataKey={yKey} 
              stroke={colors[0]} 
              fill={colors[0]} 
              fillOpacity={0.3}
              onClick={(data) => onDataPointClick?.(data)}
            />
            {yKey2 && <Radar name={yKey2} dataKey={yKey2} stroke={colors[1]} fill={colors[1]} fillOpacity={0.3} />}
            {yKey3 && <Radar name={yKey3} dataKey={yKey3} stroke={colors[2]} fill={colors[2]} fillOpacity={0.3} />}
          </RadarChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
            <XAxis 
              dataKey={xKey} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              dataKey={yKey} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
            <Scatter 
              name={yKey} 
              data={data} 
              fill={colors[0]} 
              onClick={(data) => onDataPointClick?.(data)}
            />
            {yKey2 && <Scatter name={yKey2} dataKey={yKey2} fill={colors[1]} />}
            {yKey3 && <Scatter name={yKey3} dataKey={yKey3} fill={colors[2]} />}
          </ScatterChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Chart type not supported</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="glass-effect rounded-xl p-6 border border-white/20" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading chart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6 border border-white/20" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`
        glass-effect rounded-xl p-4 border border-white/20 transition-all
        ${isFullscreen ? 'fixed inset-4 z-50' : ''}
        ${className}
      `}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {title && (
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          )}
          {hoveredData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-gray-400"
            >
              Hover: {hoveredData[xKey]} - {hoveredData[yKey]}
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Chart Type Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              const isActive = chartType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => handleChartTypeChange(type.value)}
                  className={`
                    p-1.5 rounded transition
                    ${isActive 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }
                  `}
                  title={type.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded hover:bg-white/10 transition text-gray-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="w-full" style={{ height: isFullscreen ? 'calc(100% - 60px)' : 'calc(100% - 50px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart Stats */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <div>
          <span>Total: {data.length} records</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-green-400">
              {data.length > 1 ? '+12%' : '0%'}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-red-400" />
            <span className="text-red-400">
              {data.length > 1 ? '-3%' : '0%'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminChart;