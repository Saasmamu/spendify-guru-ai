
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminSession } from '@/types';

interface AdminContextType {
  user: AdminUser | null;
  session: AdminSession | null;
  isAdmin: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  logActivity: (activity: string) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setSession(parsedSession);
      setUser(parsedSession.user);
    }
    setIsLoading(false);
  }, []);

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const logActivity = (activity: string) => {
    console.log('Admin activity:', activity);
  };

  const signIn = async (email: string, password: string) => {
    // Mock admin authentication
    if (email === 'admin@spendify.com' && password === 'admin123') {
      const adminUser: AdminUser = {
        id: '1',
        email,
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'manage_users'],
        created_at: new Date().toISOString()
      };

      const adminSession: AdminSession = {
        user: adminUser,
        token: 'mock-admin-token',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      setUser(adminUser);
      setSession(adminSession);
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signOut = () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('adminSession');
  };

  const value: AdminContextType = {
    user,
    session,
    isAdmin: !!user,
    isLoading,
    hasPermission,
    logActivity,
    signIn,
    signOut
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
