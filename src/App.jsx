// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthProviderWithNavigate } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';

// Error Boundaries
import ErrorBoundary from './components/ErrorBoundary';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import SuspenseErrorBoundary from './components/SuspenseErrorBoundary';

// Layout
import Layout from './components/layout/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMissions from './pages/admin/AdminMissions';
import AdminHabits from './pages/admin/AdminHabits';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminChallenges from './pages/admin/AdminChallenges';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminDesignCheck from './pages/admin/AdminDesignCheck';
import AdminRoles from './pages/admin/roles/index';
import AdminPermissions from './pages/admin/AdminPermissions';
import AdminDifficulties from './pages/admin/AdminDifficulties';
import AdminRarities from './pages/admin/AdminRarities';
import AdminCategories from './pages/admin/AdminCategories';

// Pages (lazy loaded)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Missions = lazy(() => import('./pages/Missions'));
const Career = lazy(() => import('./pages/Career'));
const Habits = lazy(() => import('./pages/Habits'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Community = lazy(() => import('./pages/Community'));

// Loading component
const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AuthProviderWithNavigate>
            <WebSocketProvider>
              <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<Dashboard />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="missions" element={<Missions />} />
                      <Route path="career" element={<Career />} />
                      <Route path="habits" element={<Habits />} />
                      <Route path="leaderboard" element={<Leaderboard />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="achievements" element={<Achievements />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="challenges" element={<Challenges />} />
                      <Route path="community" element={<Community />} />
                    </Route>

                    {/* Admin Routes - Use relative paths (no leading /) */}
                    <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="missions" element={<AdminMissions />} />
                      <Route path="habits" element={<AdminHabits />} />
                      <Route path="achievements" element={<AdminAchievements />} />
                      <Route path="challenges" element={<AdminChallenges />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="roles" element={<AdminRoles />} />
                      <Route path="permissions" element={<AdminPermissions />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="difficulties" element={<AdminDifficulties />} />
                      <Route path="rarities" element={<AdminRarities />} />
                      {/* ✅ FIXED: Use relative path without leading / */}
                      <Route path="design-check" element={<AdminDesignCheck />} />
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>

                <ToastContainer
                  position="bottom-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
              </div>
            </WebSocketProvider>
          </AuthProviderWithNavigate>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;