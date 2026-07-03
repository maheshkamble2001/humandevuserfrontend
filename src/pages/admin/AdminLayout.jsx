// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, Settings, LogOut, Search, Crown } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-800/95 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text hidden sm:block">Admin Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-40"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/10 transition">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.displayName?.[0] || 'A'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.displayName || 'Admin'}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 transition ml-2"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;