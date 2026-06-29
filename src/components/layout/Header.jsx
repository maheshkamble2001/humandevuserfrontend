// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Zap,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useWebSocket } from '../../context/WebSocketContext';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { socket } = useWebSocket();
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (data) => {
        setNotifications(prev => [data, ...prev]);
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-dark-900/50 backdrop-blur-lg border-b border-white/10 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:inline">
              Life RPG
            </span>
          </Link>
          <div className="relative hidden lg:flex">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search missions, habits..."
              className="pl-9 pr-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-dark-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
                <div className="p-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 10).map((notification, index) => (
                      <div key={index} className="p-3 hover:bg-white/5 transition border-b border-white/5 last:border-0">
                        <p className="text-sm text-white">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-white/10">
                    <button className="w-full text-center text-sm text-primary-400 hover:text-primary-300">
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.displayName?.[0] || 'U'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
                <div className="p-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-white">{user?.displayName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-white/5 transition text-sm text-gray-300"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-white/5 transition text-sm text-gray-300"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-white/5 transition text-sm text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;