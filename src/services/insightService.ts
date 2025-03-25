
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProcessedStatement } from './pdfService';

// Set the default Gemini API key
const GEMINI_API_KEY = 'AIzaSyAazifqpQ7imFjw57NsrKmelrq1hpEnxbE';

// Initialize the Gemini API with the API key
let genAI: GoogleGenerativeAI | null = null;

/**
 * Initialize the Gemini API client
 */
const initializeGeminiAPI = () => {
  try {
    const apiKey = getGeminiApiKey();
    if (!genAI && apiKey) {
      console.log('Initializing Gemini API with key');
      genAI = new GoogleGenerativeAI(apiKey);
      return true;
    }
    return !!genAI;
  } catch (error) {
    console.error('Error initializing Gemini API:', error);
    return false;
  }
};

/**
 * Set a custom Gemini API key
 */
export const setGeminiApiKey = (key: string) => {
  try {
    console.log('Setting new Gemini API key');
    localStorage.setItem('gemini_api_key', key);
    genAI = new GoogleGenerativeAI(key);
  } catch (error) {
    console.error('Error setting Gemini API key:', error);
    throw new Error('Failed to set API key');
  }
};

/**
 * Get the stored Gemini API key
 */
export const getGeminiApiKey = (): string => {
  return localStorage.getItem('gemini_api_key') || GEMINI_API_KEY;
};

/**
 * Check if Gemini API key is available
 */
export const hasGeminiApiKey = (): boolean => {
  return !!getGeminiApiKey();
};

/**
 * Generate insights based on transaction data using Gemini
 */
export const generateInsights = async (
  statement: ProcessedStatement
): Promise<string[]> => {
  try {
    // Initialize the API
    if (!initializeGeminiAPI()) {
      // Try to use a stored key if available
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        console.log('Using stored API key');
        genAI = new GoogleGenerativeAI(storedKey);
      } else {
        console.error('No Gemini API key available');
        throw new Error('Gemini API key not available');
      }
    }

    // Use the latest Gemini 1.5-flash model as requested
    console.log('Using Gemini 1.5-flash model');
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prepare the prompt with transaction data
    const prompt = `
      Please analyze this financial data from a bank statement and provide 3 concise, actionable insights for the user.
      Focus on spending patterns, potential savings opportunities, and budget recommendations.
      Keep each insight to 1-2 sentences. Format each insight as a separate response.

      Here is the transaction data:
      Total Income: $${statement.totalIncome.toFixed(2)}
      Total Expenses: $${statement.totalExpense.toFixed(2)}
      Current Balance: $${statement.balance.toFixed(2)}
      
      Transactions by Category:
      ${getCategoryBreakdown(statement)}
      
      Top 5 Transactions:
      ${getTopTransactions(statement)}
    `;

    console.log('Sending prompt to Gemini with data summary:', 
      `Income: $${statement.totalIncome.toFixed(2)}, Expenses: $${statement.totalExpense.toFixed(2)}, Categories: ${Object.keys(getCategoryCounts(statement)).length}`);
    
    try {
      // Generate the response with timeout handling
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request to Gemini API timed out after 15 seconds')), 15000)
        )
      ]) as any;
      
      const response = result.response;
      const text = response.text();
      console.log('Received response from Gemini:', text.substring(0, 100) + '...');

      // Split into separate insights
      const insights = text
        .split('\n')
        .filter(line => line.trim().length > 0 && !line.includes('Insight'))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 3);

      if (insights.length === 0) {
        console.warn('No insights found in Gemini response');
        return [
          'Your highest spending category presents an opportunity to reduce expenses.',
          'Consider reviewing your transaction history to identify recurring subscriptions you may no longer need.',
          'Creating a monthly budget based on your recent spending patterns could help improve your financial position.'
        ];
      }

      return insights;
    } catch (apiError) {
      console.error('Error during Gemini API call:', apiError);
      // Try with fallback model if the first attempt fails
      try {
        console.log('Attempting with fallback model gemini-pro');
        const fallbackModel = genAI!.getGenerativeModel({ model: 'gemini-pro' });
        const fallbackResult = await fallbackModel.generateContent(prompt);
        const fallbackText = fallbackResult.response.text();
        
        const fallbackInsights = fallbackText
          .split('\n')
          .filter(line => line.trim().length > 0 && !line.includes('Insight'))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .slice(0, 3);
          
        if (fallbackInsights.length > 0) {
          return fallbackInsights;
        }
        throw new Error('Failed to generate insights with fallback model');
      } catch (fallbackError) {
        console.error('Fallback model also failed:', fallbackError);
        throw apiError; // Throw the original error
      }
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return [
      'Failed to generate AI insights. Please try again or check your internet connection.',
      'Consider reviewing your largest transactions for savings opportunities.',
      'Try categorizing your transactions to better understand spending patterns.'
    ];
  }
};

/**
 * Helper function to get category breakdown for the prompt
 */
const getCategoryBreakdown = (statement: ProcessedStatement): string => {
  const categories = new Map<string, number>();
  
  statement.transactions.forEach(transaction => {
    const category = transaction.category || 'Uncategorized';
    const currentAmount = categories.get(category) || 0;
    categories.set(category, currentAmount + transaction.amount);
  });
  
  return Array.from(categories.entries())
    .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
    .join('\n');
};

/**
 * Helper function to get category counts for better logging
 */
const getCategoryCounts = (statement: ProcessedStatement): Record<string, number> => {
  const categoryCounts: Record<string, number> = {};
  
  statement.transactions.forEach(transaction => {
    const category = transaction.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  return categoryCounts;
};

/**
 * Helper function to get top transactions for the prompt
 */
const getTopTransactions = (statement: ProcessedStatement): string => {
  return statement.transactions
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(t => `${t.description}: $${t.amount.toFixed(2)} (${t.category || 'Uncategorized'})`)
    .join('\n');
};
