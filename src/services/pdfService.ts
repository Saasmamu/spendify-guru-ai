export interface ProcessedStatement {
  totalIncome: number;
  totalExpense: number;
  transactions: BankTransaction[];
}

export interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  type: 'debit' | 'credit';
  id?: string; // Adding optional id property to fix type errors
}
