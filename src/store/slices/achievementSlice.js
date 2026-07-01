// src/store/slices/achievementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchAchievements = createAsyncThunk(
  'achievements/fetch',
  async () => {
    const response = await axios.get('/achievements');
    return response.data;
  }
);

export const unlockAchievement = createAsyncThunk(
  'achievements/unlock',
  async (achievementId) => {
    const response = await axios.post(`/achievements/${achievementId}/unlock`);
    return response.data;
  }
);

const achievementSlice = createSlice({
  name: 'achievements',
  initialState: {
    achievements: [],
    unlocked: [],
    stats: { total: 0, unlocked: 0, locked: 0 },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAchievements: (state) => {
      state.achievements = [];
      state.unlocked = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload;
        state.unlocked = action.payload.filter(a => a.unlocked);
        state.stats = {
          total: action.payload.length,
          unlocked: action.payload.filter(a => a.unlocked).length,
          locked: action.payload.filter(a => !a.unlocked).length,
        };
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(unlockAchievement.fulfilled, (state, action) => {
        const index = state.achievements.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.achievements[index].unlocked = true;
          state.achievements[index].unlockedAt = new Date();
          state.unlocked.push(state.achievements[index]);
          state.stats.unlocked += 1;
          state.stats.locked -= 1;
        }
      });
  },
});

export const { clearAchievements } = achievementSlice.actions;
export default achievementSlice.reducer;