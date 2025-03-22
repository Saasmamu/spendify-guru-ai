
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker - instead of trying to use URL import, configure it to use
// the built-in fake worker that comes with pdf.js when the real worker can't be loaded
pdfjs.GlobalWorkerOptions.workerSrc = '';  // This will use the built-in fake worker

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
  console.log('Starting PDF extraction for file:', file.name, 'Size:', file.size);
  try {
    const arrayBuffer = await file.arrayBuffer();
    console.log('File loaded as ArrayBuffer');
    
    // Set disableWorker to true to avoid worker-related issues
    const pdf = await pdfjs.getDocument({ 
      data: arrayBuffer,
      disableWorker: true
    }).promise;
    
    console.log('PDF document loaded with', pdf.numPages, 'pages');
    
    const numPages = pdf.numPages;
    const textContent: string[] = [];
    
    for (let i = 1; i <= numPages; i++) {
      console.log(`Processing page ${i} of ${numPages}`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      console.log(`Extracted ${text.length} characters from page ${i}`);
      textContent.push(text);
    }
    
    console.log('PDF extraction complete. Total content length:', 
      textContent.reduce((sum, text) => sum + text.length, 0));
    
    return textContent;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Process extracted text to identify transactions
 * Enhanced implementation with better pattern matching
 */
export const processTransactions = (textContent: string[]): ProcessedStatement => {
  console.log('Starting transaction processing from extracted text');
  
  // Sample implementation - this would need to be customized based on specific bank statement formats
  const transactions: BankTransaction[] = [];
  let totalIncome = 0;
  let totalExpense = 0;
  
  // Improved regex patterns for date, description and amounts
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/;
  const amountPattern = /(\$|\€|\£|₦)?(\d{1,3}(,\d{3})*(\.\d{2})?)/;
  
  // Process each page of text
  textContent.forEach((pageText, pageIndex) => {
    console.log(`Processing text from page ${pageIndex + 1}, length: ${pageText.length} characters`);
    
    // Split text into lines and clean up
    const lines = pageText
      .split(/\r?\n/)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim());
    
    console.log(`Page ${pageIndex + 1} split into ${lines.length} lines`);
    let matchesFound = 0;
    
    lines.forEach((line, lineIndex) => {
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
        
        // Remove currency symbols and commas from amount and convert to number
        const amountStr = amountMatch[0].replace(/[$€£₦]/g, '').replace(/,/g, '');
        const amount = parseFloat(amountStr);
        
        // Skip invalid amounts
        if (isNaN(amount) || amount <= 0) return;
        
        matchesFound++;
        
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
        
        console.log(`Found transaction: ${date} | ${description} | $${amount} | ${type}`);
        transactions.push(transaction);
      }
    });
    
    console.log(`Found ${matchesFound} transaction matches on page ${pageIndex + 1}`);
  });

  // If no transactions were found, try an alternative approach
  if (transactions.length === 0) {
    console.log("No transactions found with primary method, trying alternative approach");
    
    // More aggressive pattern matching
    textContent.forEach((pageText, pageIndex) => {
      console.log(`Trying alternative pattern matching on page ${pageIndex + 1}`);
      
      // Look for table-like structures with dates and amounts
      const tablePattern = /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\s+(.*?)\s+(\d+\.\d{2})/g;
      let match;
      let altMatchesFound = 0;
      
      while ((match = tablePattern.exec(pageText)) !== null) {
        const date = match[1];
        const description = match[2].trim();
        const amount = parseFloat(match[3]);
        
        if (!isNaN(amount) && amount > 0) {
          altMatchesFound++;
          const transaction: BankTransaction = {
            date,
            description,
            amount,
            type: 'debit',  // Default to debit
            category: categorizeTransaction(description)
          };
          
          transactions.push(transaction);
          totalExpense += amount;
          console.log(`Alternative pattern found transaction: ${date} | ${description} | $${amount}`);
        }
      }
      
      // Try another pattern that might match dates and amounts
      const dateAmountPattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}).*?(\$|\€|\£|₦)?(\d+\.\d{2})/g;
      while ((match = dateAmountPattern.exec(pageText)) !== null) {
        const date = match[1];
        const fullMatch = match[0];
        const amount = parseFloat(match[3]);
        
        if (!isNaN(amount) && amount > 0) {
          altMatchesFound++;
          // Extract description (everything between date and amount)
          const dateEndIndex = fullMatch.indexOf(date) + date.length;
          const amountStartIndex = fullMatch.lastIndexOf(match[3]);
          let description = fullMatch.substring(dateEndIndex, amountStartIndex).trim();
          
          // Clean up description
          description = description.replace(/\s+/g, ' ').trim();
          
          const transaction: BankTransaction = {
            date,
            description,
            amount,
            type: 'debit',  // Default to debit
            category: categorizeTransaction(description)
          };
          
          console.log(`Second alternative pattern found transaction: ${date} | ${description} | $${amount}`);
          transactions.push(transaction);
          totalExpense += amount;
        }
      }
      
      console.log(`Found ${altMatchesFound} transaction matches with alternative patterns on page ${pageIndex + 1}`);
    });
  }

  console.log(`Total transactions extracted: ${transactions.length}`);
  console.log(`Total income: $${totalIncome.toFixed(2)}, Total expense: $${totalExpense.toFixed(2)}`);
  
  // Sort transactions by date (newest first)
  transactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Determine statement period
  let startDate, endDate;
  if (transactions.length > 0) {
    const dates = transactions.map(t => new Date(t.date).getTime());
    startDate = new Date(Math.min(...dates)).toLocaleDateString();
    endDate = new Date(Math.max(...dates)).toLocaleDateString();
    console.log(`Statement period: ${startDate} to ${endDate}`);
  }
  
  return {
    transactions,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    startDate,
    endDate
  };
};

