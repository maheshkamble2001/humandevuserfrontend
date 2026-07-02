// src/context/WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth'; // Fixed import path

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const maxReconnectAttempts = 10;

  // Clean up function
  const cleanupSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
    setConnectionError(null);
    
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  // Connect to WebSocket
  const connectSocket = () => {
    if (!isAuthenticated || !user) {
      cleanupSocket();
      return;
    }

    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
      
      // Close existing connection if any
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const newSocket = io(wsUrl, {
        auth: {
          token: localStorage.getItem('token'),
          userId: user.id,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        forceNew: true,
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);
        
        // Join user's room
        newSocket.emit('join', { userId: user.id });
        
        // Emit connection event
        if (typeof onConnect === 'function') {
          onConnect();
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        setIsConnected(false);
        setConnectionError(error.message);
        setReconnectAttempts(prev => prev + 1);
        
        // Notify about connection error
        if (typeof onError === 'function') {
          onError(error);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        setIsConnected(false);
        
        if (reason === 'io server disconnect') {
          // Server disconnected, attempt to reconnect manually
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectTimerRef.current = setTimeout(() => {
              connectSocket();
            }, 2000);
          }
        }
      });

      newSocket.on('reconnect_attempt', (attempt) => {
        console.log(`🔄 Reconnection attempt ${attempt}`);
        setReconnectAttempts(attempt);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('❌ Reconnection failed');
        setConnectionError('Failed to reconnect to server');
      });

      // Custom events
      newSocket.on('joined', (data) => {
        console.log('📡 Joined room:', data);
      });

      newSocket.on('error', (data) => {
        console.error('Socket error:', data);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

    } catch (error) {
      console.error('Failed to create socket connection:', error);
      setConnectionError(error.message);
    }
  };

  // Connect when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      connectSocket();
    } else {
      cleanupSocket();
    }

    return () => {
      cleanupSocket();
    };
  }, [isAuthenticated, user]);

  // Handle visibility change - reconnect when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && user && !isConnected) {
        console.log('📱 Tab became active, reconnecting...');
        connectSocket();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user, isConnected]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Network online, reconnecting...');
      if (isAuthenticated && user && !isConnected) {
        connectSocket();
      }
    };

    const handleOffline = () => {
      console.log('🌐 Network offline');
      setIsConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated, user, isConnected]);

  // Emit event with error handling
  const emit = (event, data, callback) => {
    if (!socketRef.current) {
      console.warn('⚠️ Socket not initialized, cannot emit:', event);
      return false;
    }

    if (!isConnected) {
      console.warn('⚠️ Socket not connected, cannot emit:', event);
      return false;
    }

    try {
      if (callback) {
        socketRef.current.emit(event, data, callback);
      } else {
        socketRef.current.emit(event, data);
      }
      return true;
    } catch (error) {
      console.error('Error emitting event:', event, error);
      return false;
    }
  };

  // Listen to event with cleanup
  const on = (event, callback) => {
    if (!socketRef.current) {
      console.warn('⚠️ Socket not initialized, cannot listen to:', event);
      return () => {};
    }

    socketRef.current.on(event, callback);
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  };

  // Listen once to event
  const once = (event, callback) => {
    if (!socketRef.current) {
      console.warn('⚠️ Socket not initialized, cannot listen to:', event);
      return () => {};
    }

    socketRef.current.once(event, callback);
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  };

  // Remove listener
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  // Manual reconnect
  const reconnect = () => {
    if (isConnected) {
      return;
    }
    console.log('🔄 Manual reconnect triggered');
    connectSocket();
  };

  const value = {
    socket,
    isConnected,
    connectionError,
    reconnectAttempts,
    emit,
    on,
    once,
    off,
    reconnect,
    isReady: isConnected && !!socket,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for handling WebSocket events with cleanup
export const useWebSocketEvent = (event, callback, dependencies = []) => {
  const { on, off, isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected || !callback) return;

    const unsubscribe = on(event, callback);
    return () => {
      if (unsubscribe) {
        unsubscribe();
      } else {
        off(event, callback);
      }
    };
  }, [event, callback, isConnected, ...dependencies]);
};

// Custom hook for WebSocket emit with response
export const useWebSocketEmit = () => {
  const { emit, isConnected } = useWebSocket();

  const emitWithResponse = (event, data, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      if (!isConnected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const responseEvent = `${event}_response`;
      let timeoutId;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Remove listener
        const { off } = useWebSocket();
        off(responseEvent, handleResponse);
      };

      const handleResponse = (response) => {
        cleanup();
        resolve(response);
      };

      // Set up listener for response
      const { on, off } = useWebSocket();
      on(responseEvent, handleResponse);

      // Set timeout
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Response timeout'));
      }, timeout);

      // Emit event
      const success = emit(event, data);
      if (!success) {
        cleanup();
        reject(new Error('Failed to emit event'));
      }
    });
  };

  return { emitWithResponse };
};

export default WebSocketProvider;