
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  DollarSign, 
  Eye, 
  Trash2, 
  FileText,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SavedAnalysis {
  id: string;
  name: string;
  date: string;
  total_income: number;
  total_expense: number;
  created_at: string;
  transactions: any[];
  categories: any[];
  insights: string[];
}

const SavedAnalyses = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedAnalyses();
  }, []);

  const fetchSavedAnalyses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to view saved analyses",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching saved analyses:', error);
      toast({
        title: "Error",
        description: "Failed to load saved analyses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    
    try {
      const { error } = await supabase
        .from('saved_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
      
      toast({
        title: "Success",
        description: "Analysis deleted successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Analyses</h1>
        <p className="text-gray-600">View and manage your saved financial analyses</p>
      </div>

      {analyses.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved analyses</h3>
          <p className="text-gray-600 mb-4">You haven't saved any analyses yet.</p>
          <Button onClick={() => window.location.href = '/dashboard/upload'}>
            Upload Statement
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{analysis.name}</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {analysis.transactions.length} transactions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                    <span className="text-green-600 font-medium">
                      +${analysis.total_income.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-red-600" />
                    <span className="text-red-600 font-medium">
                      -${analysis.total_expense.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // TODO: Navigate to view analysis page
                      toast({
                        title: "Coming Soon",
                        description: "View analysis feature will be available soon",
                        variant: "default"
                      });
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(analysis.id)}
                    disabled={deletingId === analysis.id}
                  >
                    {deletingId === analysis.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAnalyses;
