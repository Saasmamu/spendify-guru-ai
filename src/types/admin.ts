export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role_id: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
  role?: AdminRole;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  permissions?: AdminPermission[];
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  created_at: string;
}

export interface AdminDashboardSettings {
  id: string;
  admin_user_id: string;
  layout: Record<string, any>;
  widgets: Record<string, any>;
  preferences: Record<string, any>;
}

export interface AdminMetric {
  id: string;
  metric_name: string;
  metric_value: any;
  metric_type: string;
  start_date: string;
  end_date: string;
  created_at: string;
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

export interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  user: any;
  loadAdminData: () => Promise<void>;
}

export interface ApiIntegration {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  description?: string;
  credentials?: Record<string, any>;
  last_used?: string;
  usage_count?: number;
  created_at: string;
  updated_at: string;
}

export interface RetentionData {
  period: string;
  users_retained: number;
  total_users: number;
  retention_rate: number;
  week_1_retention?: number;
  month_1_retention?: number;
  month_3_retention?: number;
  avg_active_days_per_month?: number;
  avg_features_used?: number;
  avg_docs_processed_per_month?: number;
}

export interface DocumentProcessingData {
  date: string;
  documents_processed: number;
  success_rate: number;
  error_rate?: number;
  avg_processing_time: number;
  total_pages: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category?: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
}
