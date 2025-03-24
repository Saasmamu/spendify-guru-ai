import * as pdfjs from 'pdfjs-dist';

// Get the version of pdfjs being used
const pdfJsVersion = pdfjs.version;
console.log('Using PDF.js version:', pdfJsVersion);

// Configure the worker using the correct approach for PDF.js v3.x
if (typeof window !== 'undefined') {
  // PDF.js 3.x uses a different worker file name and path structure
  // We'll use unpkg CDN with exact version match to ensure compatibility
  const workerSrc = `https://unpkg.com/pdfjs-dist@${pdfJsVersion}/build/pdf.worker.min.js`;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  console.log(`PDF.js worker configured: ${workerSrc}`);
}

// Export interfaces
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
    
    // Load the PDF with proper configuration
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      // Using standard PDF.js config
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfJsVersion}/cmaps/`,
      cMapPacked: true
    });
    
    try {
      const pdf = await loadingTask.promise;
      console.log('PDF document loaded with', pdf.numPages, 'pages');
      
      const numPages = pdf.numPages;
      const textContent: string[] = [];
      
      for (let i = 1; i <= numPages; i++) {
        console.log(`Processing page ${i} of ${numPages}`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        // Extract text with line breaks preserved
        let lastY = null;
        let text = '';
        
        // Process text by lines based on y-position
        for (const item of content.items) {
          const itemObj = item as any;
          if (lastY !== null && lastY !== itemObj.transform[5]) {
            text += '\n'; // Add line break when y-position changes
          }
          text += itemObj.str;
          lastY = itemObj.transform[5];
        }
        
        console.log(`Extracted ${text.length} characters from page ${i}`);
        textContent.push(text);
      }
      
      console.log('PDF extraction complete. Total content length:', 
        textContent.reduce((sum, text) => sum + text.length, 0));
      
      return textContent;
    } catch (error) {
      console.warn('Primary extraction method failed:', error);
      
      // Try an alternative approach - use getDocument directly with simpler config
      try {
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        console.log('PDF loaded with alternative method, pages:', pdf.numPages);
        
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
      } catch (fallbackError) {
        console.error('Alternative extraction method also failed:', fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Process extracted text to identify transactions for Nigerian bank statements
 */
export const processTransactions = (textContent: string[]): ProcessedStatement => {
  console.log('Starting transaction processing from extracted text');
  
  const transactions: BankTransaction[] = [];
  let totalIncome = 0;
  let totalExpense = 0;
  
  let statementStartDate: string | undefined;
  let statementEndDate: string | undefined;
  
  // Try to extract statement period from the first page
  if (textContent.length > 0) {
    const firstPage = textContent[0];
    
    // Extract start and end dates
    const startDateMatch = firstPage.match(/Start Date\s+(\d{1,2}\s+\w+\s+\d{4})/);
    const endDateMatch = firstPage.match(/End Date\s+(\d{1,2}\s+\w+\s+\d{4})/);
    
    if (startDateMatch) {
      statementStartDate = startDateMatch[1];
      console.log('Found statement start date:', statementStartDate);
    }
    
    if (endDateMatch) {
      statementEndDate = endDateMatch[1];
      console.log('Found statement end date:', statementEndDate);
    }
  }
  
  // Multiple patterns to match transactions in different formats
  const patterns = [
    // Pattern 1: For Nigerian bank statements (₦ currency symbol)
    // Date, description, amount with currency symbol ₦
    /(\d{1,2}\s+\w+\s+\d{4})\s+([^₦]+)₦\s*([0-9,.]+)/g,
    
    // Pattern 2: Date (dd/mm/yyyy), description, amount
    /(\d{1,2}\/\d{1,2}\/\d{4})\s+([^₦]+?)\s+₦?\s*([0-9,.]+)/g,
    
    // Pattern 3: Date (dd-mm-yyyy), description, amount
    /(\d{1,2}-\d{1,2}-\d{4})\s+([^₦]+?)\s+₦?\s*([0-9,.]+)/g,
    
    // Pattern 4: More relaxed pattern for tables
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\s+(.*?)\s+(\d{1,3}(?:,\d{3})*\.\d{2})/g,
  ];
  
  // Process each page of text
  textContent.forEach((pageText, pageIndex) => {
    console.log(`Processing text from page ${pageIndex + 1}, length: ${pageText.length} characters`);
    
    // Split text into lines for better processing
    const lines = pageText.split('\n').filter(line => line.trim().length > 0);
    console.log(`Page ${pageIndex + 1} has ${lines.length} lines after splitting`);
    
    // Print some sample lines for debugging
    if (lines.length > 0) {
      console.log('Sample lines:');
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        console.log(`Line ${i + 1}: ${lines[i].substring(0, 100)}${lines[i].length > 100 ? '...' : ''}`);
      }
    }
    
    let totalMatchesFound = 0;
    
    // Look for transaction table sections
    let inTransactionSection = false;
    let transactionSection = '';
    
    // First, try to identify transaction section
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Check if we're entering a transaction section
      if (lowerLine.includes('transaction') && 
          (lowerLine.includes('date') || lowerLine.includes('description') || lowerLine.includes('amount'))) {
        inTransactionSection = true;
        console.log('Found transaction section header:', line);
        continue;
      }
      
      // Collect lines in transaction section
      if (inTransactionSection) {
        // Check if we're exiting the transaction section (summary section or blank line)
        if (lowerLine.includes('total') || lowerLine.includes('balance') || lowerLine.includes('summary') || line.trim() === '') {
          inTransactionSection = false;
          continue;
        }
        
        transactionSection += line + '\n';
      }
    }
    
    console.log(`Collected ${transactionSection.length} characters of transaction data`);
    
    // Try all patterns against the transaction section
    for (const pattern of patterns) {
      let match;
      let matchesForPattern = 0;
      
      // Reset the regex index
      pattern.lastIndex = 0;
      
      // Check the whole page first
      while ((match = pattern.exec(pageText)) !== null) {
        try {
          const date = match[1].trim();
          const description = match[2].trim().replace(/\s+/g, ' '); // Clean up extra spaces
          
          // Remove currency symbols, commas, and normalize dots
          const amountStr = match[3].replace(/[₦$€£]/g, '').replace(/,/g, '');
          const amount = parseFloat(amountStr);
          
          // Skip invalid amounts
          if (isNaN(amount) || amount <= 0) continue;
          
          matchesForPattern++;
          
          // Try to determine if it's credit or debit
          // For Nigerian statements, might need to look for keywords
          const isCredit = description.toLowerCase().includes('credit') || 
                          description.toLowerCase().includes('deposit') || 
                          description.toLowerCase().includes('transfer received') ||
                          description.toLowerCase().includes('inflow');
          
          const type = isCredit ? 'credit' : 'debit';
          
          // Add to appropriate total
          if (isCredit) {
            totalIncome += amount;
          } else {
            totalExpense += amount;
          }
          
          // Create transaction object
          const transaction: BankTransaction = {
            date,
            description,
            amount,
            type,
            category: categorizeTransaction(description)
          };
          
          console.log(`Found transaction: ${date} | ${description} | ${amount} | ${type}`);
          transactions.push(transaction);
        } catch (error) {
          console.warn('Error processing match:', error);
        }
      }
      
      if (matchesForPattern > 0) {
        console.log(`Found ${matchesForPattern} transactions using pattern: ${pattern.toString().substring(0, 50)}...`);
        totalMatchesFound += matchesForPattern;
      }
      
      // If we found transactions with this pattern, try the next one
      if (matchesForPattern > 0) {
        continue;
      }
      
      // If no matches found with the regular patterns, try line-by-line processing
      if (transactions.length === 0) {
        // Regex patterns for individual elements
        const datePattern = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{1,2}\s+\w+\s+\d{4})/;
        const amountPattern = /₦\s*([0-9,.]+)|([0-9,.]+)/;
        
        for (const line of lines) {
          // Skip header or summary lines
          if (line.includes('BALANCE') || line.includes('STATEMENT') || line.length < 10) {
            continue;
          }
          
          const dateMatch = line.match(datePattern);
          if (!dateMatch) continue;
          
          const amountMatch = line.match(amountPattern);
          if (!amountMatch) continue;
          
          const date = dateMatch[0].trim();
          const amountStr = (amountMatch[1] || amountMatch[2]).replace(/,/g, '');
          const amount = parseFloat(amountStr);
          
          if (isNaN(amount) || amount <= 0) continue;
          
          // Extract description (everything between date and amount)
          const dateIndex = line.indexOf(dateMatch[0]) + dateMatch[0].length;
          const amountIndex = line.lastIndexOf(amountMatch[0]);
          let description = '';
          
          if (amountIndex > dateIndex) {
            description = line.substring(dateIndex, amountIndex).trim().replace(/\s+/g, ' ');
          } else {
            // If we can't determine description position, use the rest of the line
            description = line.substring(dateIndex).replace(amountMatch[0], '').trim();
          }
          
          // Skip if description is too short
          if (description.length < 2) continue;
          
          const isCredit = description.toLowerCase().includes('credit') || 
                           description.toLowerCase().includes('deposit') || 
                           description.toLowerCase().includes('received');
          
          const type = isCredit ? 'credit' : 'debit';
          
          // Add to appropriate total
          if (isCredit) {
            totalIncome += amount;
          } else {
            totalExpense += amount;
          }
          
          // Create transaction object
          const transaction: BankTransaction = {
            date,
            description,
            amount,
            type,
            category: categorizeTransaction(description)
          };
          
          console.log(`Found transaction using line-by-line: ${date} | ${description} | ${amount} | ${type}`);
          transactions.push(transaction);
          totalMatchesFound++;
        }
      }
    }
    
    console.log(`Found ${totalMatchesFound} total transaction matches on page ${pageIndex + 1}`);
  });

  console.log(`Total transactions extracted: ${transactions.length}`);
  console.log(`Total income: $${totalIncome.toFixed(2)}, Total expense: $${totalExpense.toFixed(2)}`);
  
  // Sort transactions by date (newest first)
  transactions.sort((a, b) => {
    try {
      // Try to normalize date formats for proper sorting
      const dateA = new Date(normalizeDateString(a.date));
      const dateB = new Date(normalizeDateString(b.date));
      
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        console.warn('Invalid date format for sorting:', a.date, b.date);
        return 0;
      }
      
      return dateB.getTime() - dateA.getTime();
    } catch (error) {
      console.warn('Error sorting by date:', error);
      return 0;
    }
  });
  
  return {
    transactions,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    startDate: statementStartDate,
    endDate: statementEndDate
  };
};

/**
 * Helper function to normalize date strings for consistent parsing
 */
const normalizeDateString = (dateStr: string): string => {
  // Handle formats like "12 Mar 2025"
  const monthNameFormat = /(\d{1,2})\s+(\w{3})\s+(\d{4})/;
  const monthNameMatch = dateStr.match(monthNameFormat);
  
  if (monthNameMatch) {
    const day = monthNameMatch[1];
    const month = monthNameMatch[2];
    const year = monthNameMatch[3];
    return `${day} ${month} ${year}`;
  }
  
  // Handle dd/mm/yyyy format
  const slashFormat = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
  const slashMatch = dateStr.match(slashFormat);
  
  if (slashMatch) {
    const day = slashMatch[1];
    const month = slashMatch[2];
    const year = slashMatch[3];
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Handle dd-mm-yyyy format
  const dashFormat = /(\d{1,2})-(\d{1,2})-(\d{4})/;
  const dashMatch = dateStr.match(dashFormat);
  
  if (dashMatch) {
    const day = dashMatch[1];
    const month = dashMatch[2];
    const year = dashMatch[3];
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return dateStr;
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
