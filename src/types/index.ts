
export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
  balance?: number;
  reference?: string;
  channel?: string;
}

export interface TransactionCategory {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpenses: number;
  categories: TransactionCategory[];
  insights: string[];
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  trial_ends_at?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
}
