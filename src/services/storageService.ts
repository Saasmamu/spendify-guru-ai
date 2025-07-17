
import { SavedAnalysis } from '@/types';

// Mock implementation of storage service
const mockAnalyses: SavedAnalysis[] = [];

export const saveAnalysis = async (
  name: string,
  description: string,
  data: any,
  userId: string,
  analysisType?: string,
  metadata?: any
): Promise<SavedAnalysis> => {
  const analysis: SavedAnalysis = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    description,
    data,
    created_at: new Date().toISOString(),
    user_id: userId
  };
  
  mockAnalyses.push(analysis);
  return analysis;
};

export const getSavedAnalyses = async (userId?: string): Promise<SavedAnalysis[]> => {
  if (!userId) return mockAnalyses;
  return mockAnalyses.filter(analysis => analysis.user_id === userId);
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  const index = mockAnalyses.findIndex(analysis => analysis.id === id);
  if (index > -1) {
    mockAnalyses.splice(index, 1);
  }
};

export const getAnalysisById = async (id: string): Promise<SavedAnalysis | null> => {
  return mockAnalyses.find(analysis => analysis.id === id) || null;
};

// Create a storage service object for default export
const storageService = {
  saveAnalysis,
  getSavedAnalyses,
  deleteAnalysis,
  getAnalysisById
};

// Named export for SavedAnalysis type
export type { SavedAnalysis };

// Both named and default exports
export { storageService };
export default storageService;
