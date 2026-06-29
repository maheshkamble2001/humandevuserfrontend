// src/hooks/useAI.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAIAdvice,
  sendAIMessage,
  getAITopicAdvice,
  getAIRecommendations,
  generateAIMissions,
  getAIAnalysis,
  getAIInsights,
  getAIMotivation,
  getAISkillSuggestions,
  getAIHabitSuggestions,
  sendAIFeedback,
  addMessage,
  setTypingStatus,
  clearMessages,
  updatePreferences,
  updateSettings,
  setStatus,
  clearError,
  selectAI,
} from '../store/slices/aiSlice';

export const useAI = () => {
  const dispatch = useDispatch();
  const aiState = useSelector(selectAI);

  // Message Methods
  const sendMessage = useCallback(async (message, context = {}) => {
    try {
      // Add user message to state
      dispatch(addMessage({
        type: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      }));
      
      // Set typing status
      dispatch(setTypingStatus(true));
      
      // Send message to AI
      const result = await dispatch(sendAIMessage({ message, context })).unwrap();
      
      // Clear typing status
      dispatch(setTypingStatus(false));
      
      return result;
    } catch (error) {
      dispatch(setTypingStatus(false));
      throw error;
    }
  }, [dispatch]);

  // Advice Methods
  const getAdvice = useCallback(async () => {
    try {
      const result = await dispatch(getAIAdvice()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const getTopicAdvice = useCallback(async (topic) => {
    try {
      const result = await dispatch(getAITopicAdvice({ topic })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Recommendations Methods
  const getRecommendations = useCallback(async () => {
    try {
      const result = await dispatch(getAIRecommendations()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Generation Methods
  const generateMissions = useCallback(async (preferences = {}) => {
    try {
      const result = await dispatch(generateAIMissions({ preferences })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Analysis Methods
  const getAnalysis = useCallback(async (period = 'weekly') => {
    try {
      const result = await dispatch(getAIAnalysis({ period })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const getInsights = useCallback(async () => {
    try {
      const result = await dispatch(getAIInsights()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const getMotivation = useCallback(async () => {
    try {
      const result = await dispatch(getAIMotivation()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Suggestions Methods
  const getSkillSuggestions = useCallback(async (careerId) => {
    try {
      const result = await dispatch(getAISkillSuggestions({ careerId })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const getHabitSuggestions = useCallback(async () => {
    try {
      const result = await dispatch(getAIHabitSuggestions()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Feedback Method
  const sendFeedback = useCallback(async (feedback, rating) => {
    try {
      const result = await dispatch(sendAIFeedback({ feedback, rating })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Preference Methods
  const updatePreference = useCallback((preferences) => {
    dispatch(updatePreferences(preferences));
  }, [dispatch]);

  // Settings Methods
  const updateSetting = useCallback((settings) => {
    dispatch(updateSettings(settings));
  }, [dispatch]);

  // Utility Methods
  const clearChat = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setProcessing = useCallback(() => {
    dispatch(setStatus('processing'));
  }, [dispatch]);

  // Computed Values
  const hasError = aiState.status === 'error';
  const isProcessing = aiState.status === 'processing';
  const isIdle = aiState.status === 'idle';
  const isSuccess = aiState.status === 'success';

  return {
    // State
    ...aiState,
    hasError,
    isProcessing,
    isIdle,
    isSuccess,
    messages: aiState.messages,
    dailyAdvice: aiState.dailyAdvice,
    recommendations: aiState.recommendations,
    suggestedMissions: aiState.suggestedMissions,
    suggestedHabits: aiState.suggestedHabits,
    suggestedSkills: aiState.suggestedSkills,
    analysis: aiState.analysis,
    insights: aiState.insights,
    motivation: aiState.motivation,
    preferences: aiState.preferences,
    settings: aiState.settings,
    metrics: aiState.metrics,
    isLoading: aiState.isLoading,
    isTyping: aiState.isTyping,
    error: aiState.error,
    
    // Actions
    sendMessage,
    getAdvice,
    getTopicAdvice,
    getRecommendations,
    generateMissions,
    getAnalysis,
    getInsights,
    getMotivation,
    getSkillSuggestions,
    getHabitSuggestions,
    sendFeedback,
    updatePreference,
    updateSetting,
    clearChat,
    resetError,
    setProcessing,
  };
};

export default useAI;