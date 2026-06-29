// src/store/slices/aiSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

// Async Thunks for AI Operations

export const getAIAdvice = createAsyncThunk(
  'ai/getAdvice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('/ai/advice');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get AI advice');
    }
  }
);

export const sendAIMessage = createAsyncThunk(
  'ai/sendMessage',
  async ({ message, context = {} }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/ai/chat', { message, context });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const getAITopicAdvice = createAsyncThunk(
  'ai/getTopicAdvice',
  async ({ topic }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/ai/topic', { topic });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get topic advice');
    }
  }
);

export const getAIRecommendations = createAsyncThunk(
  'ai/getRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/ai/recommendations');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get recommendations');
    }
  }
);

export const generateAIMissions = createAsyncThunk(
  'ai/generateMissions',
  async ({ preferences = {} }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/ai/generate-missions', { preferences });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate missions');
    }
  }
);

export const getAIAnalysis = createAsyncThunk(
  'ai/getAnalysis',
  async ({ period = 'weekly' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/ai/analysis?period=${period}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get analysis');
    }
  }
);

export const getAIInsights = createAsyncThunk(
  'ai/getInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/ai/insights');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get insights');
    }
  }
);

export const getAIMotivation = createAsyncThunk(
  'ai/getMotivation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/ai/motivation');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get motivation');
    }
  }
);

export const getAISkillSuggestions = createAsyncThunk(
  'ai/getSkillSuggestions',
  async ({ careerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/ai/skill-suggestions', { careerId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get skill suggestions');
    }
  }
);

export const getAIHabitSuggestions = createAsyncThunk(
  'ai/getHabitSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/ai/habit-suggestions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get habit suggestions');
    }
  }
);

export const sendAIFeedback = createAsyncThunk(
  'ai/sendFeedback',
  async ({ feedback, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/ai/feedback', { feedback, rating });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send feedback');
    }
  }
);

// Initial State
const initialState = {
  // Chat & Messages
  messages: [],
  currentMessage: null,
  isLoading: false,
  isTyping: false,
  error: null,
  
  // Advice & Recommendations
  dailyAdvice: null,
  recommendations: [],
  insights: [],
  motivation: null,
  
  // Generated Content
  suggestedMissions: [],
  suggestedHabits: [],
  suggestedSkills: [],
  
  // Analysis
  analysis: null,
  progressAnalysis: null,
  skillGaps: [],
  
  // User Preferences
  preferences: {
    tone: 'motivational', // motivational, supportive, strict, casual
    frequency: 'daily', // daily, weekly
    focusAreas: [], // career, health, productivity, mindset
    communicationStyle: 'encouraging', // encouraging, direct, detailed
  },
  
  // History
  history: [],
  interactions: [],
  
  // Status
  status: 'idle', // idle, processing, error, success
  lastUpdated: null,
  
  // Settings
  settings: {
    notificationsEnabled: true,
    dailyAdviceEnabled: true,
    autoGenerateMissions: false,
    learningEnabled: true,
  },
  
  // Metrics
  metrics: {
    totalInteractions: 0,
    averageResponseTime: 0,
    satisfactionRate: 0,
  },
};

