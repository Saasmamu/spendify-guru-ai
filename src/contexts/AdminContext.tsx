
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminSession } from '@/types';

interface AdminContextType {
  adminUser: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock admin users
const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    email: 'admin@spendify.com',
    role: 'super_admin',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    last_login: new Date().toISOString()
  }
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    const savedSession = localStorage.getItem('admin-session');
    if (savedSession) {
      try {
        const session: AdminSession = JSON.parse(savedSession);
        if (new Date(session.expires_at) > new Date()) {
          setAdminUser(session.user);
        } else {
          localStorage.removeItem('admin-session');
        }
      } catch (error) {
        localStorage.removeItem('admin-session');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    if (email === 'admin@spendify.com' && password === 'admin123') {
      const user = MOCK_ADMIN_USERS[0];
      const session: AdminSession = {
        user,
        token: 'mock-token',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      localStorage.setItem('admin-session', JSON.stringify(session));
      setAdminUser(user);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signOut = () => {
    localStorage.removeItem('admin-session');
    setAdminUser(null);
  };

  const value: AdminContextType = {
    adminUser,
    isAdmin: !!adminUser,
    isLoading,
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
