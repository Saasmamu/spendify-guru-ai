
export interface ProcessedStatement {
  totalIncome: number;
  totalExpense: number;
  transactions: BankTransaction[];
  balance?: number; // Adding optional balance property
}

export interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  type: 'debit' | 'credit';
  id?: string; // Adding optional id property to fix type errors
}

// Add the missing processBankStatement function
export async function processBankStatement(file: File): Promise<ProcessedStatement> {
  // Simple implementation that extracts data from PDF
  console.log(`Processing PDF file: ${file.name}`);
  
  // In a real implementation, this would parse the PDF content
  // For now, we'll create some mock data
  const mockTransactions: BankTransaction[] = [
    { date: '2023-07-01', description: 'Salary', amount: 2500, category: 'Income', type: 'credit', id: '1' },
    { date: '2023-07-02', description: 'Rent', amount: 1200, category: 'Housing', type: 'debit', id: '2' },
    { date: '2023-07-03', description: 'Groceries', amount: 150, category: 'Food & Dining', type: 'debit', id: '3' },
    { date: '2023-07-04', description: 'Gas', amount: 45, category: 'Transportation', type: 'debit', id: '4' },
    { date: '2023-07-05', description: 'Internet', amount: 65, category: 'Utilities', type: 'debit', id: '5' },
    { date: '2023-07-06', description: 'Restaurant', amount: 78, category: 'Food & Dining', type: 'debit', id: '6' }
  ];
  
  // Calculate totals
  let totalIncome = 0;
  let totalExpense = 0;
  
  mockTransactions.forEach(transaction => {
    if (transaction.type === 'credit') {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });
  
  // Calculate balance
  const balance = totalIncome - totalExpense;

  // Return processed statement
  return {
    totalIncome,
    totalExpense,
    transactions: mockTransactions,
    balance
  };
}
