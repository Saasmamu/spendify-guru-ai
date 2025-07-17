
import { SavedAnalysis } from '@/types';

export const saveAnalysis = async (analysis: Omit<SavedAnalysis, 'id' | 'created_at'>): Promise<SavedAnalysis> => {
  const saved: SavedAnalysis = {
    ...analysis,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  const existing = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
  existing.push(saved);
  localStorage.setItem('savedAnalyses', JSON.stringify(existing));
  
  return saved;
};

export const getSavedAnalyses = async (): Promise<SavedAnalysis[]> => {
  const saved = localStorage.getItem('savedAnalyses');
  return saved ? JSON.parse(saved) : [];
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  const existing = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
  const filtered = existing.filter((analysis: SavedAnalysis) => analysis.id !== id);
  localStorage.setItem('savedAnalyses', JSON.stringify(filtered));
};

export const getAnalysisById = async (id: string): Promise<SavedAnalysis | null> => {
  const existing = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
  return existing.find((analysis: SavedAnalysis) => analysis.id === id) || null;
};

export const getAnalyses = getSavedAnalyses;
export const deleteSavedAnalysis = deleteAnalysis;

export default {
  saveAnalysis,
  getSavedAnalyses,
  deleteAnalysis,
  getAnalysisById,
  getAnalyses,
  deleteSavedAnalysis
};
