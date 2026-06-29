// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    theme: 'dark',
    notifications: [],
    modals: [],
    loading: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        read: false,
      });
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modals.push(action.payload);
    },
    closeModal: (state, action) => {
      state.modals = state.modals.filter(m => m.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setTheme,
  addNotification,
  markNotificationRead,
  clearNotifications,
  openModal,
  closeModal,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;