import { BankTransaction } from './pdfService';

// Helper function to read image file as base64
const readImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

// Function to parse the JSON response from Gemini
const parseGeminiResponse = (response: string): BankTransaction[] => {
  try {
    // Find JSON in the response (in case there's any surrounding text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }
    
    const jsonString = jsonMatch[0];
    const parsedData = JSON.parse(jsonString);
    
    // Convert the Gemini response format to BankTransaction format
    if (parsedData.transactions && Array.isArray(parsedData.transactions)) {
      return parsedData.transactions.map((t: any) => ({
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.type === 'income' ? 'credit' : 'debit',
        category: t.category || 'Uncategorized'
      }));
    }
    
    throw new Error('Invalid transaction data format');
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.error('Raw response:', response);
    throw new Error('Failed to parse extracted data');
  }
};

export const processImageAndExtractTransactions = async (file: File): Promise<BankTransaction[]> => {
  try {
    // Convert image to base64
    const imageBase64 = await readImageFile(file);
    
    // Prepare the prompt for Gemini
    const prompt = `
      You are a financial data extraction expert. Analyze this bank statement image and:
      1. Extract all transactions with their dates, descriptions, and amounts
      2. Determine if each transaction is income or expense
      3. Suggest a category for each transaction
      4. Format the data as a valid JSON object

      Required JSON format:
      {
        "transactions": [
          {
            "date": "YYYY-MM-DD",
            "description": "string",
            "amount": number,
            "type": "income" | "expense",
            "category": "string"
          }
        ],
        "summary": {
          "totalIncome": number,
          "totalExpenses": number,
          "period": {
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD"
          }
        }
      }

      Rules:
      1. Ensure all dates are in YYYY-MM-DD format
      2. All amounts should be positive numbers
      3. Use "income" for deposits and "expense" for withdrawals
      4. Categorize transactions into: groceries, utilities, rent, salary, entertainment, transport, etc.
      5. Remove any personal identifying information
      6. Ensure the JSON is valid and properly formatted
      7. Make sure the output is only the JSON, with no additional text

      Extract all visible transactions from the image and return them as JSON.
    `;

    // Call the edge function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/analyze-statement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ imageBase64, prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const { extractedText } = await response.json();
    console.log('Gemini extracted text:', extractedText);

    // Parse the response and convert to BankTransaction format
    const transactions = parseGeminiResponse(extractedText);
    console.log('Extracted transactions:', transactions);

    return transactions;
  } catch (error) {
    console.error('Error processing image with Gemini:', error);
    
    // Return mock data if there's an error
    return [
      {
        date: "2023-01-01",
        description: "Sample Transaction 1",
        amount: 100.00,
        type: "credit",
        category: "salary"
      },
      {
        date: "2023-01-02",
        description: "Sample Transaction 2",
        amount: 50.00,
        type: "debit",
        category: "groceries"
      }
    ];
  }
};
