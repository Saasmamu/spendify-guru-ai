
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CategoryBreakdownChart from '@/components/CategoryBreakdownChart';
import SpendingTrendsChart from '@/components/SpendingTrendsChart';
import { Transaction, CategoryData } from '@/types';
import { supabase } from '@/lib/supabase';

function Charts() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      setTransactions(transactionsData || []);

      // Calculate categories from transactions
      const categoryMap = new Map<string, { amount: number; count: number }>();
      
      (transactionsData || []).forEach(transaction => {
        if (transaction.type === 'expense') {
          const existing = categoryMap.get(transaction.category) || { amount: 0, count: 0 };
          categoryMap.set(transaction.category, {
            amount: existing.amount + Math.abs(transaction.amount),
            count: existing.count + 1
          });
        }
      });

      const totalAmount = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.amount, 0);
      
      const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(([name, data], index) => ({
        name,
        amount: data.amount,
        count: data.count,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
        color: `hsl(${index * 45}, 70%, 50%)`
      }));

      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chart data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Charts</h1>
        <p className="text-muted-foreground">
          Visualize your spending patterns and financial trends
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              Breakdown of your expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <CategoryBreakdownChart data={categories} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>
              Your income and expense trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <SpendingTrendsChart transactions={transactions} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No transaction data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Charts;
