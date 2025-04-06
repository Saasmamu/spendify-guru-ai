import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import { BankTransaction, ProcessedStatement } from './pdfService';
import { getGeminiApiKey } from './insightService';

interface ImageProcessingOptions {
  maxImageSize?: number; // Maximum size in bytes
}

const defaultOptions: ImageProcessingOptions = {
  maxImageSize: 4 * 1024 * 1024, // 4MB
};

/**
 * Convert an image file to a base64 string for API consumption
 */
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

/**
 * Extract bank transactions from an image using Gemini 1.5-flash
 */
export async function extractTransactionsFromImage(
  imageFile: File,
  options: ImageProcessingOptions = defaultOptions
): Promise<ProcessedStatement> {
  console.log(`Starting image processing for file: ${imageFile.name}, Size: ${imageFile.size} bytes`);
  
  if (imageFile.size > (options.maxImageSize || defaultOptions.maxImageSize)) {
    throw new Error(`Image file size (${(imageFile.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(options.maxImageSize || defaultOptions.maxImageSize) / 1024 / 1024}MB).`);
  }

  try {
    // Initialize the Gemini API
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not available');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Using Gemini 1.5-flash model for image processing');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert image to base64
    const imageBase64 = await imageToBase64(imageFile);
    console.log('Image converted to base64, sending to Gemini API');

    // Create the prompt for transaction extraction
    const prompt = `
      Extract all bank transactions from this bank statement image.
      For each transaction, identify:
      1. Date (in format YYYY-MM-DD if possible)
      2. Description/Narrative
      3. Amount (as a number)
      4. Type (CREDIT for incoming money, DEBIT for outgoing money)
      5. Category (e.g., Food, Transport, Salary, etc. based on the description)

      Return the data in this JSON format:
      {
        "transactions": [
          {
            "date": "YYYY-MM-DD",
            "description": "Transaction description",
            "amount": 123.45,
            "type": "DEBIT or CREDIT",
            "category": "Category name"
          }
        ],
        "balance": 1234.56,
        "accountHolder": "Account holder name if available",
        "accountNumber": "Account number if available",
        "period": "Statement period if available",
        "bankName": "Bank name if available"
      }

      IMPORTANT:
      - Make sure "amount" is a number, not a string
      - Ensure each transaction has all fields
      - Infer the transaction type based on context - CREDIT for incoming money, DEBIT for outgoing
      - Categorize each transaction based on its description
      - Set the balance as the final account balance if available
    `;

    // Generate content using the Gemini model with properly formatted request
    console.log('Sending request to Gemini for transaction extraction');
    const result: GenerateContentResult = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: imageBase64.split(',')[1] // Remove the data URL prefix
        }
      }
    ]);

    const response = result.response;
    const text = response.text();
    console.log('Received response from Gemini:', text.substring(0, 200) + '...');
    
    // Extract the JSON part from the response
    const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/) || 
                      text.match(/{[\s\S]*}/) || 
                      [null, text];
    
    const jsonString = jsonMatch[1]?.trim() || text.trim();
    console.log('Extracted JSON string:', jsonString.substring(0, 200) + '...');
    
    try {
      // Parse the extracted JSON
      const parsedData = JSON.parse(jsonString);
      
      // Process the extracted data
      const transactions: BankTransaction[] = (parsedData.transactions || []).map((t: any) => {
        // Standardize the transaction type to uppercase for comparison but use lowercase for the actual value
        const transactionTypeUpper = t.type?.toUpperCase();
        
        // Using explicit type assertion to match the expected BankTransaction type
        return {
          date: t.date,
          description: t.description,
          amount: typeof t.amount === 'number' ? t.amount : parseFloat(t.amount),
          // Convert to lowercase to match the expected 'debit' | 'credit' type
          type: transactionTypeUpper === 'CREDIT' ? 'credit' : 'debit',
          category: t.category || categorizeTransaction(t.description)
        };
      });
      
      console.log(`Successfully extracted ${transactions.length} transactions from image`);
      
      // Calculate totals
      let totalIncome = 0;
      let totalExpense = 0;
      
      transactions.forEach(transaction => {
        if (transaction.type === 'credit') {
          totalIncome += transaction.amount;
        } else {
          totalExpense += transaction.amount;
        }
      });
      
      // Create the processed statement
      const result: ProcessedStatement = {
        transactions,
        totalIncome,
        totalExpense
      };
      
      // Add balance if available from parsing or calculated
      if (parsedData.balance) {
        result.balance = typeof parsedData.balance === 'number' ? 
          parsedData.balance : parseFloat(parsedData.balance);
      } else {
        result.balance = totalIncome - totalExpense;
      }
      
      return result;
    } catch (jsonError) {
      console.error('Error parsing JSON from Gemini response:', jsonError);
      throw new Error('Failed to parse transaction data from the image');
    }
  } catch (error) {
    console.error('Error extracting transactions from image:', error);
    if (error.message.includes('apiKey')) {
      throw new Error('Gemini API key is missing. Please set your API key to use this feature.');
    }
    throw error;
  }
}

/**
 * Simple transaction categorization based on keywords
 */
function categorizeTransaction(description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.match(/salary|payroll|wages|income|dividend/)) return 'Income';
  if (desc.match(/grocery|food|restaurant|cafe|dining|supermarket|market/)) return 'Food & Dining';
  if (desc.match(/uber|bolt|taxi|transport|train|bus|flight|airfare|airline|travel/)) return 'Transportation';
  if (desc.match(/rent|mortgage|house|apartment|accommodation/)) return 'Housing';
  if (desc.match(/internet|wifi|mobile|phone|cell|utility|electric|water|gas/)) return 'Utilities';
  if (desc.match(/netflix|spotify|subscription|amazon prime|disney/)) return 'Subscriptions';
  if (desc.match(/transfer|sent|payment|paym/)) return 'Transfer';
  if (desc.match(/withdraw|atm|cash/)) return 'Cash Withdrawal';
  if (desc.match(/fee|charge|interest/)) return 'Fees & Charges';
  if (desc.match(/health|doctor|medical|pharmacy|hospital|clinic/)) return 'Healthcare';
  if (desc.match(/education|school|tuition|course|class|training/)) return 'Education';
  
  return 'Miscellaneous';
}
