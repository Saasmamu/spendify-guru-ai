
import { Transaction } from '@/types';

class StorageService {
  private readonly STORAGE_KEY = 'financial_data';

  saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  }

  loadTransactions(): Transaction[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load transactions:', error);
      return [];
    }
  }

  clearTransactions(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear transactions:', error);
    }
  }

  saveAnalysis(name: string, data: any): void {
    try {
      const analyses = this.getSavedAnalyses();
      analyses[name] = {
        data,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('saved_analyses', JSON.stringify(analyses));
    } catch (error) {
      console.error('Failed to save analysis:', error);
    }
  }

  getSavedAnalyses(): Record<string, any> {
    try {
      const data = localStorage.getItem('saved_analyses');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load saved analyses:', error);
      return {};
    }
  }

  deleteAnalysis(name: string): void {
    try {
      const analyses = this.getSavedAnalyses();
      delete analyses[name];
      localStorage.setItem('saved_analyses', JSON.stringify(analyses));
    } catch (error) {
      console.error('Failed to delete analysis:', error);
    }
  }
}

export const StorageService = new StorageService();
export const storageService = StorageService;
