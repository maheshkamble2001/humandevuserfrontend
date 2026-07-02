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

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMissions from './pages/admin/AdminMissions';
import AdminHabits from './pages/admin/AdminHabits';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminChallenges from './pages/admin/AdminChallenges';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

// Pages
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


function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AuthProviderWithNavigate>
            <WebSocketProvider>
              <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <SuspenseErrorBoundary>
                        <Login />
                      </SuspenseErrorBoundary>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <SuspenseErrorBoundary>
                        <Register />
                      </SuspenseErrorBoundary>
                    }
                  />

                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Dashboard />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="profile"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Profile />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="missions"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Missions />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="career"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Career />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="habits"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Habits />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="leaderboard"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Leaderboard />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="settings"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Settings />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="achievements"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Achievements />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="analytics"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Analytics />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="challenges"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Challenges />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                    <Route
                      path="community"
                      element={
                        <SuspenseErrorBoundary>
                          <RouteErrorBoundary>
                            <Community />
                          </RouteErrorBoundary>
                        </SuspenseErrorBoundary>
                      }
                    />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="missions" element={<AdminMissions />} />
                  <Route path="habits" element={<AdminHabits />} />
                  <Route path="achievements" element={<AdminAchievements />} />
                  <Route path="challenges" element={<AdminChallenges />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

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