
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminSession, Permission } from '@/types';

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  session: AdminSession | null;
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  hasPermission: (permission: string) => boolean;
  logActivity: (action: string, resource: string, details?: any) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock authentication - replace with actual Supabase auth
      if (email === 'admin@spendify.com' && password === 'admin123') {
        const mockAdminUser: AdminUser = {
          id: '1',
          user_id: '1',
          email: 'admin@spendify.com',
          role_id: '1',
          role_name: 'Super Admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const mockSession: AdminSession = {
          user: mockAdminUser,
          token: 'mock-token',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        
        setAdminUser(mockAdminUser);
        setSession(mockSession);
        setIsAuthenticated(true);
        setPermissions([
          { id: '1', name: 'manage_users', description: 'Manage users', resource: 'users', action: 'manage' },
          { id: '2', name: 'view_analytics', description: 'View analytics', resource: 'analytics', action: 'view' }
        ]);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    setSession(null);
    setPermissions([]);
    setError(null);
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.some(p => p.name === permission);
  };

  const logActivity = (action: string, resource: string, details?: any) => {
    console.log('Admin activity:', { action, resource, details, user: adminUser?.email });
  };

  useEffect(() => {
    // Check for existing session on mount
    setLoading(false);
  }, []);

  const value: AdminContextType = {
    isAuthenticated,
    adminUser,
    session,
    permissions,
    loading,
    error,
    signIn,
    signOut,
    hasPermission,
    logActivity
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
