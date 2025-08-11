'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  adminEmail?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 AuthContext: Loading from localStorage...');
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('🔍 AuthContext: Saved token exists:', !!savedToken);
    console.log('🔍 AuthContext: Saved user exists:', !!savedUser);
    
    if (savedToken && savedUser) {
      console.log('✅ AuthContext: Restoring authentication');
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      console.log('❌ AuthContext: No saved authentication found');
    }
  }, []);

  const login = (token: string, user: User) => {
    console.log('✅ AuthContext: Login called with user:', user.email);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    console.log('✅ AuthContext: Authentication saved to localStorage');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}