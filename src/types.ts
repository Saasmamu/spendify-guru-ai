
// Financial interfaces
export interface BankTransaction {
  id?: string;
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
  totalIncome: number;
  totalExpenses: number;
  balance?: number;
  categories?: { [key: string]: number };
  dateRange?: {
    start: string;
    end: string;
  };
  accountInfo?: {
    accountNumber?: string;
    accountHolder?: string;
    bankName?: string;
  };
}

export interface SavedAnalysis {
  id: string;
  name: string;
  description: string;
  data: any;
  created_at: string;
  user_id: string;
  totalIncome?: number;
  totalExpenses?: number;
  transactions?: BankTransaction[];
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  balance?: number;
  reference?: string;
  channel?: string;
}

// Analysis interfaces
export interface Anomaly {
  id: string;
  transaction: BankTransaction;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  detected_at: string;
}

export interface AnomalyData {
  anomalies: Anomaly[];
  count: number;
  severity: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface CategoryData {
  categories: Array<{
    name: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  total: number;
}

// Admin interfaces
export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string;
}

export interface AdminSession {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

export interface RetentionData {
  cohort_date: string;
  total_users: number;
  week_1: number;
  week_2: number;
  week_3: number;
  week_4: number;
}

export interface DocumentProcessingData {
  date: string;
  documents_processed: number;
  avg_processing_time_seconds: number;
}

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

// Subscription and Plan interfaces
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: SubscriptionLimits;
  isPopular?: boolean;
}

export interface SubscriptionLimits {
  maxStatements: number;
  maxSavedAnalyses: number;
  aiAnalysis: boolean;
  advancedCharts: boolean;
  exportReports: boolean;
  prioritySupport: boolean;
  customCategories: boolean;
  budgetTracking: boolean;
  advancedAnalytics: boolean;
  advancedAnalysis: boolean;
  financialGoals: boolean;
  aiAdvisor: boolean;
  budgetPlanner: boolean;
  canCompare: boolean;
  hasAdvancedAnalytics: boolean;
  hasFinancialGoals: boolean;
  hasAIFinancialAdvisor: boolean;
}

export interface SubscriptionContextType {
  activePlan: Plan | null;
  limits: SubscriptionLimits;
  isLoading: boolean;
  error: string | null;
  upgradePlan: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}
