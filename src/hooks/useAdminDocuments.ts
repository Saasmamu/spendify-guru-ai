import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/useToast';
import { useAdmin } from '@/contexts/AdminContext';

export function useAdminDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState({
    documents: true,
    templates: true,
    errors: true,
    stats: true,
  });
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { adminUser } = useAdmin();

  const fetchDocuments = useCallback(async () => {
    setLoading(prev => ({ ...prev, documents: true }));
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error);
        toast({
          title: 'Error fetching documents',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setDocuments(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
      toast({
        title: 'Unexpected error',
        description: 'Could not retrieve documents.',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, documents: false }));
    }
  }, [toast]);

  const fetchTemplates = useCallback(async () => {
    setLoading(prev => ({ ...prev, templates: true }));
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error);
        toast({
          title: 'Error fetching templates',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setTemplates(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch templates'));
      toast({
        title: 'Unexpected error',
        description: 'Could not retrieve document templates.',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, templates: false }));
    }
  }, [toast]);

  const fetchErrors = useCallback(async () => {
    setLoading(prev => ({ ...prev, errors: true }));
    try {
      const { data, error } = await supabase
        .from('document_errors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error);
        toast({
          title: 'Error fetching errors',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setErrors(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch errors'));
      toast({
        title: 'Unexpected error',
        description: 'Could not retrieve document errors.',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, errors: false }));
    }
  }, [toast]);

  const fetchStats = useCallback(async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const { data, error } = await supabase
        .from('document_stats')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        setError(error);
        toast({
          title: 'Error fetching stats',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setStats(data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      toast({
        title: 'Unexpected error',
        description: 'Could not retrieve document statistics.',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, [toast]);

  useEffect(() => {
    fetchDocuments();
    fetchTemplates();
    fetchErrors();
    fetchStats();
  }, [fetchDocuments, fetchTemplates, fetchErrors, fetchStats]);

  const prioritizeDocument = async (documentId: string) => {
    try {
      const { error } = await supabase.rpc('prioritize_document', {
        document_id: documentId,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Prioritize document failed:', err);
      throw err instanceof Error ? err : new Error('Failed to prioritize document');
    }
  };

  const cancelProcessing = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status: 'cancelled' })
        .eq('id', documentId);

      if (error) {
        throw error;
      }
      // Refresh documents after cancelling
      await fetchDocuments();
    } catch (err) {
      console.error('Cancel processing failed:', err);
      throw err instanceof Error ? err : new Error('Failed to cancel processing');
    }
  };

  const retryProcessing = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status: 'pending' })
        .eq('id', documentId);

      if (error) {
        throw error;
      }
      // Refresh documents after retrying
      await fetchDocuments();
    } catch (err) {
      console.error('Retry processing failed:', err);
      throw err instanceof Error ? err : new Error('Failed to retry processing');
    }
  };

  const activateTemplate = async (templateId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .update({ is_active: isActive })
        .eq('id', templateId);

      if (error) {
        throw error;
      }
      // Refresh templates after activating/deactivating
      await fetchTemplates();
    } catch (err) {
      console.error('Activate template failed:', err);
      throw err instanceof Error ? err : new Error('Failed to activate template');
    }
  };

  const markErrorResolved = async (errorId: string) => {
    try {
      const { error } = await supabase
        .from('document_errors')
        .update({ resolved_at: new Date() })
        .eq('id', errorId);

      if (error) {
        throw error;
      }
      // Refresh errors after marking as resolved
      await fetchErrors();
    } catch (err) {
      console.error('Mark error resolved failed:', err);
      throw err instanceof Error ? err : new Error('Failed to mark error as resolved');
    }
  };

  return {
    documents,
    templates,
    errors,
    stats,
    loading,
    error,
    refreshDocuments: fetchDocuments,
    refreshTemplates: fetchTemplates,
    refreshErrors: fetchErrors,
    refreshStats: fetchStats,
    prioritizeDocument,
    cancelProcessing,
    retryProcessing,
    activateTemplate,
    markErrorResolved,
  };
}
