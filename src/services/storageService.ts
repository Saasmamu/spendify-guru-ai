
import { Transaction, SavedAnalysis } from '@/types';

class StorageService {
  private readonly TRANSACTIONS_KEY = 'bank_transactions';
  private readonly SAVED_ANALYSES_KEY = 'saved_analyses';

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
  }

  getTransactions(): Transaction[] {
    const stored = localStorage.getItem(this.TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  clearTransactions(): void {
    localStorage.removeItem(this.TRANSACTIONS_KEY);
  }

  saveAnalysis(analysis: SavedAnalysis): void {
    const existing = this.getSavedAnalyses();
    const updated = [...existing, analysis];
    localStorage.setItem(this.SAVED_ANALYSES_KEY, JSON.stringify(updated));
  }

  getSavedAnalyses(): SavedAnalysis[] {
    const stored = localStorage.getItem(this.SAVED_ANALYSES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  deleteAnalysis(id: string): void {
    const existing = this.getSavedAnalyses();
    const filtered = existing.filter(analysis => analysis.id !== id);
    localStorage.setItem(this.SAVED_ANALYSES_KEY, JSON.stringify(filtered));
  }

  getAnalysisById(id: string): SavedAnalysis | null {
    const analyses = this.getSavedAnalyses();
    return analyses.find(analysis => analysis.id === id) || null;
  }

  deleteSavedAnalysis(id: string): void {
    this.deleteAnalysis(id);
  }
}

export const storageService = new StorageService();
export { SavedAnalysis };
