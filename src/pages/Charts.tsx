
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Download, Save } from 'lucide-react';
import { format } from 'date-fns';
import CategoryBreakdownChart from '@/components/CategoryBreakdownChart';
import SpendingTrendsChart from '@/components/SpendingTrendsChart';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TransactionCategory, MonthlyData, SavedAnalysis } from '@/types';

export default function Charts() {
  const { user } = useAuth();
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

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
      if (analyses.length > 0) {
        setSelectedAnalysis(analyses[0]);
      }
    } catch (error) {
      console.error('Error fetching saved analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportChart = () => {
    // Implementation for exporting charts
    console.log('Exporting chart...');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading charts...</div>
      </div>
    );
  }

  if (!selectedAnalysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
            <p className="text-muted-foreground mb-4">
              You haven't analyzed any documents yet. Upload and analyze a document first.
            </p>
            <Button onClick={() => window.location.href = '/analyze'}>
              Analyze Document
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Financial Charts</h1>
            <p className="text-muted-foreground">
              Visualize your financial data with interactive charts
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={selectedAnalysis.id}
              onValueChange={(value) => {
                const analysis = savedAnalyses.find(a => a.id === value);
                if (analysis) setSelectedAnalysis(analysis);
              }}
            >
              <SelectTrigger className="w-48">
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
            
            <Button variant="outline" onClick={handleExportChart}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${selectedAnalysis.totalIncome.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(selectedAnalysis.date), 'MMM yyyy')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${selectedAnalysis.totalExpense.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedAnalysis.transactions.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Net Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                (selectedAnalysis.totalIncome - selectedAnalysis.totalExpense) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                ${(selectedAnalysis.totalIncome - selectedAnalysis.totalExpense).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                {(selectedAnalysis.totalIncome - selectedAnalysis.totalExpense) >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryBreakdownChart categories={selectedAnalysis.categories} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingTrendsChart transactions={selectedAnalysis.transactions} />
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        {selectedAnalysis.insights && selectedAnalysis.insights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedAnalysis.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
