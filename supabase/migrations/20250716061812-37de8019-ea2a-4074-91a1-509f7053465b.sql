
-- Phase 1: Foundation & Authentication - Admin System Database Setup

-- Create admin roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES admin_roles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create role permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID REFERENCES admin_roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Create admin activity logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin metrics table for caching dashboard data
CREATE TABLE IF NOT EXISTS admin_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin roles
INSERT INTO admin_roles (name, description) VALUES
  ('super_admin', 'Super Administrator with full access to all features'),
  ('admin', 'Administrator with access to most features'),
  ('analyst', 'Read-only access to analytics and reports'),
  ('support', 'Access to user management and support features')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin permissions
INSERT INTO admin_permissions (name, description, resource, action) VALUES
  ('view_dashboard', 'View admin dashboard', 'dashboard', 'view'),
  ('manage_users', 'Manage user accounts', 'users', 'manage'),
  ('view_users', 'View user information', 'users', 'view'),
  ('manage_subscriptions', 'Manage subscriptions', 'subscriptions', 'manage'),
  ('view_subscriptions', 'View subscription information', 'subscriptions', 'view'),
  ('manage_documents', 'Manage document processing', 'documents', 'manage'),
  ('view_documents', 'View document information', 'documents', 'view'),
  ('view_analytics', 'View analytics and reports', 'analytics', 'view'),
  ('manage_settings', 'Manage system settings', 'settings', 'manage'),
  ('view_settings', 'View system settings', 'settings', 'view'),
  ('manage_content', 'Manage content and templates', 'content', 'manage'),
  ('view_financial_data', 'View financial analytics', 'finance', 'view'),
  ('manage_system', 'Manage system operations', 'system', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'admin' AND p.name IN (
  'view_dashboard', 'manage_users', 'view_users', 'manage_subscriptions', 
  'view_subscriptions', 'manage_documents', 'view_documents', 
  'view_analytics', 'view_settings', 'view_financial_data'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'analyst' AND p.name IN (
  'view_dashboard', 'view_users', 'view_subscriptions', 
  'view_documents', 'view_analytics', 'view_financial_data'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM admin_roles r, admin_permissions p
WHERE r.name = 'support' AND p.name IN (
  'view_dashboard', 'manage_users', 'view_users', 
  'view_subscriptions', 'view_documents'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Enable RLS on admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin tables
CREATE POLICY "Admin users can view their own data" ON admin_users
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin users can log activities" ON admin_activity_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

CREATE POLICY "Admin users can view metrics" ON admin_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role_id ON admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id ON admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Create function to check admin permissions
CREATE OR REPLACE FUNCTION check_admin_permission(
  user_id UUID,
  required_permission TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_users au
    JOIN role_permissions rp ON rp.role_id = au.role_id
    JOIN admin_permissions ap ON ap.id = rp.permission_id
    WHERE au.user_id = check_admin_permission.user_id
      AND au.is_active = true
      AND ap.name = required_permission
  );
END;
$$;

-- Create function to get admin user with role and permissions
CREATE OR REPLACE FUNCTION get_admin_user_details(
  user_id UUID
) RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  role_name TEXT,
  role_id UUID,
  is_active BOOLEAN,
  permissions TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.user_id,
    u.email,
    ar.name as role_name,
    au.role_id,
    au.is_active,
    COALESCE(
      ARRAY_AGG(ap.name) FILTER (WHERE ap.name IS NOT NULL),
      ARRAY[]::TEXT[]
    ) as permissions
  FROM admin_users au
  JOIN auth.users u ON u.id = au.user_id
  LEFT JOIN admin_roles ar ON ar.id = au.role_id
  LEFT JOIN role_permissions rp ON rp.role_id = au.role_id
  LEFT JOIN admin_permissions ap ON ap.id = rp.permission_id
  WHERE au.user_id = get_admin_user_details.user_id
  GROUP BY au.id, au.user_id, u.email, ar.name, au.role_id, au.is_active;
END;
$$;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_roles_updated_at BEFORE UPDATE ON admin_roles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admin_permissions_updated_at BEFORE UPDATE ON admin_permissions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admin_metrics_updated_at BEFORE UPDATE ON admin_metrics FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
