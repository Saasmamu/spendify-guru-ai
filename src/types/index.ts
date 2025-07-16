
// Core transaction and financial types
export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  description: string;
  type: 'debit' | 'credit';
  category: string;
  reference?: string;
  channel?: string;
  balance?: number;
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  balance?: number;
  reference?: string;
  channel?: string;
}

export interface ProcessedStatement {
  transactions: BankTransaction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netFlow: number;
    transactionCount: number;
  };
  metadata: {
    fileName: string;
    fileSize: number;
    processedAt: string;
    statementPeriod?: {
      start: string;
      end: string;
    };
  };
}

export interface CategoryData {
  name: string;
  amount: number;
  count: number;
  percentage: number;
  color?: string;
}

export interface Anomaly {
  id: string;
  transaction_id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  detected_at: string;
  status: 'new' | 'reviewed' | 'dismissed';
}

export interface AnomalyData {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  amount: number;
  date: string;
  transactionId: string;
}

export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  transactions: BankTransaction[];
  total_income: number;
  total_expense: number;
  categories: CategoryData[];
  insights: any;
  created_at: string;
  user_id: string;
}

export interface BankStatementUploadProps {
  onFileProcessed: (statement: ProcessedStatement) => void;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
}

// Plan and subscription types
export interface PlanFeatures {
  maxFileSize: number;
  maxFilesPerMonth: number;
  advancedAnalytics: boolean;
  aiInsights: boolean;
  exportFormats: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: PlanFeatures;
  description: string;
  popular?: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trial';
  trial_ends_at?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  created_at: string;
  updated_at: string;
}

// Admin types
export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expires_at: string;
}
