export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
  balance?: number;
  reference?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit' | 'income';
  category: string;
  merchant?: string;
  reference?: string;
  balance?: number;
}

export interface ProcessedStatement {
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categories: CategoryData[];
  accountInfo: {
    accountNumber?: string;
    bank?: string;
    period?: string;
  };
}

export interface CategoryData {
  category: string;
  name: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
  transactions?: Transaction[];
  categorized?: boolean;
}

export interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  transaction: BankTransaction;
  confidence: number;
  detected_at?: string;
}

export interface AnomalyData {
  anomalies: Anomaly[];
  count: number;
  severity: 'low' | 'medium' | 'high';
  highSeverityCount: number;
}

// Plan and Subscription types
export interface Plan {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  badge?: string;
  features: Feature[];
}

export interface Feature {
  name: string;
  description?: string;
  included: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan: Plan;
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  trial_ends_at?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// Admin types
export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  created_at: string;
  last_sign_in_at?: string;
}

export interface AdminSession {
  user: AdminUser;
  expires_at: string;
}

// Analytics types
export interface RetentionData {
  retention_7d: number;
  retention_30d: number;
  retention_90d: number;
  avg_active_days_per_month: number;
  avg_features_used: number;
  avg_docs_processed_per_month: number;
}

export interface DocumentProcessingData {
  date: string;
  total_processed: number;
  success_rate: number;
  avg_processing_time: number;
  error_rate: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface ApiIntegration {
  id: string;
  name: string;
  description: string;
  key: string;
  enabled: boolean;
  credentials: Record<string, any>;
}
