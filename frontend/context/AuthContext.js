'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';
import { getToken, setToken, removeToken } from '../lib/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const stored = getToken();
    if (!stored) {
      setUser(null);
      setTokenState(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      setUser(data);
      setTokenState(stored);
    } catch {
      removeToken();
      setUser(null);
      setTokenState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setToken(data.token);
    setTokenState(data.token);
    const { token: _, ...userData } = data;
    setUser(userData);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    setToken(data.token);
    setTokenState(data.token);
    const { token: _, ...userData } = data;
    setUser(userData);
    return data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        fetchMe,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
