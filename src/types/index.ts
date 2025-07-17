
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant?: string;
  type: 'debit' | 'credit';
  balance?: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface Anomaly {
  id: string;
  transaction: Transaction;
  type: 'unusual_amount' | 'unusual_merchant' | 'unusual_category' | 'suspicious_pattern';
  severity: 'low' | 'medium' | 'high';
  description: string;
  confidence: number;
}

export interface AnomalyData extends Anomaly {
  dateDetected: string;
}

export interface BankStatementUploadProps {
  onTransactionsExtracted: (transactions: Transaction[]) => void;
  onError: (error: string) => void;
}

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
    priority: 'low' | 'medium' | 'high';
  };
  description: string;
}

export interface Subscription {
  id: string;
  planId: string;
  userId: string;
  status: 'active' | 'inactive' | 'cancelled';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}
