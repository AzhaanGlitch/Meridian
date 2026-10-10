import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock Demo User so UI can be checked without running MongoDB backend
const MOCK_USER = {
  _id: 'demo-user-123',
  name: 'Alex Morgan',
  email: 'alex@meridian.app',
  avatar: '',
  token: 'mock-demo-jwt-token-2026',
  settings: {
    theme: 'light',
    emailNotifications: true,
    weeklyDigest: true
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('meridian_user');
    return saved ? JSON.parse(saved) : MOCK_USER; // Default to demo user for easy UI testing
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem('meridian_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('meridian_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        ...MOCK_USER,
        name: email.split('@')[0] || 'Demo User',
        email
      });
      setLoading(false);
    }, 300);
    return { success: true };
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        ...MOCK_USER,
        name,
        email
      });
      setLoading(false);
    }, 300);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('meridian_user');
  };

  const updateProfileSettings = async (settingsPayload) => {
    setUser(prev => ({ ...prev, ...settingsPayload }));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
