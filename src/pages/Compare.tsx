
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SavedAnalysis } from '@/types';

export default function Compare() {
  const { user } = useAuth();
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysis1, setSelectedAnalysis1] = useState<SavedAnalysis | null>(null);
  const [selectedAnalysis2, setSelectedAnalysis2] = useState<SavedAnalysis | null>(null);
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
    } catch (error) {
      console.error('Error fetching saved analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateComparison = () => {
    if (!selectedAnalysis1 || !selectedAnalysis2) return null;

    const incomeDiff = selectedAnalysis2.totalIncome - selectedAnalysis1.totalIncome;
    const expenseDiff = selectedAnalysis2.totalExpense - selectedAnalysis1.totalExpense;
    const netFlowDiff = (selectedAnalysis2.totalIncome - selectedAnalysis2.totalExpense) - 
                       (selectedAnalysis1.totalIncome - selectedAnalysis1.totalExpense);

    const incomePercentChange = selectedAnalysis1.totalIncome !== 0 
      ? ((incomeDiff / selectedAnalysis1.totalIncome) * 100) 
      : 0;
    
    const expensePercentChange = selectedAnalysis1.totalExpense !== 0 
      ? ((expenseDiff / selectedAnalysis1.totalExpense) * 100) 
      : 0;

    return {
      incomeDiff,
      expenseDiff,
      netFlowDiff,
      incomePercentChange,
      expensePercentChange
    };
  };

  const renderChangeIndicator = (value: number, isPositiveGood: boolean = true) => {
    if (value === 0) {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
    
    const isPositive = value > 0;
    const isGood = isPositiveGood ? isPositive : !isPositive;
    
    return isPositive ? (
      <ArrowUp className={`h-4 w-4 ${isGood ? 'text-green-500' : 'text-red-500'}`} />
    ) : (
      <ArrowDown className={`h-4 w-4 ${isGood ? 'text-green-500' : 'text-red-500'}`} />
    );
  };

  const renderPercentChange = (value: number, isPositiveGood: boolean = true) => {
    if (value === 0) return '0%';
    
    const isPositive = value > 0;
    const isGood = isPositiveGood ? isPositive : !isPositive;
    
    return (
      <span className={isGood ? 'text-green-600' : 'text-red-600'}>
        {isPositive ? '+' : ''}{value.toFixed(1)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (savedAnalyses.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Insufficient Data</h2>
            <p className="text-muted-foreground mb-4">
              You need at least 2 saved analyses to compare. Analyze more documents first.
            </p>
            <Button onClick={() => window.location.href = '/analyze'}>
              Analyze Document
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const comparison = calculateComparison();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compare Analyses</h1>
          <p className="text-muted-foreground">
            Compare two financial analyses to identify trends and changes
          </p>
        </div>

        {/* Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>First Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedAnalysis1?.id || ''}
                onValueChange={(value) => {
                  const analysis = savedAnalyses.find(a => a.id === value);
                  setSelectedAnalysis1(analysis || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first analysis" />
                </SelectTrigger>
                <SelectContent>
                  {savedAnalyses.map((analysis) => (
                    <SelectItem key={analysis.id} value={analysis.id}>
                      {analysis.name} - {format(new Date(analysis.date), 'MMM yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedAnalysis1 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Income:</span>
                    <span className="font-medium text-green-600">
                      ${selectedAnalysis1.totalIncome.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expenses:</span>
                    <span className="font-medium text-red-600">
                      ${selectedAnalysis1.totalExpense.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Flow:</span>
                    <span className={`font-medium ${
                      (selectedAnalysis1.totalIncome - selectedAnalysis1.totalExpense) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      ${(selectedAnalysis1.totalIncome - selectedAnalysis1.totalExpense).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Second Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedAnalysis2?.id || ''}
                onValueChange={(value) => {
                  const analysis = savedAnalyses.find(a => a.id === value);
                  setSelectedAnalysis2(analysis || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select second analysis" />
                </SelectTrigger>
                <SelectContent>
                  {savedAnalyses.map((analysis) => (
                    <SelectItem key={analysis.id} value={analysis.id}>
                      {analysis.name} - {format(new Date(analysis.date), 'MMM yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedAnalysis2 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Income:</span>
                    <span className="font-medium text-green-600">
                      ${selectedAnalysis2.totalIncome.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expenses:</span>
                    <span className="font-medium text-red-600">
                      ${selectedAnalysis2.totalExpense.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Flow:</span>
                    <span className={`font-medium ${
                      (selectedAnalysis2.totalIncome - selectedAnalysis2.totalExpense) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      ${(selectedAnalysis2.totalIncome - selectedAnalysis2.totalExpense).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Comparison Results */}
        {comparison && selectedAnalysis1 && selectedAnalysis2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Comparison Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {renderChangeIndicator(comparison.incomeDiff, true)}
                      <span className="text-lg font-semibold">Income Change</span>
                    </div>
                    <div className="text-2xl font-bold">
                      ${Math.abs(comparison.incomeDiff).toFixed(2)}
                    </div>
                    <div className="text-sm">
                      {renderPercentChange(comparison.incomePercentChange, true)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {renderChangeIndicator(comparison.expenseDiff, false)}
                      <span className="text-lg font-semibold">Expense Change</span>
                    </div>
                    <div className="text-2xl font-bold">
                      ${Math.abs(comparison.expenseDiff).toFixed(2)}
                    </div>
                    <div className="text-sm">
                      {renderPercentChange(comparison.expensePercentChange, false)}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {renderChangeIndicator(comparison.netFlowDiff, true)}
                      <span className="text-lg font-semibold">Net Flow Change</span>
                    </div>
                    <div className="text-2xl font-bold">
                      ${Math.abs(comparison.netFlowDiff).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {comparison.netFlowDiff >= 0 ? 'Improvement' : 'Decline'}
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
                <div className="space-y-3">
                  {comparison.incomeDiff !== 0 && (
                    <div className="flex items-center gap-3">
                      <Badge variant={comparison.incomeDiff > 0 ? 'default' : 'secondary'}>
                        Income
                      </Badge>
                      <p className="text-sm">
                        Your income {comparison.incomeDiff > 0 ? 'increased' : 'decreased'} by{' '}
                        <span className="font-medium">
                          ${Math.abs(comparison.incomeDiff).toFixed(2)}
                        </span>{' '}
                        ({Math.abs(comparison.incomePercentChange).toFixed(1)}%)
                      </p>
                    </div>
                  )}
                  
                  {comparison.expenseDiff !== 0 && (
                    <div className="flex items-center gap-3">
                      <Badge variant={comparison.expenseDiff < 0 ? 'default' : 'destructive'}>
                        Expenses
                      </Badge>
                      <p className="text-sm">
                        Your expenses {comparison.expenseDiff > 0 ? 'increased' : 'decreased'} by{' '}
                        <span className="font-medium">
                          ${Math.abs(comparison.expenseDiff).toFixed(2)}
                        </span>{' '}
                        ({Math.abs(comparison.expensePercentChange).toFixed(1)}%)
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={comparison.netFlowDiff >= 0 ? 'default' : 'destructive'}>
                      Net Flow
                    </Badge>
                    <p className="text-sm">
                      Your overall financial position{' '}
                      {comparison.netFlowDiff >= 0 ? 'improved' : 'declined'} by{' '}
                      <span className="font-medium">
                        ${Math.abs(comparison.netFlowDiff).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
