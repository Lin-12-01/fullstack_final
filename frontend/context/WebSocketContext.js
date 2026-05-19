'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';

export const WebSocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [taskUpdates, setTaskUpdates] = useState([]);
  const wsRef = useRef(null);

  const addNotification = useCallback((payload) => {
    setNotifications((prev) => [
      {
        id: Date.now() + Math.random(),
        ...payload,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ].slice(0, 50));
  }, []);

  const connect = useCallback(() => {
    if (!token || wsRef.current) return;

    const ws = new WebSocket(`${WS_URL}/ws?token=${token}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'online:users') {
          setOnlineUsers(data.onlineUsers || []);
        } else if (
          data.type === 'task:created' ||
          data.type === 'task:updated' ||
          data.type === 'task:deleted' ||
          data.type === 'notification:task-assigned'
        ) {
          setTaskUpdates((prev) => [data, ...prev].slice(0, 20));
          addNotification({
            type: data.type,
            message: data.message || 'Task update received',
            projectId: data.projectId,
            task: data.task,
          });
        }
      } catch {
        /* ignore */
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };
  }, [token, addNotification]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      connect();
    } else {
      disconnect();
      setOnlineUsers([]);
    }
    return () => disconnect();
  }, [isAuthenticated, token, connect, disconnect]);

  const clearNotifications = () => setNotifications([]);
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <WebSocketContext.Provider
      value={{
        onlineUsers,
        notifications,
        taskUpdates,
        connect,
        disconnect,
        clearNotifications,
        markAllRead,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
};
