
import * as pdfjs from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';

// Initialize PDF.js worker
// Using a CDN-based approach to load the worker that's compatible with Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  
  // Improved regex patterns for date, description and amounts
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4})/;
  const amountPattern = /\$?(\d{1,3}(,\d{3})*(\.\d{2})?)/;
  
  // Process each page of text
  textContent.forEach(pageText => {
    // Split text into lines and clean up
    const lines = pageText
      .split(/\r?\n/)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim());
    
    lines.forEach(line => {
      // Skip header or summary lines
      if (line.includes('BALANCE') || line.includes('PAGE') || 
          line.includes('STATEMENT') || line.length < 10) {
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
        const description = line.substring(dateIndex + dateMatch[0].length, amountIndex).trim()
          .replace(/\s+/g, ' '); // Clean up extra spaces
        
        // Remove commas from amount and convert to number
        const amountStr = amountMatch[0].replace('$', '').replace(/,/g, '');
        const amount = parseFloat(amountStr);
        
        // Skip invalid amounts
        if (isNaN(amount) || amount <= 0) return;
        
        // Determine if it's a credit or debit
        // This logic would need to be customized for specific bank formats
        const isCredit = line.toLowerCase().includes('credit') || 
                          line.toLowerCase().includes('deposit') || 
                          line.toLowerCase().includes('payment received');
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

  // If no transactions were found, try an alternative approach
  if (transactions.length === 0) {
    console.log("No transactions found with primary method, trying alternative approach");
    
    // Simple fallback to extract any potential transactions
    textContent.forEach(pageText => {
      const matches = pageText.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}).*?\$(\d+\.\d{2})/g);
      if (matches) {
        matches.forEach(match => {
          const dateMatch = match.match(datePattern);
          const amountMatch = match.match(/\$(\d+\.\d{2})/);
          
          if (dateMatch && amountMatch) {
            const date = dateMatch[0];
            const amountStr = amountMatch[1];
            const amount = parseFloat(amountStr);
            
            if (!isNaN(amount) && amount > 0) {
              // Extract description (everything between date and amount)
              const dateEndIndex = match.indexOf(date) + date.length;
              const amountStartIndex = match.lastIndexOf('$');
              let description = match.substring(dateEndIndex, amountStartIndex).trim();
              
              // Clean up description
              description = description.replace(/\s+/g, ' ').trim();
              
              // Default to debit
              const type = 'debit';
              totalExpense += amount;
              
              const transaction: BankTransaction = {
                date,
                description,
                amount,
                type,
                category: categorizeTransaction(description)
              };
              
              transactions.push(transaction);
            }
          }
        });
      }
    });
  }

  // Sort transactions by date (newest first)
  transactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
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
    { name: 'Housing', keywords: ['rent', 'mortgage', 'hoa', 'property', 'housing', 'apartment', 'condo'] },
    { name: 'Transportation', keywords: ['gas', 'uber', 'lyft', 'train', 'subway', 'bus', 'car', 'auto', 'vehicle', 'parking', 'toll'] },
    { name: 'Food & Dining', keywords: ['restaurant', 'café', 'cafe', 'coffee', 'doordash', 'grubhub', 'uber eat', 'food', 'grocery', 'meal', 'supermarket', 'dine'] },
    { name: 'Shopping', keywords: ['amazon', 'walmart', 'target', 'costco', 'shop', 'store', 'buy', 'purchase', 'retail', 'market'] },
    { name: 'Utilities', keywords: ['electric', 'water', 'gas', 'internet', 'phone', 'cell', 'utility', 'utilities', 'bill', 'cable', 'tv', 'service'] },
    { name: 'Entertainment', keywords: ['movie', 'netflix', 'hulu', 'spotify', 'disney', 'game', 'entertain', 'theater', 'concert', 'event', 'ticket'] },
    { name: 'Health', keywords: ['doctor', 'pharmacy', 'medical', 'health', 'insurance', 'dental', 'vision', 'hospital', 'clinic', 'prescription'] },
    { name: 'Education', keywords: ['tuition', 'book', 'course', 'class', 'school', 'university', 'college', 'education', 'student', 'loan'] },
    { name: 'Personal', keywords: ['haircut', 'salon', 'spa', 'gym', 'fitness', 'clothing', 'beauty', 'cosmetic'] },
    { name: 'Income', keywords: ['salary', 'payroll', 'deposit', 'direct deposit', 'income', 'revenue', 'payment received', 'wage'] }
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
    console.log('Processing bank statement:', file.name);
    const textContent = await extractTextFromPdf(file);
    console.log('Extracted text content:', textContent.length, 'pages');
    
    const processedData = processTransactions(textContent);
    console.log('Processed transactions:', processedData.transactions.length);
    
    return processedData;
  } catch (error) {
    console.error('Error processing bank statement:', error);
    throw new Error('Failed to process bank statement');
  }
};
