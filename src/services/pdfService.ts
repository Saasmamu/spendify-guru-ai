
import { Transaction, BankTransaction, ProcessedStatement } from '@/types';

class PDFService {
  async extractTransactions(file: File): Promise<Transaction[]> {
    // Mock implementation for now
    console.log('Extracting transactions from PDF:', file.name);
    
    // Return mock data
    return [
      {
        id: '1',
        date: '2024-01-15',
        description: 'Mock Transaction 1',
        amount: -50.00,
        category: 'Food',
        type: 'debit'
      },
      {
        id: '2',
        date: '2024-01-16',
        description: 'Mock Transaction 2',
        amount: -25.50,
        category: 'Transport',
        type: 'debit'
      }
    ];
  }

  async validatePDF(file: File): Promise<boolean> {
    return file.type === 'application/pdf';
  }

  async processBankStatement(file: File): Promise<ProcessedStatement> {
    const transactions = await this.extractTransactions(file);
    const totalIncome = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const categories = transactions.reduce((acc, t) => {
      const existing = acc.find(c => c.category === t.category);
      if (existing) {
        existing.amount += Math.abs(t.amount);
        existing.count += 1;
      } else {
        acc.push({ category: t.category || 'Other', amount: Math.abs(t.amount), count: 1 });
      }
      return acc;
    }, [] as { category: string; amount: number; count: number }[]);

    return {
      transactions: transactions.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: t.category,
        balance: t.balance
      })),
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categories,
      insights: ['Mock insights for the processed statement']
    };
  }
}

export const pdfService = new PDFService();

// Export individual functions for backward compatibility
export const extractTransactions = (file: File) => pdfService.extractTransactions(file);
export const validatePDF = (file: File) => pdfService.validatePDF(file);
export const processBankStatement = (file: File) => pdfService.processBankStatement(file);

// Export types
export type { Transaction, BankTransaction, ProcessedStatement };
