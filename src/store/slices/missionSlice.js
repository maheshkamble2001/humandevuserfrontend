// src/store/slices/missionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchMissions = createAsyncThunk(
  'missions/fetchAll',
  async () => {
    const response = await axios.get('/missions');
    return response.data;
  }
);

export const createMission = createAsyncThunk(
  'missions/create',
  async (missionData) => {
    const response = await axios.post('/missions', missionData);
    return response.data;
  }
);

const missionSlice = createSlice({
  name: 'missions',
  initialState: {
    missions: [],
    currentMission: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentMission: (state, action) => {
      state.currentMission = action.payload;
    },
    clearCurrentMission: (state) => {
      state.currentMission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.missions = action.payload;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createMission.fulfilled, (state, action) => {
        state.missions.push(action.payload);
      });
  },
});

export const { setCurrentMission, clearCurrentMission } = missionSlice.actions;
export default missionSlice.reducer;