
import * as pdfjs from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';

// Initialize PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
}

export interface ProcessedStatement {
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Extracts text content from a PDF file
 */
export const extractTextFromPdf = async (file: File): Promise<string[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    const numPages = pdf.numPages;
    const textContent: string[] = [];
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      textContent.push(text);
    }
    
    return textContent;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Process extracted text to identify transactions
 * This is a simplified implementation that would need customization for specific bank formats
 */
export const processTransactions = (textContent: string[]): ProcessedStatement => {
  // Sample implementation - this would need to be customized based on specific bank statement formats
  const transactions: BankTransaction[] = [];
  let totalIncome = 0;
  let totalExpense = 0;
  
  // Simplified regex patterns for date, description and amounts
  // These would need to be customized for specific bank formats
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4})/;
  const amountPattern = /\$?(\d{1,3}(,\d{3})*(\.\d{2})?)/;
  
  // Process each page of text
  textContent.forEach(pageText => {
    // Split text into lines
    const lines = pageText.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    lines.forEach(line => {
      // Skip header or summary lines
      if (line.includes('BALANCE') || line.includes('PAGE') || line.includes('STATEMENT')) {
        return;
      }
      
      // Try to extract date
      const dateMatch = line.match(datePattern);
      if (!dateMatch) return;
      
      // Try to extract amount
      const amountMatch = line.match(amountPattern);
      if (!amountMatch) return;
      
      // Everything between date and amount is likely the description
      const dateIndex = line.indexOf(dateMatch[0]);
      const amountIndex = line.lastIndexOf(amountMatch[0]);
      
      if (dateIndex >= 0 && amountIndex > dateIndex) {
        const date = dateMatch[0];
        const description = line.substring(dateIndex + dateMatch[0].length, amountIndex).trim();
        
        // Remove commas from amount and convert to number
        const amountStr = amountMatch[0].replace('$', '').replace(/,/g, '');
        const amount = parseFloat(amountStr);
        
        // Determine if it's a credit or debit
        // This logic would need to be customized for specific bank formats
        const isCredit = line.includes('CREDIT') || line.includes('DEPOSIT');
        const type = isCredit ? 'credit' : 'debit';
        
        // Add to appropriate total
        if (isCredit) {
          totalIncome += amount;
        } else {
          totalExpense += amount;
        }
        
        // Create transaction object and add to array
        const transaction: BankTransaction = {
          date,
          description,
          amount,
          type,
          category: categorizeTransaction(description)
        };
        
        transactions.push(transaction);
      }
    });
  });
  
  return {
    transactions,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

/**
 * Categorize transactions based on keywords in the description
 */
export const categorizeTransaction = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  
  const categories = [
    { name: 'Housing', keywords: ['rent', 'mortgage', 'hoa', 'property'] },
    { name: 'Transportation', keywords: ['gas', 'uber', 'lyft', 'train', 'subway', 'bus', 'car', 'auto', 'vehicle'] },
    { name: 'Food & Dining', keywords: ['restaurant', 'café', 'cafe', 'coffee', 'doordash', 'grubhub', 'uber eat', 'food', 'grocery', 'meal'] },
    { name: 'Shopping', keywords: ['amazon', 'walmart', 'target', 'costco', 'shop', 'store', 'buy', 'purchase'] },
    { name: 'Utilities', keywords: ['electric', 'water', 'gas', 'internet', 'phone', 'cell', 'utility', 'utilities'] },
    { name: 'Entertainment', keywords: ['movie', 'netflix', 'hulu', 'spotify', 'disney', 'game', 'entertain'] },
    { name: 'Health', keywords: ['doctor', 'pharmacy', 'medical', 'health', 'insurance', 'dental', 'vision'] },
    { name: 'Education', keywords: ['tuition', 'book', 'course', 'class', 'school', 'university', 'college'] },
    { name: 'Personal', keywords: ['haircut', 'salon', 'spa', 'gym', 'fitness'] }
  ];

  for (const category of categories) {
    for (const keyword of category.keywords) {
      if (lowerDesc.includes(keyword)) {
        return category.name;
      }
    }
  }

  return 'Miscellaneous';
};

/**
 * Main function to process a bank statement PDF
 */
export const processBankStatement = async (file: File): Promise<ProcessedStatement> => {
  try {
    const textContent = await extractTextFromPdf(file);
    return processTransactions(textContent);
  } catch (error) {
    console.error('Error processing bank statement:', error);
    throw new Error('Failed to process bank statement');
  }
};
