// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const response = await axios.get('/user/profile');
    return response.data;
  }
);

export const fetchDailyMissions = createAsyncThunk(
  'user/fetchDailyMissions',
  async () => {
    const response = await axios.get('/missions/daily');
    return response.data;
  }
);

export const completeMission = createAsyncThunk(
  'user/completeMission',
  async (missionId) => {
    const response = await axios.post(`/missions/${missionId}/complete`);
    return response.data;
  }
);

export const completeHabit = createAsyncThunk(
  'user/completeHabit',
  async (habitId) => {
    const response = await axios.post(`/habits/${habitId}/complete`);
    return response.data;
  }
);

export const updatePersonalityStats = createAsyncThunk(
  'user/updatePersonalityStats',
  async (stats, { rejectWithValue }) => {
    try {
      const response = await axios.put('/user/personality-stats', stats);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  profile: null,
  dailyMissions: [],
  habits: [],
  isLoading: false,
  error: null,
  levelUp: null,
  rankUp: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateXP: (state, action) => {
      if (state.profile) {
        state.profile.xp += action.payload;
      }
    },
    updateLevel: (state, action) => {
      if (state.profile) {
        state.profile.level = action.payload;
      }
    },
    updateRank: (state, action) => {
      if (state.profile) {
        state.profile.rank = action.payload;
      }
    },
    showLevelUp: (state, action) => {
      state.levelUp = action.payload;
    },
    showRankUp: (state, action) => {
      state.rankUp = action.payload;
    },
    clearNotifications: (state) => {
      state.levelUp = null;
      state.rankUp = null;
    },
    setUser: (state, action) => {
      state.profile = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.dailyMissions = [];
      state.habits = [];
      state.levelUp = null;
      state.rankUp = null;
    },
    updateStat: (state, action) => {
      const { stat, value } = action.payload;
      if (state.profile?.personalityStats) {
        state.profile.personalityStats[stat] = value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDailyMissions.fulfilled, (state, action) => {
        state.dailyMissions = action.payload;
      })
      .addCase(completeMission.fulfilled, (state, action) => {
        const mission = state.dailyMissions.find(m => m.id === action.payload.missionId);
        if (mission) {
          mission.status = 'completed';
          mission.completedAt = new Date();
        }
        if (state.profile) {
          state.profile.xp += action.payload.xpEarned;
        }
        if (action.payload.levelUp) {
          state.levelUp = action.payload.levelUp;
        }
        if (action.payload.rankUp) {
          state.rankUp = action.payload.rankUp;
        }
      })
      .addCase(completeHabit.fulfilled, (state, action) => {
        const habit = state.habits.find(h => h.id === action.payload.habitId);
        if (habit) {
          habit.streak = action.payload.newStreak;
          habit.totalCompletions += 1;
        }
        if (state.profile) {
          state.profile.xp += action.payload.xpEarned;
        }
      })
      .addCase(updatePersonalityStats.fulfilled, (state, action) => {
        state.profile.personalityStats = action.payload;
      });
  },
  showLevelUp: (state, action) => {
    state.levelUp = {
      ...action.payload,
      timestamp: new Date().toISOString(),
    };
  },
  showRankUp: (state, action) => {
    state.rankUp = {
      ...action.payload,
      timestamp: new Date().toISOString(),
    };
  },
  clearNotifications: (state) => {
    state.levelUp = null;
    state.rankUp = null;
  },
});

export const {
  updateXP,
  updateLevel,
  updateRank,
  showLevelUp,
  showRankUp,
  clearNotifications,
  setUser,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;