/**
 * Enhanced categorize function with more categories and keywords
 */
export const categorizeTransaction = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  
  const categories = [
    { name: 'Housing', keywords: ['rent', 'mortgage', 'hoa', 'property', 'housing', 'apartment', 'condo', 'lease', 'tenant'] },
    { name: 'Transportation', keywords: ['gas', 'uber', 'lyft', 'train', 'subway', 'bus', 'car', 'auto', 'vehicle', 'parking', 'toll', 'transport', 'taxi', 'fare'] },
    { name: 'Food & Dining', keywords: ['restaurant', 'café', 'cafe', 'coffee', 'doordash', 'grubhub', 'uber eat', 'food', 'grocery', 'meal', 'supermarket', 'dine', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger'] },
    { name: 'Shopping', keywords: ['amazon', 'walmart', 'target', 'costco', 'shop', 'store', 'buy', 'purchase', 'retail', 'market', 'mall', 'outlet', 'online', 'ecommerce'] },
    { name: 'Utilities', keywords: ['electric', 'water', 'gas', 'internet', 'phone', 'cell', 'utility', 'utilities', 'bill', 'cable', 'tv', 'service', 'provider', 'broadband'] },
    { name: 'Entertainment', keywords: ['movie', 'netflix', 'hulu', 'spotify', 'disney', 'game', 'entertain', 'theater', 'concert', 'event', 'ticket', 'show', 'streaming', 'subscription'] },
    { name: 'Health', keywords: ['doctor', 'pharmacy', 'medical', 'health', 'insurance', 'dental', 'vision', 'hospital', 'clinic', 'prescription', 'medicine', 'healthcare', 'therapy'] },
    { name: 'Education', keywords: ['tuition', 'book', 'course', 'class', 'school', 'university', 'college', 'education', 'student', 'loan', 'academic', 'degree', 'study'] },
    { name: 'Personal', keywords: ['haircut', 'salon', 'spa', 'gym', 'fitness', 'clothing', 'beauty', 'cosmetic', 'apparel', 'fashion'] },
    { name: 'Income', keywords: ['salary', 'payroll', 'deposit', 'direct deposit', 'income', 'revenue', 'payment received', 'wage', 'earnings', 'compensation', 'bonus'] },
    { name: 'Investments', keywords: ['invest', 'stock', 'dividend', 'bond', 'mutual fund', 'etf', 'retirement', 'ira', '401k', 'trading', 'portfolio'] },
    { name: 'Debt', keywords: ['loan', 'credit card', 'payment', 'interest', 'debt', 'finance charge', 'late fee', 'minimum payment'] }
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
  console.log('=== PROCESSING BANK STATEMENT ===');
  console.log('File name:', file.name);
  console.log('File size:', (file.size / 1024).toFixed(2), 'KB');
  console.log('File type:', file.type);
  
  try {
    const textContent = await extractTextFromPdf(file);
    console.log('=== PDF TEXT EXTRACTION COMPLETE ===');
    console.log('Extracted', textContent.length, 'pages of text');
    
    // Show sample of first page text for debugging
    if (textContent.length > 0) {
      const firstPageSample = textContent[0].substring(0, 200) + '...';
      console.log('First page sample:', firstPageSample);
    }
    
    const processedData = processTransactions(textContent);
    console.log('=== TRANSACTION PROCESSING COMPLETE ===');
    console.log('Extracted transactions:', processedData.transactions.length);
    
    return processedData;
  } catch (error) {
    console.error('=== ERROR PROCESSING BANK STATEMENT ===');
    console.error('Error details:', error);
    throw new Error(`Failed to process bank statement: ${error instanceof Error ? error.message : String(error)}`);
  }
};

