
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  reference?: string;
  channel?: string;
  balance?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryData {
  name: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  transaction_id: string;
  detected_at: string;
  status: 'new' | 'reviewed' | 'resolved';
  user_id: string;
}

export interface AnomalyData {
  anomalies: Anomaly[];
  summary: {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  };
}

export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  transactions: Transaction[];
  total_income: number;
  total_expense: number;
  categories: CategoryData[];
  insights: any;
  created_at: string;
  user_id: string;
}

export interface FinancialData {
  transactions: Transaction[];
  categories: CategoryData[];
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}
