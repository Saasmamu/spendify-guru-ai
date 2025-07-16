
import { supabase } from '@/lib/supabase';
import { Transaction, SavedAnalysis, CategoryData } from '@/types';

export interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  transactions: Transaction[];
  total_income: number;
  total_expense: number;
  categories: CategoryData[];
  insights: any;
  created_at: string;
  user_id: string;
}

export const saveAnalysis = async (analysis: Omit<SavedAnalysis, 'id' | 'created_at' | 'user_id'>): Promise<SavedAnalysis> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('saved_analyses')
    .insert({
      ...analysis,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSavedAnalyses = async (): Promise<SavedAnalysis[]> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('saved_analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteAnalysis = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('saved_analyses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getAnalysisById = async (id: string): Promise<SavedAnalysis | null> => {
  const { data, error } = await supabase
    .from('saved_analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};

export class StorageService {
  static async deleteAnalysis(id: string): Promise<void> {
    return deleteAnalysis(id);
  }

  static async getSavedAnalyses(): Promise<SavedAnalysis[]> {
    return getSavedAnalyses();
  }

  static async saveAnalysis(analysis: Omit<SavedAnalysis, 'id' | 'created_at' | 'user_id'>): Promise<SavedAnalysis> {
    return saveAnalysis(analysis);
  }

  static async getAnalysisById(id: string): Promise<SavedAnalysis | null> {
    return getAnalysisById(id);
  }
}
