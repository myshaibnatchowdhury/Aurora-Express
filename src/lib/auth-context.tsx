'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from './types';
import { INITIAL_PROFILES } from './mock-data';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  loginAs: (profileId: string) => void;
  loginWithCredentials: (email: string, password?: string) => { success: boolean; message: string };
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

  const isSuperAdmin = Boolean(
    user &&
    user.email.toLowerCase() === 'myshaibnatchowdhury@gmail.com' &&
    user.role === 'platform_super_admin'
  );

  const loginAs = (profileId: string) => {
    const found = INITIAL_PROFILES.find((p) => p.id === profileId);
    if (found) {
      // Security check: Only myshaibnatchowdhury@gmail.com can assume platform_super_admin
      if (found.role === 'platform_super_admin' && found.email.toLowerCase() !== 'myshaibnatchowdhury@gmail.com') {
        alert('Access Denied: Only Mysha Ibnat Chowdhury (myshaibnatchowdhury@gmail.com) is authorized as Super Admin.');
        return;
      }
      setUser(found);
      localStorage.setItem('aurora_current_user_id', found.id);
    }
  };

  const loginWithCredentials = (email: string, _password?: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = INITIAL_PROFILES.find((p) => p.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, message: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।' };
    }

    if (found.role === 'platform_super_admin' && cleanEmail !== 'myshaibnatchowdhury@gmail.com') {
      return { success: false, message: 'অননুমোদিত অ্যাক্সেস: শুধুমাত্র myshaibnatchowdhury@gmail.com সুপার অ্যাডমিন হতে পারবেন।' };
    }

    setUser(found);
    localStorage.setItem('aurora_current_user_id', found.id);
    return { success: true, message: 'লগইন সফল হয়েছে।' };
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
        isSuperAdmin,
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
