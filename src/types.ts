
export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  totalIncome: number;
  totalExpense: number;
  balance?: number;
  categories: {
    category: string;
    amount: number;
    count: number;
  }[];
  transactions: BankTransaction[];
  patterns?: {
    id: string;
    type: 'recurring' | 'seasonal' | 'trend';
    name: string;
    description: string;
    amount: number;
    frequency?: string;
    transactions: string[];
    confidence_score: number;
    first_occurrence: string;
    last_occurrence: string;
  }[];
  anomalies?: {
    id: string;
    transaction_id: string;
    type: 'unusual_amount' | 'unusual_merchant' | 'unusual_timing' | 'potential_fraud';
    description: string;
    severity: 'low' | 'medium' | 'high';
    detected_at: string;
    status: 'new' | 'reviewed' | 'false_positive';
  }[];
  predictions?: {
    id: string;
    type: 'spending' | 'income' | 'savings' | 'budget';
    category_id?: string;
    description: string;
    amount: number;
    date: string;
    confidence_score: number;
    factors: string[];
  }[];
  insights?: string[];
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance?: number;
  type: string;
  category?: string;
  reference?: string;
  channel?: string;
}

export interface ProcessedStatement {
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categories: {
    category: string;
    amount: number;
    count: number;
  }[];
  insights: string[];
}

export interface RawAnalysisData {
  date: string;
  totalIncome: number;
  totalExpense: number;
  name: string;
  transactions: BankTransaction[];
}
