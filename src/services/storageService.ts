
import { SavedAnalysis, BankTransaction, CategoryData } from '@/types';

export { SavedAnalysis };

export const saveAnalysis = async (
  name: string,
  transactions: BankTransaction[],
  categories: CategoryData[],
  insights: any
): Promise<SavedAnalysis> => {
  const analysis: SavedAnalysis = {
    id: Date.now().toString(),
    name,
    date: new Date().toISOString(),
    transactions,
    total_income: transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0),
    total_expense: transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0),
    categories,
    insights,
    created_at: new Date().toISOString(),
    user_id: 'current-user'
  };

  const saved = localStorage.getItem('saved-analyses') || '[]';
  const analyses = JSON.parse(saved);
  analyses.push(analysis);
  localStorage.setItem('saved-analyses', JSON.stringify(analyses));
  
  return analysis;
};

export const getSavedAnalyses = async (): Promise<SavedAnalysis[]> => {
  const saved = localStorage.getItem('saved-analyses') || '[]';
  return JSON.parse(saved);
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  const saved = localStorage.getItem('saved-analyses') || '[]';
  const analyses = JSON.parse(saved);
  const filtered = analyses.filter((a: SavedAnalysis) => a.id !== id);
  localStorage.setItem('saved-analyses', JSON.stringify(filtered));
};

export const getAnalysisById = async (id: string): Promise<SavedAnalysis | null> => {
  const analyses = await getSavedAnalyses();
  return analyses.find(a => a.id === id) || null;
};

export class StorageService {
  static async getSavedAnalyses(): Promise<SavedAnalysis[]> {
    return getSavedAnalyses();
  }

  static async deleteSavedAnalysis(id: string): Promise<void> {
    return deleteAnalysis(id);
  }
}
