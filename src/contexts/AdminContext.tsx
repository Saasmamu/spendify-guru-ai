
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminSession } from '@/types';

interface AdminContextType {
  admin: AdminUser | null;
  session: AdminSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  logActivity: (activity: string, details?: any) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedSession = localStorage.getItem('admin_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (new Date(sessionData.expiresAt) > new Date()) {
          setAdmin(sessionData.user);
          setSession(sessionData);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch (error) {
        console.error('Error loading admin session:', error);
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login for now
    if (email === 'admin@spendify.com' && password === 'admin123') {
      const mockAdmin: AdminUser = {
        id: '1',
        email: 'admin@spendify.com',
        role: 'super_admin',
        permissions: ['all'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      const mockSession: AdminSession = {
        user: mockAdmin,
        token: 'mock-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      setAdmin(mockAdmin);
      setSession(mockSession);
      localStorage.setItem('admin_session', JSON.stringify(mockSession));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setAdmin(null);
    setSession(null);
    localStorage.removeItem('admin_session');
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    return admin.permissions.includes('all') || admin.permissions.includes(permission);
  };

  const logActivity = (activity: string, details?: any) => {
    console.log('Admin activity:', activity, details);
    // In a real app, this would log to a database
  };

  return (
    <AdminContext.Provider value={{
      admin,
      session,
      loading,
      login,
      logout,
      hasPermission,
      logActivity
    }}>
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
