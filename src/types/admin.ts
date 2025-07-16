
export interface AdminRole {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role_id: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  role?: AdminRole;
  email?: string;
}

export interface AdminActivityLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  admin_email?: string;
  role_name?: string;
}

export interface AdminMetric {
  id: string;
  name: string;
  value: Record<string, any>;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Additional admin interfaces for the dashboard
export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  activeSubscriptions: number;
  documentsProcessed: number;
  monthlyRevenue: number;
  userGrowth: number;
  processingQueue: number;
  errorRate: number;
  apiLoad: number;
}

export interface UserGrowthData {
  date: string;
  new_users: number;
}

export interface DocumentProcessingData {
  date: string;
  documents_processed: number;
  avg_processing_time_seconds: number;
  error_rate?: number;
}

export interface RevenueData {
  month: string;
  paying_users: number;
  monthly_revenue: number;
}

export interface FeatureUsageData {
  event_type: string;
  usage_count: number;
  unique_users: number;
}

export interface TrialConversionData {
  week: string;
  trial_users: number;
  converted_users: number;
  conversion_rate: number;
}

export interface RetentionData {
  cohort_date: string;
  total_users: number;
  week_1: number;
  week_2: number;
  week_3: number;
  week_4: number;
}

// Settings interfaces
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  category?: string;
}

export interface ApiIntegration {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
  key?: string;
  credentials?: Record<string, string>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description?: string;
  variables: string[];
}

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: string;
  enabled?: boolean;
  retention_days?: number;
  storage_location?: string;
  last_run?: string;
  next_run?: string;
}
