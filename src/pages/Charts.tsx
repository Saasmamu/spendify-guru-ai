
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageService } from '@/services/storageService';
import { CategoryBreakdownChart } from '@/components/CategoryBreakdownChart';
import { SpendingTrendsChart } from '@/components/SpendingTrendsChart';
import type { Transaction } from '@/types';

const Charts = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = storageService.getTransactions();
        setTransactions(savedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading charts...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Charts & Analytics</CardTitle>
            <CardDescription>
              Upload bank statements to view detailed charts and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No transaction data available. Please upload bank statements to see charts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Process data for charts
  const categoryData = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'debit') {
      const category = transaction.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount,
    color: getColorForCategory(category)
  }));

  // Monthly spending trends
  const monthlyData = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'debit') {
      const month = new Date(transaction.date).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + Math.abs(transaction.amount);
    }
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month,
      amount
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Charts & Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Visual insights into your spending patterns and financial data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Spending distribution across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>
              Monthly spending patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingTrendsChart data={trendData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function getColorForCategory(category: string): string {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300',
    '#00ff00', '#ff00ff', '#00ffff', '#ffff00'
  ];
  const index = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

export default Charts;
