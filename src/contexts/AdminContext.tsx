
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { AdminContextType, AdminUser } from '@/types/admin';
import { supabase } from '@/lib/supabase';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // Check if user is admin based on email or role
      if (user?.email === 'admin@spendify.com') {
        setIsAdmin(true);
        // Create a mock admin user for now
        const mockAdminUser: AdminUser = {
          id: 'admin-1',
          user_id: user.id,
          email: user.email,
          role_id: 'admin-role-1',
          is_active: true,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: {
            id: 'admin-role-1',
            name: 'Admin',
            description: 'Full system access',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        };
        setAdminUser(mockAdminUser);
      } else {
        setIsAdmin(false);
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setIsAdmin(false);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    // For now, admin users have all permissions
    return isAdmin;
  };

  const logActivity = async (action: string, resource: string, details?: any) => {
    try {
      if (adminUser) {
        await supabase.from('admin_activity_logs').insert([
          {
            admin_user_id: adminUser.id,
            action,
            resource,
            details,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadAdminData();
    } else {
      setIsAdmin(false);
      setIsLoading(false);
      setAdminUser(null);
    }
  }, [user]);

  const value: AdminContextType = {
    isAdmin,
    isLoading,
    loading: isLoading, // Alias for compatibility
    user,
    adminUser,
    loadAdminData,
    hasPermission,
    logActivity,
    setAdminUser,
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
