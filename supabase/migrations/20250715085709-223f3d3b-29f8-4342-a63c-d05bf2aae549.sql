
-- Drop all admin-related tables and views
DROP VIEW IF EXISTS admin_activity_log_view CASCADE;
DROP VIEW IF EXISTS admin_subscription_view CASCADE;
DROP VIEW IF EXISTS admin_user_view CASCADE;
DROP VIEW IF EXISTS admin_dashboard_metrics CASCADE;

-- Drop all admin tables
DROP TABLE IF EXISTS admin_activity_logs CASCADE;
DROP TABLE IF EXISTS admin_dashboard_settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS admin_permissions CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TABLE IF EXISTS api_requests CASCADE;

-- Drop admin-related functions
DROP FUNCTION IF EXISTS check_admin_permission CASCADE;
DROP FUNCTION IF EXISTS calculate_api_load CASCADE;
DROP FUNCTION IF EXISTS get_recent_activity_logs CASCADE;
DROP FUNCTION IF EXISTS is_admin CASCADE;
DROP FUNCTION IF EXISTS log_admin_activity CASCADE;
DROP FUNCTION IF EXISTS suspend_user CASCADE;
DROP FUNCTION IF EXISTS activate_user CASCADE;
DROP FUNCTION IF EXISTS update_subscription_status CASCADE;
DROP FUNCTION IF EXISTS get_api_load_history CASCADE;
