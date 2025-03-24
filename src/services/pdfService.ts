
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
  balance?: number;
  reference?: string;
  channel?: string;
}

export interface ProcessedStatement {
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  startDate?: string;
  endDate?: string;
  accountName?: string;
  accountNumber?: string;
}

/**
 * Extracts text content from a PDF file with improved line breaks handling
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
      
      // Try an alternative approach
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
  let accountName = '';
  let accountNumber = '';
  
  let statementStartDate: string | undefined;
  let statementEndDate: string | undefined;
  
  // Try to extract statement period and account info from the first page
  if (textContent.length > 0) {
    const firstPage = textContent[0];
    
    // Extract account name
    const accountNameMatch = firstPage.match(/Account Name\s+([^\n]+)/);
    if (accountNameMatch) {
      accountName = accountNameMatch[1].trim();
      console.log('Found account name:', accountName);
    }
    
    // Extract account number
    const accountNumberMatch = firstPage.match(/Account Number\s+([0-9]+)/);
    if (accountNumberMatch) {
      accountNumber = accountNumberMatch[1].trim();
      console.log('Found account number:', accountNumber);
    }
    
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

  // Process table rows in Nigerian bank statement format
  // Patterns to extract transaction rows
  const lookForTransactionTable = (text: string) => {
    // Find table header and transaction rows
    const tableHeaderPattern = /Trans Date\s+Value Date\s+Description\s+Debit\/Credit\s+Balance/i;
    const hasTransactionTable = tableHeaderPattern.test(text);
    
    if (hasTransactionTable) {
      console.log('Found transaction table header - using table parsing logic');
      
      // Split by lines to process each row
      const lines = text.split('\n');
      let inTransactionSection = false;
      
      // Process each line as a potential transaction
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if we've found the transaction table header
        if (tableHeaderPattern.test(line)) {
          inTransactionSection = true;
          console.log('Found transaction table header at line', i);
          continue;
        }
        
        // Skip if not in transaction section or empty line
        if (!inTransactionSection || line.length < 10) continue;
        
        // Check for date pattern at beginning of line (indicating a transaction row)
        const datePattern = /^\d{1,2}\s+\w{3}\s+\d{4}/;
        if (!datePattern.test(line)) continue;
        
        // Try to parse transaction row - this handles the specific format in the PDF
        try {
          // Based on the PDF format - extract parts using position
          const parts = line.split(/\s{2,}/); // Split by 2+ spaces
          
          if (parts.length >= 5) {
            const transDate = parts[0].trim();
            const valueDate = parts[1].trim();
            const description = parts[2].trim();
            
            // Extract debit/credit value
            let amount = 0;
            let type: 'debit' | 'credit' = 'debit';
            
            // Check for + prefix (credit) or - prefix (debit) in amount field
            const amountStr = parts[3].trim();
            if (amountStr.startsWith('+')) {
              // Credit (money in)
              type = 'credit';
              amount = parseFloat(amountStr.replace(/[+₦,]/g, ''));
              totalIncome += amount;
            } else if (amountStr.startsWith('-')) {
              // Debit (money out)
              type = 'debit';
              amount = parseFloat(amountStr.replace(/[-₦,]/g, ''));
              totalExpense += amount;
            } else {
              // If no prefix, try to determine type based on description
              const amountNum = parseFloat(amountStr.replace(/[₦,]/g, ''));
              
              if (description.toLowerCase().includes('credit') || 
                 description.toLowerCase().includes('from')) {
                type = 'credit';
                totalIncome += amountNum;
              } else {
                type = 'debit'; 
                totalExpense += amountNum;
              }
              
              amount = amountNum;
            }
            
            // Extract balance
            const balanceStr = parts[4].trim();
            const balance = parseFloat(balanceStr.replace(/[₦,]/g, ''));
            
            // Extract channel and reference if available
            let channel = '';
            let reference = '';
            
            if (parts.length > 5) {
              channel = parts[5].trim();
            }
            
            if (parts.length > 6) {
              reference = parts[6].trim();
            }
            
            // Create transaction object
            const transaction: BankTransaction = {
              date: valueDate, // Use value date as the actual transaction date
              description,
              amount,
              type,
              balance,
              channel,
              reference,
              category: categorizeTransaction(description)
            };
            
            console.log(`Found transaction: ${valueDate} | ${description} | ${amount} | ${type}`);
            transactions.push(transaction);
          }
        } catch (error) {
          console.warn('Error parsing transaction row:', error);
        }
      }
    }
  };
  
  // Process each page of text
  textContent.forEach((pageText, pageIndex) => {
    console.log(`Processing text from page ${pageIndex + 1}, length: ${pageText.length} characters`);
    
    // Look for transaction tables in each page
    lookForTransactionTable(pageText);
  });
  
  // If no transactions were found with table parsing, try line-by-line parsing with Nigerian patterns
  if (transactions.length === 0) {
    console.log('No transactions found with table parsing, trying line-by-line approach');
    
    // Multiple patterns to match transactions in different formats for Nigerian banks
    const patterns = [
      // Pattern for Nigerian bank transfers
      /(\d{1,2}\s+\w+\s+\d{4})\s+(\d{1,2}\s+\w+\s+\d{4})\s+Transfer\s+(to|from)\s+(.*?)\s+([-+]?[0-9,.]+)\s+([0-9,.]+)/gi,
      
      // Pattern for airtime and other transactions
      /(\d{1,2}\s+\w+\s+\d{4})\s+(\d{1,2}\s+\w+\s+\d{4})\s+Airtime\s+([-+]?[0-9,.]+)\s+([0-9,.]+)/gi,
      
      // Pattern for USSD transactions
      /(\d{1,2}\s+\w+\s+\d{4})\s+(\d{1,2}\s+\w+\s+\d{4})\s+USSD\s+Charge\s+([-+]?[0-9,.]+)\s+([0-9,.]+)/gi
    ];
    
    // Process each page with patterns
    textContent.forEach((pageText, pageIndex) => {
      console.log(`Trying pattern matching on page ${pageIndex + 1}`);
      
      for (const pattern of patterns) {
        let match;
        pattern.lastIndex = 0; // Reset regex index
        
        while ((match = pattern.exec(pageText)) !== null) {
          try {
            const transDate = match[1];
            const valueDate = match[2];
            let description = '';
            let amountStr = '';
            let balanceStr = '';
            
            if (pattern.source.includes('Transfer')) {
              const direction = match[3]; // "to" or "from"
              const partyName = match[4];
              description = `Transfer ${direction} ${partyName}`;
              amountStr = match[5];
              balanceStr = match[6];
            } else if (pattern.source.includes('Airtime')) {
              description = 'Airtime';
              amountStr = match[3];
              balanceStr = match[4];
            } else if (pattern.source.includes('USSD')) {
              description = 'USSD Charge';
              amountStr = match[3];
              balanceStr = match[4];
            }
            
            // Determine type and amount
            let type: 'debit' | 'credit' = 'debit';
            let amount = 0;
            
            if (amountStr.startsWith('+')) {
              type = 'credit';
              amount = parseFloat(amountStr.replace(/[+₦,]/g, ''));
              totalIncome += amount;
            } else if (amountStr.startsWith('-')) {
              type = 'debit';
              amount = parseFloat(amountStr.replace(/[-₦,]/g, ''));
              totalExpense += amount;
            } else {
              // If no prefix, determine by description
              if (description.toLowerCase().includes('from')) {
                type = 'credit';
              } else {
                type = 'debit';
              }
              amount = parseFloat(amountStr.replace(/[₦,]/g, ''));
              
              if (type === 'credit') {
                totalIncome += amount;
              } else {
                totalExpense += amount;
              }
            }
            
            const balance = parseFloat(balanceStr.replace(/[₦,]/g, ''));
            
            // Create transaction object
            const transaction: BankTransaction = {
              date: valueDate,
              description,
              amount,
              type,
              balance,
              category: categorizeTransaction(description)
            };
            
            console.log(`Found transaction with pattern: ${valueDate} | ${description} | ${amount} | ${type}`);
            transactions.push(transaction);
          } catch (error) {
            console.warn('Error processing pattern match:', error);
          }
        }
      }
    });
  }

  // If still no transactions found, check for lines with specific patterns in Nigerian statements
  if (transactions.length === 0) {
    console.log('Trying additional pattern matching for Nigerian bank statements');
    
    textContent.forEach((pageText) => {
      const lines = pageText.split('\n');
      
      lines.forEach(line => {
        // Look for specific patterns in each line
        if (line.includes('Transfer to') || line.includes('Transfer from')) {
          try {
            // Extract dates, typically at the start of the line
            const datePattern = /(\d{1,2}\s+\w+\s+\d{4})/g;
            const dates = [...line.matchAll(datePattern)].map(m => m[0]);
            
            if (dates.length >= 2) {
              const transDate = dates[0];
              const valueDate = dates[1];
              
              // Extract description
              let description = '';
              if (line.includes('Transfer to')) {
                const toMatch = line.match(/Transfer to\s+(.*?)(?=\s+[-+])/);
                description = toMatch ? `Transfer to ${toMatch[1]}` : 'Transfer out';
              } else {
                const fromMatch = line.match(/Transfer from\s+(.*?)(?=\s+[-+])/);
                description = fromMatch ? `Transfer from ${fromMatch[1]}` : 'Transfer in';
              }
              
              // Extract amount
              const amountPattern = /([-+]?[0-9,.]+)/g;
              const amounts = [...line.matchAll(amountPattern)].map(m => m[0]);
              
              if (amounts.length >= 2) {
                const amountStr = amounts[0];
                const balanceStr = amounts[1];
                
                // Determine type and parse amount
                let type: 'debit' | 'credit';
                let amount: number;
                
                if (amountStr.startsWith('-') || line.includes('Transfer to')) {
                  type = 'debit';
                  amount = parseFloat(amountStr.replace(/[-₦,]/g, ''));
                  totalExpense += amount;
                } else {
                  type = 'credit';
                  amount = parseFloat(amountStr.replace(/[+₦,]/g, ''));
                  totalIncome += amount;
                }
                
                const balance = parseFloat(balanceStr.replace(/[₦,]/g, ''));
                
                // Extract channel if available
                const channelMatch = line.match(/(?:E-Channel|USSD|SMS)\s+(\S+)/);
                const channel = channelMatch ? channelMatch[0] : '';
                
                const transaction: BankTransaction = {
                  date: valueDate,
                  description,
                  amount,
                  type,
                  balance,
                  channel,
                  category: categorizeTransaction(description)
                };
                
                console.log(`Found transaction from line: ${valueDate} | ${description} | ${amount} | ${type}`);
                transactions.push(transaction);
              }
            }
          } catch (error) {
            console.warn('Error processing line:', error);
          }
        }
      });
    });
  }

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
    endDate: statementEndDate,
    accountName,
    accountNumber
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
    { name: 'Telecom', keywords: ['airtime', 'data', 'recharge', 'ussd', 'telecom', 'communication', 'mobile', 'phone', 'cellular', 'network', 'internet'] },
    { name: 'Income', keywords: ['salary', 'payroll', 'deposit', 'direct deposit', 'income', 'revenue', 'payment received', 'wage', 'earnings', 'compensation', 'bonus'] },
    { name: 'Investments', keywords: ['invest', 'stock', 'dividend', 'bond', 'mutual fund', 'etf', 'retirement', 'ira', '401k', 'trading', 'portfolio'] },
    { name: 'Debt', keywords: ['loan', 'credit card', 'payment', 'interest', 'debt', 'finance charge', 'late fee', 'minimum payment'] },
    { name: 'Transfers', keywords: ['transfer', 'send money', 'receive money', 'wire', 'zelle', 'venmo', 'cashapp', 'paypal'] }
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
    
    // If no transactions were found, try one last fallback - look for specific patterns in the Nigerian bank statement
    if (processedData.transactions.length === 0) {
      console.log('No transactions found with regular methods, trying final fallback');
      
      // Extract data from table using a more direct approach
      let fallbackTransactions: BankTransaction[] = [];
      
      // Look for lines that have patterns matching transactions in the PDF shown
      textContent.forEach(pageText => {
        const lines = pageText.split('\n');
        
        lines.forEach(line => {
          // Check for patterns like "Transfer to" or "Transfer from" followed by amounts
          if (line.match(/\d{2}\s+\w{3}\s+\d{4}.*Transfer\s+(to|from)/i)) {
            try {
              // Extract transaction details using more flexible approach
              const dateMatch = line.match(/^(\d{2}\s+\w{3}\s+\d{4})/);
              const isDebit = line.includes('Transfer to') || line.includes('-');
              const isCredit = line.includes('Transfer from') || line.includes('+');
              
              // Find amount using a looser pattern - find numbers with decimal points
              const amountMatches = [...line.matchAll(/[-+]?[\d,]+\.\d{2}/g)].map(m => m[0]);
              
              if (dateMatch && amountMatches.length > 0) {
                const valueDate = dateMatch[0];
                
                // Extract description
                let description = '';
                if (isDebit) {
                  const toMatch = line.match(/Transfer to\s+([^-+]+)/);
                  description = toMatch ? `Transfer to ${toMatch[1].trim()}` : 'Transfer out';
                } else {
                  const fromMatch = line.match(/Transfer from\s+([^-+]+)/);
                  description = fromMatch ? `Transfer from ${fromMatch[1].trim()}` : 'Transfer in';
                }
                
                // Extract amount and balance - typically the first two numbers
                let amount = 0;
                let balance = 0;
                
                // Clean and parse amount - remove currency symbols and commas
                const cleanAmount = amountMatches[0].replace(/[₦,]/g, '').replace(/^[-+]/, '');
                amount = parseFloat(cleanAmount);
                
                if (amountMatches.length > 1) {
                  const cleanBalance = amountMatches[1].replace(/[₦,]/g, '');
                  balance = parseFloat(cleanBalance);
                }
                
                // Extract channel if present
                const channelMatch = line.match(/E-Channel|USSD|SMS/);
                const channel = channelMatch ? channelMatch[0] : '';
                
                // Create transaction
                const transaction: BankTransaction = {
                  date: valueDate,
                  description,
                  amount,
                  type: isDebit ? 'debit' : 'credit',
                  balance,
                  channel,
                  category: categorizeTransaction(description)
                };
                
                console.log(`Fallback found: ${valueDate} | ${description} | ${amount} | ${isDebit ? 'debit' : 'credit'}`);
                fallbackTransactions.push(transaction);
                
                // Update totals
                if (isDebit) {
                  processedData.totalExpense += amount;
                } else {
                  processedData.totalIncome += amount;
                }
              }
            } catch (error) {
              console.warn('Error in fallback transaction parsing:', error);
            }
          }
        });
      });
      
      // Add fallback transactions to the processed data
      if (fallbackTransactions.length > 0) {
        processedData.transactions = fallbackTransactions;
        processedData.balance = processedData.totalIncome - processedData.totalExpense;
        console.log(`Found ${fallbackTransactions.length} transactions using fallback method`);
      }
    }
    
    return processedData;
  } catch (error) {
    console.error('=== ERROR PROCESSING BANK STATEMENT ===');
    console.error('Error details:', error);
    throw new Error(`Failed to process bank statement: ${error instanceof Error ? error.message : String(error)}`);
  }
};
