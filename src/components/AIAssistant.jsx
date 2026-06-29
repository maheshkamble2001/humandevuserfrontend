// src/components/AIAssistant.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Brain,
  Loader,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  Heart,
  Target,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  MessageSquare,
  Settings,
  Zap,
  Award,
  BarChart3,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from 'lucide-react';
import { useAI } from '../hooks/useAI';
import Button from './common/Button';
import Input from './common/Input';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const dispatch = useDispatch();
  const {
    messages,
    isLoading,
    isTyping,
    dailyAdvice,
    recommendations,
    suggestedMissions,
    insights,
    motivation,
    preferences,
    settings,
    sendMessage,
    getAdvice,
    getRecommendations,
    getMotivation,
    generateMissions,
    sendFeedback,
    updatePreference,
    clearChat,
    resetError,
  } = useAI();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Get daily advice when opening
    if (isOpen && !dailyAdvice) {
      getAdvice();
    }
  }, [isOpen, dailyAdvice, getAdvice]);

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage(input);
      setInput('');
      
      // Get recommendations after conversation
      if (messages.length % 3 === 0) {
        getRecommendations();
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = async (action) => {
    setInput(action.prompt);
    setTimeout(handleSend, 100);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const handleFeedback = async (messageId, rating) => {
    try {
      await sendFeedback(`Feedback for message ${messageId}`, rating);
      setFeedback({ messageId, rating });
      toast.success('Thank you for your feedback! 🙏');
    } catch (error) {
      toast.error('Failed to send feedback');
    }
  };

  const quickActions = [
    { icon: Sparkles, label: 'Daily Motivation', prompt: 'Give me daily motivation' },
    { icon: Target, label: 'Mission Advice', prompt: 'Help me with my missions' },
    { icon: TrendingUp, label: 'Progress Review', prompt: 'Review my progress' },
    { icon: Lightbulb, label: 'Skill Tips', prompt: 'Tips for improving skills' },
    { icon: Heart, label: 'Habit Help', prompt: 'How to build better habits' },
    { icon: Brain, label: 'Mindset', prompt: 'Help me improve my mindset' },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full p-4 shadow-lg z-50 hover:shadow-xl transition-shadow"
      >
        <Sparkles className="w-6 h-6" />
        {recommendations.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {recommendations.length}
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[400px] h-[700px] bg-dark-800 rounded-2xl shadow-2xl border border-white/10 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">AI Life Coach</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
                  {isTyping ? 'Typing...' : 'Online'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (messages.length > 1) {
                      if (window.confirm('Clear conversation history?')) {
                        clearChat();
                        toast.info('Chat cleared');
                      }
                    }
                  }}
                  className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
                  title="Clear chat"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {showQuickActions && messages.length <= 1 && (
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">Quick Actions</span>
                  <button
                    onClick={() => setShowQuickActions(false)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Hide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-xs text-gray-300 hover:bg-white/10 transition whitespace-nowrap"
                    >
                      <action.icon className="w-3 h-3" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'system' && (
                    <div className="flex items-start space-x-2 bg-primary-500/20 text-primary-300 rounded-lg p-3 max-w-[85%] border border-primary-500/20">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  )}
                  
                  {message.type === 'ai' && (
                    <div className="flex flex-col max-w-[85%]">
                      <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                        <div className="flex items-start space-x-2">
                          <Bot className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-200 whitespace-pre-wrap">
                              {message.content}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => handleCopy(message.content)}
                                className="text-xs text-gray-400 hover:text-white transition"
                              >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id, 'positive')}
                                className={`text-xs transition ${
                                  feedback?.messageId === message.id && feedback?.rating === 'positive'
                                    ? 'text-green-400'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id, 'negative')}
                                className={`text-xs transition ${
                                  feedback?.messageId === message.id && feedback?.rating === 'negative'
                                    ? 'text-red-400'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">{message.timestamp}</p>
                    </div>
                  )}
                  
                  {message.type === 'user' && (
                    <div className="flex flex-col items-end max-w-[85%]">
                      <div className="bg-primary-500 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <User className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-white">{message.content}</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 mr-1">{message.timestamp}</p>
                    </div>
                  )}
                  
                  {message.type === 'error' && (
                    <div className="flex items-start space-x-2 bg-red-500/20 text-red-300 rounded-lg p-3 max-w-[85%] border border-red-500/20">
                      <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">{message.content}</p>
                        <button
                          onClick={resetError}
                          className="text-xs text-red-400 hover:text-red-300 mt-1"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader className="w-5 h-5 text-primary-400 animate-spin" />
                      <span className="text-sm text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestedMissions.length > 0 && (
              <div className="px-4 py-2 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-400">Suggested Missions</span>
                  <button
                    onClick={() => generateMissions()}
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    Refresh
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {suggestedMissions.slice(0, 3).map((mission, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 bg-white/5 rounded-lg p-2 border border-white/10 max-w-[200px]"
                    >
                      <p className="text-xs text-white font-medium">{mission.name}</p>
                      <p className="text-xs text-gray-400">{mission.xpReward} XP</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-primary-500 rounded-lg p-2.5 hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => getAdvice()}
                    className="text-xs text-gray-400 hover:text-white transition"
                  >
                    Daily Advice
                  </button>
                  <button
                    onClick={() => getMotivation()}
                    className="text-xs text-gray-400 hover:text-white transition"
                  >
                    Motivation
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updatePreference({ tone: preferences.tone === 'motivational' ? 'casual' : 'motivational' })}
                    className={`text-xs px-2 py-1 rounded transition ${
                      preferences.tone === 'motivational' 
                        ? 'bg-primary-500/20 text-primary-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {preferences.tone}
                  </button>
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="text-xs text-gray-400 hover:text-white transition"
                  >
                    {showQuickActions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;