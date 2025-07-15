
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { SavedAnalysis } from '@/types';

export default function Compare() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [firstAnalysis, setFirstAnalysis] = useState<SavedAnalysis | null>(null);
  const [secondAnalysis, setSecondAnalysis] = useState<SavedAnalysis | null>(null);
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

  const calculateDifference = (first: number, second: number) => {
    const diff = first - second;
    const percentage = second !== 0 ? ((diff / Math.abs(second)) * 100) : 0;
    return { diff, percentage };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return Math.abs(percentage).toFixed(1) + '%';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (savedAnalyses.length < 2) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <ArrowUpDown className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Not enough analyses</h3>
          <p className="mt-1 text-sm text-gray-500">
            You need at least 2 saved analyses to compare them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compare Analyses</h1>
          <p className="text-muted-foreground">
            Compare different financial analyses side by side
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>First Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={firstAnalysis?.id || ''}
              onValueChange={(value) => {
                const analysis = savedAnalyses.find(a => a.id === value);
                setFirstAnalysis(analysis || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select first analysis" />
              </SelectTrigger>
              <SelectContent>
                {savedAnalyses.map((analysis) => (
                  <SelectItem key={analysis.id} value={analysis.id}>
                    {analysis.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Second Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={secondAnalysis?.id || ''}
              onValueChange={(value) => {
                const analysis = savedAnalyses.find(a => a.id === value);
                setSecondAnalysis(analysis || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select second analysis" />
              </SelectTrigger>
              <SelectContent>
                {savedAnalyses.map((analysis) => (
                  <SelectItem key={analysis.id} value={analysis.id}>
                    {analysis.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {firstAnalysis && secondAnalysis && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{firstAnalysis.name}</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(firstAnalysis.totalIncome)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{secondAnalysis.name}</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(secondAnalysis.totalIncome)}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Difference:</span>
                    <Badge variant={
                      firstAnalysis.totalIncome > secondAnalysis.totalIncome ? 'default' : 'secondary'
                    }>
                      {formatPercentage(calculateDifference(firstAnalysis.totalIncome, secondAnalysis.totalIncome).percentage)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{firstAnalysis.name}</div>
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(Math.abs(firstAnalysis.totalExpenses))}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{secondAnalysis.name}</div>
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(Math.abs(secondAnalysis.totalExpenses))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Difference:</span>
                    <Badge variant={
                      Math.abs(firstAnalysis.totalExpenses) < Math.abs(secondAnalysis.totalExpenses) ? 'default' : 'secondary'
                    }>
                      {formatPercentage(calculateDifference(Math.abs(firstAnalysis.totalExpenses), Math.abs(secondAnalysis.totalExpenses)).percentage)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{firstAnalysis.name}</div>
                  <div className={`text-lg font-bold ${
                    (firstAnalysis.totalIncome + firstAnalysis.totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(firstAnalysis.totalIncome + firstAnalysis.totalExpenses)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{secondAnalysis.name}</div>
                  <div className={`text-lg font-bold ${
                    (secondAnalysis.totalIncome + secondAnalysis.totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(secondAnalysis.totalIncome + secondAnalysis.totalExpenses)}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Difference:</span>
                    <Badge variant="outline">
                      {formatCurrency(calculateDifference(
                        firstAnalysis.totalIncome + firstAnalysis.totalExpenses,
                        secondAnalysis.totalIncome + secondAnalysis.totalExpenses
                      ).diff)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">{firstAnalysis.name}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Date: {new Date(firstAnalysis.date).toLocaleDateString()}</div>
                      <div>Transactions: {firstAnalysis.transactions.length}</div>
                      <div>Categories: {firstAnalysis.categories.length}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">{secondAnalysis.name}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Date: {new Date(secondAnalysis.date).toLocaleDateString()}</div>
                      <div>Transactions: {secondAnalysis.transactions.length}</div>
                      <div>Categories: {secondAnalysis.categories.length}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Income Comparison</div>
                    <div className="text-sm text-muted-foreground">
                      {firstAnalysis.totalIncome > secondAnalysis.totalIncome 
                        ? `${firstAnalysis.name} has ${formatPercentage(calculateDifference(firstAnalysis.totalIncome, secondAnalysis.totalIncome).percentage)} higher income`
                        : `${secondAnalysis.name} has ${formatPercentage(calculateDifference(secondAnalysis.totalIncome, firstAnalysis.totalIncome).percentage)} higher income`
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Expense Comparison</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.abs(firstAnalysis.totalExpenses) > Math.abs(secondAnalysis.totalExpenses)
                        ? `${firstAnalysis.name} has ${formatPercentage(calculateDifference(Math.abs(firstAnalysis.totalExpenses), Math.abs(secondAnalysis.totalExpenses)).percentage)} higher expenses`
                        : `${secondAnalysis.name} has ${formatPercentage(calculateDifference(Math.abs(secondAnalysis.totalExpenses), Math.abs(firstAnalysis.totalExpenses)).percentage)} higher expenses`
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Transaction Volume</div>
                    <div className="text-sm text-muted-foreground">
                      {firstAnalysis.transactions.length > secondAnalysis.transactions.length
                        ? `${firstAnalysis.name} has ${firstAnalysis.transactions.length - secondAnalysis.transactions.length} more transactions`
                        : `${secondAnalysis.name} has ${secondAnalysis.transactions.length - firstAnalysis.transactions.length} more transactions`
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
