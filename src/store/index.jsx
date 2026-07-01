// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import missionReducer from './slices/missionSlice';
import habitReducer from './slices/habitSlice';
import aiReducer from './slices/aiSlice';
import uiReducer from './slices/uiSlice';
import achievementReducer from './slices/achievementSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    missions: missionReducer,
    habits: habitReducer,
    ai: aiReducer,
    ui: uiReducer,
    achievements: achievementReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});