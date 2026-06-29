// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/layout/Layout';
import { WebSocketProvider } from './context/WebSocketContext';
// false
// Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Missions from './pages/Missions';
import Career from './pages/Career';
import Habits from './pages/Habits';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

// NEW PAGES
import Achievements from './pages/Achievements';
import Analytics from './pages/Analytics';
import Challenges from './pages/Challenges';
import Community from './pages/Community';

// Components
import AIAssistant from './components/AIAssistant';
import { ProtectedRoute } from './components/common/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={
              // <ProtectedRoute>
                <Layout />
              // </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="missions" element={<Missions />} />
              <Route path="career" element={<Career />} />
              <Route path="habits" element={<Habits />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="settings" element={<Settings />} />
              
              {/* NEW ROUTES */}
              <Route path="achievements" element={<Achievements />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="community" element={<Community />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <AIAssistant />
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
    </BrowserRouter>
  );
}

export default App;