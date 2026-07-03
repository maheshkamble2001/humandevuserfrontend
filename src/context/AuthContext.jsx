// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshing, setRefreshing] = useState(false);
  
  const navigateRef = useRef(null);

  const setNavigate = (navigate) => {
    navigateRef.current = navigate;
  };

  const getNavigate = () => {
    if (!navigateRef.current) {
      console.warn('Navigate not available yet');
      return () => {};
    }
    return navigateRef.current;
  };

  // Fetch user profile
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get('/user/profile');
      setUser(response.data);
      setError(null);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setError('Cannot connect to server. Please check if backend is running.');
        toast.error('Server connection failed');
      } else if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } else {
        setError(error.response?.data?.message || 'Failed to fetch user');
      }
      setLoading(false);
      throw error;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        await fetchUser();
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchUser]);

  // Token refresh interval
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      if (!refreshing) {
        try {
          setRefreshing(true);
          const response = await axios.post('/auth/refresh');
          const { token: newToken } = response.data;
          
          localStorage.setItem('token', newToken);
          setToken(newToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
          console.error('Token refresh failed:', error);
          if (error.response?.status === 401) {
            logout();
          }
        } finally {
          setRefreshing(false);
        }
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [token, refreshing]);

  // 🔥 UPDATED LOGIN - Role-based redirect
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success(`Welcome back, ${user.displayName || 'Player'}! 🎮`);
      
      // 🔥 ROLE-BASED REDIRECT
      const navigate = getNavigate();
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
      return { success: true, user };
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success(`Welcome to Life RPG, ${user.displayName || 'Player'}! 🎮`);
      
      const navigate = getNavigate();
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
      return { success: true, user };
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = useCallback(async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
      setUser(null);
      setError(null);
      
      toast.info('Logged out successfully');
      
      const navigate = getNavigate();
      navigate('/login');
    }
  }, []);

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await axios.put('/user/profile', profileData);
      const updatedUser = response.data;
      
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await axios.put('/user/password', { currentPassword, newPassword });
      
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await axios.post('/auth/forgot-password', { email });
      
      toast.success('Password reset email sent! Check your inbox.');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (resetToken, newPassword) => {
    try {
      setLoading(true);
      await axios.post('/auth/reset-password', { token: resetToken, newPassword });
      
      toast.success('Password reset successfully! Please login.');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Refresh token manually
  const refreshToken = async () => {
    try {
      setRefreshing(true);
      const response = await axios.post('/auth/refresh');
      const { token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);
      if (error.response?.status === 401) {
        logout();
      }
      return { success: false, error: error.message };
    } finally {
      setRefreshing(false);
    }
  };

  // Update user data
  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check permissions
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const permissions = user.permissions || [];
    return permissions.includes(permission) || permissions.includes('admin');
  }, [user]);

  // Check role
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role || user.role === 'admin';
  }, [user]);

  const value = {
    user,
    loading,
    error,
    token,
    isAuthenticated: !!user && !!token,
    refreshing,
    setNavigate,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    refreshToken,
    updateUser,
    clearError,
    hasPermission,
    hasRole,
    isAdmin: user?.role === 'admin',
    isPremium: user?.subscription === 'premium' || user?.subscription === 'pro',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Navigation wrapper component to inject navigate
export const AuthProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    if (authContext?.setNavigate) {
      authContext.setNavigate(navigate);
    }
  }, [authContext, navigate]);

  return children;
};

export default AuthProvider;