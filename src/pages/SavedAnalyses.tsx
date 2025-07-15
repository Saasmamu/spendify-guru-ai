
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Trash2, Eye, Search, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SavedAnalysis } from '@/types';
import { useToast } from '@/hooks/useToast';

export default function SavedAnalyses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    fetchSavedAnalyses();
  }, [user]);

  const fetchSavedAnalyses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const analyses = data?.map(item => ({
        id: item.id,
        name: item.name,
        date: item.date,
        transactions: item.transactions,
        totalIncome: item.total_income,
        totalExpense: item.total_expense,
        categories: item.categories,
        insights: item.insights
      })) || [];

      setSavedAnalyses(analyses);
    } catch (error) {
      console.error('Error fetching saved analyses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved analyses',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      const { error } = await supabase
        .from('saved_analyses')
        .delete()
        .eq('id', analysisId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSavedAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
      toast({
        title: 'Success',
        description: 'Analysis deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete analysis',
        variant: 'destructive'
      });
    }
  };

  const filteredAnalyses = savedAnalyses
    .filter(analysis => 
      analysis.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'income':
          return b.totalIncome - a.totalIncome;
        case 'expenses':
          return b.totalExpense - a.totalExpense;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading saved analyses...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Saved Analyses</h1>
            <p className="text-muted-foreground">
              View and manage your saved financial analyses
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="income">Sort by Income</SelectItem>
                <SelectItem value="expenses">Sort by Expenses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredAnalyses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Saved Analyses</h2>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'No analyses match your search criteria.'
                  : 'You haven\'t saved any analyses yet. Analyze a document first.'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => window.location.href = '/analyze'}>
                  Analyze Document
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map((analysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {analysis.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{analysis.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAnalysis(analysis.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(analysis.date), 'MMM dd, yyyy')}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Income:</span>
                      <span className="font-medium text-green-600">
                        ${analysis.totalIncome.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Expenses:</span>
                      <span className="font-medium text-red-600">
                        ${analysis.totalExpense.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Net Flow:</span>
                      <div className="flex items-center gap-1">
                        {(analysis.totalIncome - analysis.totalExpense) >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          (analysis.totalIncome - analysis.totalExpense) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          ${Math.abs(analysis.totalIncome - analysis.totalExpense).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {analysis.transactions.length} transactions
                    </Badge>
                    <Badge variant="outline">
                      {analysis.categories.length} categories
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick stats */}
        {filteredAnalyses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{filteredAnalyses.length}</div>
                  <div className="text-sm text-muted-foreground">Total Analyses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    ${filteredAnalyses.reduce((sum, a) => sum + a.totalIncome, 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Income</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    ${filteredAnalyses.reduce((sum, a) => sum + a.totalExpense, 0).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Expenses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {filteredAnalyses.reduce((sum, a) => sum + a.transactions.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
