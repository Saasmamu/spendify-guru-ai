
import { Transaction } from '@/types';

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
}

export const pdfService = new PDFService();
