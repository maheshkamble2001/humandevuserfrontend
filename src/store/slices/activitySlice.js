// src/store/slices/activitySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchActivities = createAsyncThunk(
  'activities/fetch',
  async ({ page = 1, filter = 'all', limit = 20 }) => {
    const response = await axios.get(`/activities?page=${page}&filter=${filter}&limit=${limit}`);
    return response.data;
  }
);

export const fetchActivityDetail = createAsyncThunk(
  'activities/fetchDetail',
  async (activityId) => {
    const response = await axios.get(`/activities/${activityId}`);
    return response.data;
  }
);

export const bookmarkActivity = createAsyncThunk(
  'activities/bookmark',
  async (activityId) => {
    const response = await axios.post(`/activities/${activityId}/bookmark`);
    return response.data;
  }
);

export const shareActivity = createAsyncThunk(
  'activities/share',
  async (activityId) => {
    const response = await axios.post(`/activities/${activityId}/share`);
    return response.data;
  }
);

const activitySlice = createSlice({
  name: 'activities',
  initialState: {
    activities: [],
    currentActivity: null,
    isLoading: false,
    hasMore: true,
    page: 1,
    filter: 'all',
    total: 0,
    unreadCount: 0,
    error: null,
  },
  reducers: {
    addActivity: (state, action) => {
      state.activities.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const activity = state.activities.find(a => a.id === action.payload);
      if (activity) {
        activity.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.activities.forEach(a => { a.read = true; });
      state.unreadCount = 0;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.page = 1;
      state.activities = [];
      state.hasMore = true;
    },
    clearActivities: (state) => {
      state.activities = [];
      state.currentActivity = null;
      state.unreadCount = 0;
    },
    updateActivity: (state, action) => {
      const index = state.activities.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.activities[index] = { ...state.activities[index], ...action.payload };
      }
    },
    removeActivity: (state, action) => {
      state.activities = state.activities.filter(a => a.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Activities
      .addCase(fetchActivities.pending, (state) => {
        if (state.page === 1) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        const { activities, hasMore, total, unreadCount } = action.payload;
        
        if (state.page === 1) {
          state.activities = activities;
        } else {
          state.activities = [...state.activities, ...activities];
        }
        
        state.hasMore = hasMore;
        state.total = total;
        state.unreadCount = unreadCount || 0;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // Fetch Activity Detail
      .addCase(fetchActivityDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActivityDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentActivity = action.payload;
      })
      .addCase(fetchActivityDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // Bookmark Activity
      .addCase(bookmarkActivity.fulfilled, (state, action) => {
        const activity = state.activities.find(a => a.id === action.payload.id);
        if (activity) {
          activity.bookmarked = action.payload.bookmarked;
        }
      })
      
      // Share Activity
      .addCase(shareActivity.fulfilled, (state, action) => {
        const activity = state.activities.find(a => a.id === action.payload.id);
        if (activity) {
          activity.shared = true;
          activity.shares = (activity.shares || 0) + 1;
        }
      });
  },
});

export const {
  addActivity,
  markAsRead,
  markAllAsRead,
  setFilter,
  clearActivities,
  updateActivity,
  removeActivity,
} = activitySlice.actions;

export default activitySlice.reducer;