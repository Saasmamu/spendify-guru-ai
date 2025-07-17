
import { BankTransaction, ProcessedStatement } from '@/types';

export const processPDFFile = async (file: File): Promise<BankTransaction[]> => {
  // Mock implementation for PDF processing
  console.log('Processing PDF file:', file.name);
  
  // Return mock transactions for now
  return [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Sample transaction',
      amount: -50.00,
      category: 'Food',
      type: 'debit'
    }
  ];
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  // Mock implementation
  return 'Sample extracted text from PDF';
};

export const parseBankStatement = (text: string): BankTransaction[] => {
  // Mock implementation
  return [];
};

export const processBankStatement = async (file: File): Promise<ProcessedStatement> => {
  console.log('Processing bank statement:', file.name);
  
  const transactions = await processPDFFile(file);
  
  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const categories = [...new Set(transactions.map(t => t.category))];
  
  const dates = transactions.map(t => new Date(t.date)).sort();
  const dateRange = dates.length > 0 ? {
    start: dates[0].toISOString().split('T')[0],
    end: dates[dates.length - 1].toISOString().split('T')[0]
  } : { start: '', end: '' };
  
  return {
    transactions,
    totalIncome,
    totalExpenses,
    categories,
    dateRange
  };
};

// Export types for convenience
export type { BankTransaction, ProcessedStatement };

export default {
  processPDFFile,
  extractTextFromPDF,
  parseBankStatement,
  processBankStatement
};
