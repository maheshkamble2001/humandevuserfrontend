// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import { 
  setUser, 
  clearUser, 
  updateXP, 
  updateLevel, 
  updateRank,
  showLevelUp,
  showRankUp
} from '../store/slices/userSlice';
import { clearMessages, resetAI } from '../store/slices/aiSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Define fetchUser first - BEFORE the useEffect that uses it
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get('/user/profile');
      const userData = response.data;
      setUserState(userData);
      dispatch(setUser(userData));
      setError(null);
      setLoading(false);
      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        // Don't call logout here as it creates a circular dependency
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUserState(null);
        dispatch(clearUser());
        setLoading(false);
      } else {
        setError(error.response?.data?.message || 'Failed to fetch user');
        setLoading(false);
      }
      throw error;
    }
  }, [dispatch]);

  // Initialize auth state - NOW fetchUser is defined
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
  }, [fetchUser]); // Add fetchUser as dependency

  // Login
  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      // Store token
      localStorage.setItem('token', token);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user state
      setUserState(userData);
      dispatch(setUser(userData));
      setLoading(false);

      toast.success(`Welcome back, ${userData.displayName || 'Player'}! 🎮`);
      
      // Navigate to dashboard
      navigate('/');
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [dispatch, navigate]);

  // Register
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/auth/register', userData);
      const { token, user: newUser } = response.data;

      // Store token
      localStorage.setItem('token', token);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user state
      setUserState(newUser);
      dispatch(setUser(newUser));
      setLoading(false);

      toast.success(`Welcome to Life RPG, ${newUser.displayName || 'Player'}! 🎮`);
      
      // Navigate to dashboard
      navigate('/');
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [dispatch, navigate]);

  // Logout
  const logout = useCallback(async () => {
    try {
      // Call logout API
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('rememberMe');
      
      // Clear axios headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Clear state
      setToken(null);
      setUserState(null);
      setLoading(false);
      dispatch(clearUser());
      dispatch(clearMessages());
      dispatch(resetAI());
      
      toast.info('Logged out successfully');
      
      // Navigate to login
      navigate('/login');
    }
  }, [dispatch, navigate]);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      const response = await axios.put('/user/profile', updates);
      const updatedUser = response.data;
      
      setUserState(updatedUser);
      dispatch(setUser(updatedUser));
      setLoading(false);
      
      toast.success('Profile updated successfully!');
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await axios.put('/auth/password', { currentPassword, newPassword });
      
      toast.success('Password changed successfully!');
      setLoading(false);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Request password reset
  const requestPasswordReset = useCallback(async (email) => {
    try {
      setLoading(true);
      await axios.post('/auth/forgot-password', { email });
      
      toast.success('Password reset email sent! Check your inbox.');
      setLoading(false);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Reset password with token
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      setLoading(true);
      await axios.post('/auth/reset-password', { token, newPassword });
      
      toast.success('Password reset successfully! Please login.');
      setLoading(false);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post('/auth/refresh');
      const { token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return { success: false, error: 'Session expired' };
    }
  }, [logout]);

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Get user role/permissions
  const getUserRole = useCallback(() => {
    return user?.role || 'user';
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const permissions = user.permissions || [];
    return permissions.includes(permission) || permissions.includes('admin');
  }, [user]);

  // Update user XP (from WebSocket events)
  const updateUserXP = useCallback((xpGained) => {
    dispatch(updateXP(xpGained));
    // Refresh user data to get updated level/rank
    fetchUser();
  }, [dispatch, fetchUser]);

  // Handle level up event
  const handleLevelUp = useCallback((levelData) => {
    dispatch(showLevelUp(levelData));
    toast.success(`🎉 Level Up! You've reached Level ${levelData.newLevel}!`);
    // Refresh user data
    fetchUser();
  }, [dispatch, fetchUser]);

  // Handle rank up event
  const handleRankUp = useCallback((rankData) => {
    dispatch(showRankUp(rankData));
    toast.success(`🏆 Rank Up! You've reached Rank ${rankData.newRank}!`);
    // Refresh user data
    fetchUser();
  }, [dispatch, fetchUser]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    user,
    loading,
    error,
    token,
    isAuthenticated,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    refreshToken,
    fetchUser,
    getUserRole,
    hasPermission,
    updateUserXP,
    handleLevelUp,
    handleRankUp,
    clearError,
    
    // Status helpers
    isAdmin: user?.role === 'admin',
    isPremium: user?.subscription === 'premium',
    hasPremium: user?.subscription === 'premium' || user?.subscription === 'pro',
  };
};

export default useAuth;