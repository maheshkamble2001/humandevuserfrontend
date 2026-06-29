// src/store/slices/habitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchHabits = createAsyncThunk(
  'habits/fetchAll',
  async () => {
    const response = await axios.get('/habits');
    return response.data;
  }
);

export const createHabit = createAsyncThunk(
  'habits/create',
  async (habitData) => {
    const response = await axios.post('/habits', habitData);
    return response.data;
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/delete',
  async (habitId) => {
    await axios.delete(`/habits/${habitId}`);
    return habitId;
  }
);

const habitSlice = createSlice({
  name: 'habits',
  initialState: {
    habits: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    updateHabitStatus: (state, action) => {
      const { habitId, completed } = action.payload;
      const habit = state.habits.find(h => h.id === habitId);
      if (habit) {
        habit.completedToday = completed;
        if (completed) {
          habit.streak += 1;
          habit.totalCompletions += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter(h => h.id !== action.payload);
      });
  },
});

export const { updateHabitStatus } = habitSlice.actions;
export default habitSlice.reducer;