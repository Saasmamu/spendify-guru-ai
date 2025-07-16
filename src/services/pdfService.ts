
import { BankTransaction, ProcessedStatement } from '@/types';

export { BankTransaction, ProcessedStatement };

export const processBankStatement = async (file: File): Promise<ProcessedStatement> => {
  // Mock implementation for now
  const transactions: BankTransaction[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Sample Transaction',
      amount: -50.00,
      type: 'debit',
      category: 'Food & Dining',
      balance: 1500.00
    }
  ];

  return {
    transactions,
    summary: {
      totalIncome: 0,
      totalExpenses: 50,
      netFlow: -50,
      transactionCount: 1
    },
    metadata: {
      fileName: file.name,
      fileSize: file.size,
      processedAt: new Date().toISOString()
    }
  };
};