// AI Slice
const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    // Message Management
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
      state.currentMessage = null;
    },
    
    clearMessages: (state) => {
      state.messages = [];
      state.currentMessage = null;
    },
    
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
    
    updateMessage: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.messages.findIndex(msg => msg.id === id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...updates };
      }
    },
    
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    
    setTypingStatus: (state, action) => {
      state.isTyping = action.payload;
    },
    
    // Advice & Recommendations
    setDailyAdvice: (state, action) => {
      state.dailyAdvice = {
        ...action.payload,
        generatedAt: new Date().toISOString(),
      };
    },
    
    addRecommendation: (state, action) => {
      state.recommendations.unshift({
        id: Date.now().toString(),
        read: false,
        ...action.payload,
      });
    },
    
    markRecommendationRead: (state, action) => {
      const rec = state.recommendations.find(r => r.id === action.payload);
      if (rec) {
        rec.read = true;
      }
    },
    
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
    
    // Generated Content
    setSuggestedMissions: (state, action) => {
      state.suggestedMissions = action.payload;
    },
    
    setSuggestedHabits: (state, action) => {
      state.suggestedHabits = action.payload;
    },
    
    setSuggestedSkills: (state, action) => {
      state.suggestedSkills = action.payload;
    },
    
    acceptSuggestion: (state, action) => {
      const { type, id } = action.payload;
      const suggestions = {
        missions: state.suggestedMissions,
        habits: state.suggestedHabits,
        skills: state.suggestedSkills,
      }[type];
      
      const suggestion = suggestions?.find(s => s.id === id);
      if (suggestion) {
        suggestion.accepted = true;
        suggestion.acceptedAt = new Date().toISOString();
      }
    },
    
    rejectSuggestion: (state, action) => {
      const { type, id } = action.payload;
      const suggestions = {
        missions: state.suggestedMissions,
        habits: state.suggestedHabits,
        skills: state.suggestedSkills,
      }[type];
      
      const suggestion = suggestions?.find(s => s.id === id);
      if (suggestion) {
        suggestion.rejected = true;
        suggestion.rejectedAt = new Date().toISOString();
      }
    },
    
    // Preferences
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    
    togglePreference: (state, action) => {
      const { key, value } = action.payload;
      state.preferences[key] = value;
    },
    
    // Settings
    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
    
    toggleSetting: (state, action) => {
      const { key } = action.payload;
      state.settings[key] = !state.settings[key];
    },
    
    // History
    addInteraction: (state, action) => {
      state.interactions.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
      
      // Keep only last 100 interactions
      if (state.interactions.length > 100) {
        state.interactions = state.interactions.slice(0, 100);
      }
    },
    
    clearHistory: (state) => {
      state.history = [];
      state.interactions = [];
    },
    
    // Analysis
    setAnalysis: (state, action) => {
      state.analysis = action.payload;
    },
    
    setProgressAnalysis: (state, action) => {
      state.progressAnalysis = action.payload;
    },
    
    setSkillGaps: (state, action) => {
      state.skillGaps = action.payload;
    },
    
    // Status
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    
    // Error
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'error';
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // Metrics
    updateMetrics: (state, action) => {
      state.metrics = {
        ...state.metrics,
        ...action.payload,
      };
    },
    
    // Reset
    resetAI: (state) => {
      return initialState;
    },
  },
  
  extraReducers: (builder) => {
    // Get AI Advice
    builder
      .addCase(getAIAdvice.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(getAIAdvice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.dailyAdvice = {
          ...action.payload,
          generatedAt: new Date().toISOString(),
        };
        state.lastUpdated = new Date().toISOString();
        state.metrics.totalInteractions += 1;
      })
      .addCase(getAIAdvice.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to get AI advice';
      });

    // Send AI Message
    builder
      .addCase(sendAIMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.status = 'success';
        state.messages.push({
          id: Date.now().toString(),
          type: 'ai',
          content: action.payload.message,
          timestamp: new Date().toISOString(),
          metadata: action.payload.metadata || {},
        });
        state.lastUpdated = new Date().toISOString();
        state.metrics.totalInteractions += 1;
        
        // Add to interaction history
        state.interactions.unshift({
          id: Date.now().toString(),
          type: 'chat',
          timestamp: new Date().toISOString(),
          message: action.payload.message,
        });
      })
      .addCase(sendAIMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to send message';
        
        // Add error message
        state.messages.push({
          id: Date.now().toString(),
          type: 'error',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        });
      });

    // Get AI Topic Advice
    builder
      .addCase(getAITopicAdvice.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(getAITopicAdvice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.messages.push({
          id: Date.now().toString(),
          type: 'ai',
          content: action.payload.advice,
          timestamp: new Date().toISOString(),
          metadata: {
            topic: action.payload.topic,
            type: 'topic_advice',
          },
        });
        state.lastUpdated = new Date().toISOString();
        state.metrics.totalInteractions += 1;
      })
      .addCase(getAITopicAdvice.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to get topic advice';
      });

    // Get AI Recommendations
    builder
      .addCase(getAIRecommendations.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(getAIRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.recommendations = action.payload.map(rec => ({
          ...rec,
          id: rec.id || Date.now().toString(),
          read: false,
          timestamp: new Date().toISOString(),
        }));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getAIRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to get recommendations';
      });

    // Generate AI Missions
    builder
      .addCase(generateAIMissions.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(generateAIMissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.suggestedMissions = action.payload.map(mission => ({
          ...mission,
          id: mission.id || Date.now().toString(),
          generatedAt: new Date().toISOString(),
          accepted: false,
          rejected: false,
        }));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateAIMissions.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to generate missions';
      });

    // Get AI Analysis
    builder
      .addCase(getAIAnalysis.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(getAIAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.analysis = {
          ...action.payload,
          generatedAt: new Date().toISOString(),
        };
        state.lastUpdated = new Date().toISOString();
        
        // Extract skill gaps if present
        if (action.payload.skillGaps) {
          state.skillGaps = action.payload.skillGaps;
        }
        
        // Extract progress analysis
        if (action.payload.progress) {
          state.progressAnalysis = action.payload.progress;
        }
      })
      .addCase(getAIAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to get analysis';
      });

    // Get AI Insights
    builder
      .addCase(getAIInsights.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(getAIInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.insights = action.payload.map(insight => ({
          ...insight,
          id: insight.id || Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false,
        }));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getAIInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to get insights';
      });

    // Get AI Motivation
    builder
      .addCase(getAIMotivation.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(getAIMotivation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.motivation = {
          ...action.payload,
          generatedAt: new Date().toISOString(),
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getAIMotivation.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to get motivation';
      });

    // Get AI Skill Suggestions
    builder
      .addCase(getAISkillSuggestions.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(getAISkillSuggestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.suggestedSkills = action.payload.map(skill => ({
          ...skill,
          id: skill.id || Date.now().toString(),
          generatedAt: new Date().toISOString(),
          accepted: false,
          rejected: false,
        }));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getAISkillSuggestions.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to get skill suggestions';
      });

    // Get AI Habit Suggestions
    builder
      .addCase(getAIHabitSuggestions.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
        state.error = null;
      })
      .addCase(getAIHabitSuggestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        state.suggestedHabits = action.payload.map(habit => ({
          ...habit,
          id: habit.id || Date.now().toString(),
          generatedAt: new Date().toISOString(),
          accepted: false,
          rejected: false,
        }));
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getAIHabitSuggestions.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to get habit suggestions';
      });

    // Send AI Feedback
    builder
      .addCase(sendAIFeedback.pending, (state) => {
        state.isLoading = true;
        state.status = 'processing';
      })
      .addCase(sendAIFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
        // Update satisfaction rate
        state.metrics.satisfactionRate = action.payload.satisfactionRate || state.metrics.satisfactionRate;
        toast.success('Thank you for your feedback! 🙏');
      })
      .addCase(sendAIFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.status = 'error';
        state.error = action.payload || 'Failed to send feedback';
        toast.error('Failed to send feedback. Please try again.');
      });
  },
});

