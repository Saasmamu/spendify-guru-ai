import React, { createContext, useState, useContext, useEffect } from 'react';
import { AdminUser } from '@/types';

interface AdminContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  logActivity: (action: string, resource: string, details?: any) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock admin authentication
      if (email === 'admin@spendify.com' && password === 'admin123') {
        const mockAdmin: AdminUser = {
          id: '1',
          email: 'admin@spendify.com',
          role: 'super_admin',
          created_at: new Date().toISOString(),
        };
        setAdminUser(mockAdmin);
        localStorage.setItem('admin_session', JSON.stringify(mockAdmin));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setAdminUser(null);
    localStorage.removeItem('admin_session');
  };

  const hasPermission = (permission: string): boolean => {
    if (!adminUser) return false;
    // Mock permission check - super_admin has all permissions
    return adminUser.role === 'super_admin';
  };

  const logActivity = async (action: string, resource: string, details?: any) => {
    // Mock activity logging
    console.log('Admin activity:', { action, resource, details, user: adminUser?.email });
  };

  useEffect(() => {
    const storedSession = localStorage.getItem('admin_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        setAdminUser(session);
      } catch (error) {
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  return (
    <AdminContext.Provider value={{
      adminUser,
      loading,
      signIn,
      signOut,
      hasPermission,
      logActivity,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
