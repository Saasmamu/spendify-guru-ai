
export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  totalIncome: number;
  totalExpense: number;
  categories: {
    category: string;
    amount: number;
    count: number;
  }[];
  transactions: {
    date: string;
    description: string;
    amount: number;
    category?: string;
  }[];
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
}
