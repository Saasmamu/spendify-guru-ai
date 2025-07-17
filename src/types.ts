
// Financial types
export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'debit' | 'credit';
}

export interface ProcessedStatement {
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpenses: number;
  categories: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface CategoryData {
  name: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface AnomalyData {
  count: number;
  severity: 'low' | 'medium' | 'high';
  anomalies: Anomaly[];
}

export interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  detected_at: string;
  transaction: BankTransaction;
  confidence: number;
}

// Subscription types
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  description?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  current_period_end: string;
  trial_ends_at?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  card_added: boolean;
  trial_type?: 'seven_day' | 'thirty_day';
}

// Admin types
export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role_id: string;
  role_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expires_at: string;
}

export interface RetentionData {
  period: string;
  retained: number;
  total: number;
  rate: number;
}

export interface DocumentProcessingData {
  success_rate: number;
  avg_processing_time: number;
  total_processed: number;
  failed_count: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface ApiIntegration {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  last_sync: string;
  config: Record<string, any>;
}

export interface SavedAnalysis {
  id: string;
  name: string;
  description: string;
  data: any;
  created_at: string;
  user_id: string;
}

// Export all types as a single object as well for backwards compatibility
export type {
  BankTransaction as Transaction_Old,
  ProcessedStatement,
  Transaction,
  CategoryData,
  AnomalyData,
  Anomaly,
  Plan,
  Subscription,
  AdminUser,
  AdminSession,
  RetentionData,
  DocumentProcessingData,
  Permission,
  Role,
  ApiIntegration,
  SavedAnalysis
};
