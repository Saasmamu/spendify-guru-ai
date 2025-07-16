
import { supabase } from '@/lib/supabase';
import { SavedAnalysis } from '@/types';

export class StorageService {
  static async saveAnalysis(analysis: Omit<SavedAnalysis, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('saved_analyses')
      .insert(analysis)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSavedAnalyses(): Promise<SavedAnalysis[]> {
    const { data, error } = await supabase
      .from('saved_analyses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteAnalysis(id: string) {
    const { error } = await supabase
      .from('saved_analyses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const storageService = new StorageService();
