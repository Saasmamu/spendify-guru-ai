import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RawAnalysisData } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

const Charts = () => {
  const { user } = useAuth();
  const [analysisData, setAnalysisData] = useState<RawAnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadAnalysisData();
  }, [user]);

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockData: RawAnalysisData[] = [
        {
          date: '2024-01',
          totalIncome: 4500,
          totalExpense: 3200,
          name: 'January Analysis',
          transactions: []
        },
        {
          date: '2024-02', 
          totalIncome: 4800,
          totalExpense: 2900,
          name: 'February Analysis',
          transactions: []
        },
        {
          date: '2024-03',
          totalIncome: 4600,
          totalExpense: 3400,
          name: 'March Analysis', 
          transactions: []
        }
      ];
      
      setAnalysisData(mockData);
    } catch (error) {
      console.error('Error loading analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByPeriod = (data: RawAnalysisData[], period: string): RawAnalysisData[] => {
    if (period === 'all') return data;
    return data.filter(item => item.date.startsWith(period));
  };

  const getCategoryBreakdown = (data: RawAnalysisData[]) => {
    const categoryData: { [key: string]: number } = {};
    data.forEach(analysis => {
      analysis.transactions.forEach(transaction => {
        if (transaction.category) {
          categoryData[transaction.category] = (categoryData[transaction.category] || 0) + Math.abs(transaction.amount);
        }
      });
    });

    return Object.entries(categoryData).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };

  const calculateTotal = (data: RawAnalysisData[], type: 'income' | 'expense'): number => {
    return data.reduce((sum, item) => {
      return sum + (type === 'income' ? item.totalIncome : item.totalExpense);
    }, 0);
  };

  const filteredData = filterDataByPeriod(analysisData, selectedPeriod);
  const totalIncome = calculateTotal(filteredData, 'income');
  const totalExpense = calculateTotal(filteredData, 'expense');
  const categoryBreakdown = getCategoryBreakdown(filteredData);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Charts</h1>
          <p className="text-muted-foreground mt-1">
            Visualize your financial data with interactive charts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod} disabled={loading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2024-02">February 2024</SelectItem>
              <SelectItem value="2024-03">March 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading data...
        </div>
      ) : (
        <Tabs defaultValue="income" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Income</CardTitle>
                <CardDescription>
                  Overview of your income over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line type="monotone" dataKey="totalIncome" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
                <CardDescription>
                  Overview of your expenses over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalExpense.toFixed(2)}</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="totalExpense" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Charts;