// Export Actions
export const {
  addMessage,
  clearMessages,
  setCurrentMessage,
  updateMessage,
  deleteMessage,
  setTypingStatus,
  setDailyAdvice,
  addRecommendation,
  markRecommendationRead,
  clearRecommendations,
  setSuggestedMissions,
  setSuggestedHabits,
  setSuggestedSkills,
  acceptSuggestion,
  rejectSuggestion,
  updatePreferences,
  togglePreference,
  updateSettings,
  toggleSetting,
  addInteraction,
  clearHistory,
  setAnalysis,
  setProgressAnalysis,
  setSkillGaps,
  setStatus,
  resetStatus,
  setError,
  clearError,
  updateMetrics,
  resetAI,
} = aiSlice.actions;

// Selectors
export const selectAI = (state) => state.ai;
export const selectAIMessages = (state) => state.ai.messages;
export const selectAIAdvice = (state) => state.ai.dailyAdvice;
export const selectAIRecommendations = (state) => state.ai.recommendations;
export const selectAISuggestions = (state) => ({
  missions: state.ai.suggestedMissions,
  habits: state.ai.suggestedHabits,
  skills: state.ai.suggestedSkills,
});
export const selectAIAnalysis = (state) => state.ai.analysis;
export const selectAIInsights = (state) => state.ai.insights;
export const selectAIMotivation = (state) => state.ai.motivation;
export const selectAIPreferences = (state) => state.ai.preferences;
export const selectAISettings = (state) => state.ai.settings;
export const selectAIStatus = (state) => state.ai.status;
export const selectAIError = (state) => state.ai.error;
export const selectAIMetrics = (state) => state.ai.metrics;
export const selectAIIsLoading = (state) => state.ai.isLoading;
export const selectAIIsTyping = (state) => state.ai.isTyping;

export default aiSlice.reducer;