
export interface User {
  id: string;
  email: string;
  created_at: string;
  activePlan?: string;
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  type: 'debit' | 'credit';
  category?: string;
  reference?: string;
  channel?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  type: 'debit' | 'credit';
  category?: string;
  reference?: string;
  channel?: string;
  user_id?: string;
}

export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpense: number;
  categories: Record<string, number>;
  insights: string[];
  created_at: string;
  user_id: string;
}

export interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  transaction_id?: string;
  detected_at: string;
}

export interface CategoryData {
  data: Transaction[];
  total: number;
  categorized: number;
}

export interface AnomalyData {
  data: Anomaly[];
  count: number;
  highSeverity: number;
}
