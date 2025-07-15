
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CategoryBreakdownChart } from '@/components/CategoryBreakdownChart';
import { SpendingTrendsChart } from '@/components/SpendingTrendsChart';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { SavedAnalysis, TransactionCategory, MonthlyData } from '@/types';

export default function Charts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedAnalyses();
    }
  }, [user]);

  const loadSavedAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const analyses = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        date: item.date,
        transactions: item.transactions,
        totalIncome: item.total_income,
        totalExpenses: item.total_expense,
        categories: item.categories,
        insights: item.insights
      }));

      setSavedAnalyses(analyses);
      if (analyses.length > 0) {
        setSelectedAnalysis(analyses[0]);
      }
    } catch (error) {
      console.error('Error loading saved analyses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved analyses.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportChart = (chartType: string) => {
    if (!selectedAnalysis) return;

    const dataToExport = {
      analysis: selectedAnalysis.name,
      chartType,
      data: chartType === 'category' ? selectedAnalysis.categories : getMonthlyData(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartType}-chart-${selectedAnalysis.name}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Chart Exported',
      description: `${chartType} chart data has been downloaded.`,
    });
  };

  const getMonthlyData = (): MonthlyData[] => {
    if (!selectedAnalysis) return [];

    // Group transactions by month
    const monthlyMap = new Map<string, { expenses: number; income: number }>();
    
    selectedAnalysis.transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { expenses: 0, income: 0 });
      }
      
      const monthData = monthlyMap.get(month)!;
      if (transaction.type === 'credit') {
        monthData.income += Math.abs(transaction.amount);
      } else {
        monthData.expenses += Math.abs(transaction.amount);
      }
    });

    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      expenses: data.expenses,
      income: data.income,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (savedAnalyses.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No analyses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload and analyze some documents first to see charts here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Charts & Visualizations</h1>
          <p className="text-muted-foreground">
            Visual insights from your financial data
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select
            value={selectedAnalysis?.id || ''}
            onValueChange={(value) => {
              const analysis = savedAnalyses.find(a => a.id === value);
              setSelectedAnalysis(analysis || null);
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select analysis" />
            </SelectTrigger>
            <SelectContent>
              {savedAnalyses.map((analysis) => (
                <SelectItem key={analysis.id} value={analysis.id}>
                  {analysis.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedAnalysis && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${selectedAnalysis.totalIncome.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${Math.abs(selectedAnalysis.totalExpenses).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  (selectedAnalysis.totalIncome + selectedAnalysis.totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${(selectedAnalysis.totalIncome + selectedAnalysis.totalExpenses).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedAnalysis.categories.length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportChart('category')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <CategoryBreakdownChart data={selectedAnalysis.categories} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Spending Trends
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportChart('trends')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <SpendingTrendsChart data={getMonthlyData()} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Analysis Name:</span>
                  <Badge variant="secondary">{selectedAnalysis.name}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Date Created:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedAnalysis.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Transactions:</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedAnalysis.transactions.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
