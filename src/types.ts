
// Core financial types
export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  category: string;
  type: 'debit' | 'credit';
  reference?: string;
  channel?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  category: string;
  type: 'debit' | 'credit';
  reference?: string;
  channel?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryData {
  category: string;
  name: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface ProcessedStatement {
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpenses: number;
  categories: CategoryData[];
  dateRange: {
    start: string;
    end: string;
  };
  insights?: string[];
}

export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  user_id: string;
  transactions: BankTransaction[];
  categories: CategoryData[];
  total_income: number;
  total_expense: number;
  insights: string[];
  created_at: string;
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

export interface AnomalyData {
  anomalies: Anomaly[];
  count: number;
  severity: 'low' | 'medium' | 'high';
}

// Subscription types
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: {
    maxFileSize: number;
    maxFilesPerMonth: number;
    advancedAnalytics: boolean;
    aiInsights: boolean;
    exportFormats: string[];
    priority: string;
  };
  description: string;
}

export interface Subscription {
  id: string;
  planId: string;
  status: string;
  currentPeriodEnd: string;
}

// Admin types
export interface AdminUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  created_at: string;
  last_login?: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expires_at: string;
}

export interface RetentionData {
  cohort_date: string;
  cohort_size: number;
  retention_30d: number;
  retention_60d: number;
  retention_90d: number;
  retention_180d: number;
}

export interface DocumentProcessingData {
  date: string;
  count: number;
  success_rate: number;
  average_processing_time: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface ApiIntegration {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  last_sync: string;
}

// Component props types
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
