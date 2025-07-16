
export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  amount: number;
  description: string;
  type: string;
  category: string;
  reference?: string;
  channel?: string;
  balance?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryData {
  name: string;
  amount: number;
  color?: string;
}

export interface Anomaly {
  id: string;
  user_id: string;
  transaction_id: string;
  type: string;
  description?: string;
  severity?: string;
  status?: string;
  detected_at: string;
}

export interface AnomalyData {
  type: string;
  count: number;
  severity: 'low' | 'medium' | 'high';
}

export interface SavedAnalysis {
  id: string;
  user_id: string;
  name: string;
  date: string;
  transactions: any;
  total_income: number;
  total_expense: number;
  categories: any;
  insights: any;
  created_at: string;
}

export interface BankStatementUploadProps {
  onUploadComplete?: (transactions: Transaction[]) => void;
}
