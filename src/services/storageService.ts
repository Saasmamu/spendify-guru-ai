
import { SavedAnalysis, BankTransaction } from '@/types';

class StorageService {
  async saveAnalysis(
    name: string,
    transactions: BankTransaction[],
    totalIncome: number,
    totalExpense: number,
    categories: { category: string; amount: number }[],
    insights: string[]
  ): Promise<SavedAnalysis> {
    const analysis: SavedAnalysis = {
      id: Date.now().toString(),
      name,
      date: new Date().toISOString(),
      totalIncome,
      totalExpense,
      categories: categories.map(c => ({ ...c, count: 1 })),
      transactions,
      insights
    };

    const saved = localStorage.getItem('savedAnalyses');
    const analyses = saved ? JSON.parse(saved) : [];
    analyses.push(analysis);
    localStorage.setItem('savedAnalyses', JSON.stringify(analyses));

    return analysis;
  }

  async getSavedAnalyses(): Promise<SavedAnalysis[]> {
    const saved = localStorage.getItem('savedAnalyses');
    return saved ? JSON.parse(saved) : [];
  }

  async deleteAnalysis(id: string): Promise<void> {
    const saved = localStorage.getItem('savedAnalyses');
    if (saved) {
      const analyses = JSON.parse(saved);
      const filtered = analyses.filter((a: SavedAnalysis) => a.id !== id);
      localStorage.setItem('savedAnalyses', JSON.stringify(filtered));
    }
  }

  async getAnalysisById(id: string): Promise<SavedAnalysis | null> {
    const saved = localStorage.getItem('savedAnalyses');
    if (saved) {
      const analyses = JSON.parse(saved);
      return analyses.find((a: SavedAnalysis) => a.id === id) || null;
    }
    return null;
  }
}

export const storageService = new StorageService();

// Export individual functions for backward compatibility
export const saveAnalysis = (
  name: string,
  transactions: BankTransaction[],
  totalIncome: number,
  totalExpense: number,
  categories: { category: string; amount: number }[],
  insights: string[]
) => storageService.saveAnalysis(name, transactions, totalIncome, totalExpense, categories, insights);

export const getSavedAnalyses = () => storageService.getSavedAnalyses();
export const deleteAnalysis = (id: string) => storageService.deleteAnalysis(id);
export const getAnalysisById = (id: string) => storageService.getAnalysisById(id);

// Export types
export type { SavedAnalysis };
