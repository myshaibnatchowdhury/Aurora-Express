'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from './types';
import { INITIAL_PROFILES } from './mock-data';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAs: (profileId: string) => void;
  loginWithCredentials: (email: string, password?: string) => boolean;
  logout: () => void;
  availableProfiles: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem('aurora_current_user_id');
    if (savedUserId) {
      const found = INITIAL_PROFILES.find((p) => p.id === savedUserId);
      if (found) {
        setUser(found);
        return;
      }
    }
    // Default to passenger for public site
    setUser(INITIAL_PROFILES.find((p) => p.role === 'passenger') || null);
  }, []);

  const loginAs = (profileId: string) => {
    const found = INITIAL_PROFILES.find((p) => p.id === profileId);
    if (found) {
      setUser(found);
      localStorage.setItem('aurora_current_user_id', found.id);
    }
  };

  const loginWithCredentials = (email: string, _password?: string): boolean => {
    const found = INITIAL_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem('aurora_current_user_id', found.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aurora_current_user_id');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        loginAs,
        loginWithCredentials,
        logout,
        availableProfiles: INITIAL_PROFILES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
