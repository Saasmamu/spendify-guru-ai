
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  type: 'debit' | 'credit';
  category: string;
  reference?: string;
  channel?: string;
}

export interface TransactionCategory {
  name: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
  transactions: Transaction[];
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  categories: TransactionCategory[];
  insights: string[];
}

export interface FinancialInsight {
  type: 'positive' | 'negative' | 'neutral';
  category: string;
  message: string;
  amount?: number;
  percentage?: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  progress: number;
}

export interface SpendingPattern {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  amount: number;
  category: string;
  lastOccurrence: string;
  nextPredicted: string;
  confidence: number;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  subscription_status?: string;
}
