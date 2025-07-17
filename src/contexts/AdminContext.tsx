
import React, { createContext, useContext, useState } from 'react';
import { AdminUser, AdminSession } from '@/types';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAdminStatus: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with real implementation
      if (email === 'admin@spendify.com' && password === 'admin123') {
        const mockAdminUser: AdminUser = {
          id: '1',
          email: 'admin@spendify.com',
          role: 'super_admin',
          permissions: ['read', 'write', 'delete', 'admin'],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        setAdminUser(mockAdminUser);
        setIsAdmin(true);
        localStorage.setItem('adminSession', JSON.stringify(mockAdminUser));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminUser(null);
    localStorage.removeItem('adminSession');
  };

  const checkAdminStatus = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const savedSession = localStorage.getItem('adminSession');
      if (savedSession) {
        const adminUser = JSON.parse(savedSession);
        setAdminUser(adminUser);
        setIsAdmin(true);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check admin status on mount
  React.useEffect(() => {
    checkAdminStatus();
  }, []);

  const value: AdminContextType = {
    isAdmin,
    isLoading,
    adminUser,
    login,
    logout,
    checkAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
