interface Analysis {
  id: string;
  name: string;
  // Add other properties as needed
}

class StorageServiceClass {
  async saveAnalysis(analysis: any): Promise<void> {
    try {
      const analyses = await this.getAnalyses();
      const newAnalysis = {
        id: Date.now().toString(),
        ...analysis,
        savedAt: new Date().toISOString(),
      };
      analyses.push(newAnalysis);
      localStorage.setItem('savedAnalyses', JSON.stringify(analyses));
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  }

  async getAnalyses(): Promise<any[]> {
    try {
      const stored = localStorage.getItem('savedAnalyses');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting analyses:', error);
      return [];
    }
  }

  async deleteAnalysis(id: string): Promise<void> {
    try {
      const analyses = await this.getAnalyses();
      const filtered = analyses.filter(analysis => analysis.id !== id);
      localStorage.setItem('savedAnalyses', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  }

  async saveTransaction(transaction: any): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      transactions.push({
        id: Date.now().toString(),
        ...transaction,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }

  async getTransactions(): Promise<any[]> {
    try {
      const stored = localStorage.getItem('transactions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }
}

export const storageService = new StorageServiceClass();
export const StorageService = storageService; // For backward compatibility
export default storageService;
