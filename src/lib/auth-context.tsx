'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from './types';
import { INITIAL_PROFILES } from './mock-data';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  superAdminPassword: string;
  loginAs: (profileId: string) => void;
  loginWithCredentials: (email: string, password?: string) => { success: boolean; message: string };
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  resetPasswordToDefault: () => void;
  logout: () => void;
  availableProfiles: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const defaultSuperAdmin = INITIAL_PROFILES.find((p) => p.id === 'user-superadmin') || INITIAL_PROFILES[0];
  const [user, setUser] = useState<UserProfile | null>(defaultSuperAdmin);
  const [superAdminPassword, setSuperAdminPasswordState] = useState<string>('admin123');

  useEffect(() => {
    // Migration flag to guarantee Mysha Ibnat Chowdhury is active by default
    const hasMigrated = localStorage.getItem('aurora_active_mysha_admin_v2');
    const savedUserId = localStorage.getItem('aurora_current_user_id');

    if (!hasMigrated) {
      // Overwrite any old cached 'Kamrul' session and set Mysha as active Super Admin
      setUser(defaultSuperAdmin);
      localStorage.setItem('aurora_current_user_id', defaultSuperAdmin.id);
      localStorage.setItem('aurora_active_mysha_admin_v2', 'true');
    } else if (savedUserId) {
      const found = INITIAL_PROFILES.find((p) => p.id === savedUserId);
      if (found) {
        setUser(found);
      } else {
        setUser(defaultSuperAdmin);
      }
    } else {
      setUser(defaultSuperAdmin);
    }

    // Load saved super admin password
    const savedPass = localStorage.getItem('aurora_superadmin_password');
    if (savedPass) {
      setSuperAdminPasswordState(savedPass);
    }
  }, [defaultSuperAdmin]);

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

  const loginWithCredentials = (email: string, password?: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = INITIAL_PROFILES.find((p) => p.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, message: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।' };
    }

    if (found.role === 'platform_super_admin') {
      if (cleanEmail !== 'myshaibnatchowdhury@gmail.com') {
        return { success: false, message: 'অননুমোদিত অ্যাক্সেস: শুধুমাত্র myshaibnatchowdhury@gmail.com সুপার অ্যাডমিন হতে পারবেন।' };
      }

      // Verify custom/set password
      const enteredPass = (password || '').trim();
      const currentPass = localStorage.getItem('aurora_superadmin_password') || superAdminPassword;
      if (enteredPass !== currentPass) {
        return { success: false, message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ডটি দিন অথবা "পাসওয়ার্ড পরিবর্তন / রিসেট" অপশনটি ব্যবহার করুন।' };
      }
    }

    setUser(found);
    localStorage.setItem('aurora_current_user_id', found.id);
    return { success: true, message: 'লগইন সফল হয়েছে।' };
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    const currentPass = localStorage.getItem('aurora_superadmin_password') || superAdminPassword;
    if (oldPass.trim() !== currentPass) {
      return { success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' };
    }

    if (newPass.trim().length < 4) {
      return { success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' };
    }

    const cleanNewPass = newPass.trim();
    setSuperAdminPasswordState(cleanNewPass);
    localStorage.setItem('aurora_superadmin_password', cleanNewPass);
    return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' };
  };

  const resetPasswordToDefault = () => {
    setSuperAdminPasswordState('admin123');
    localStorage.setItem('aurora_superadmin_password', 'admin123');
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
        superAdminPassword,
        loginAs,
        loginWithCredentials,
        changePassword,
        resetPasswordToDefault,
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
