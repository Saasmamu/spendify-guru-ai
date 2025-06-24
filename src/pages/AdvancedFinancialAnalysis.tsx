
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useStatement } from '@/contexts/StatementContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, TrendingUp, Users, Shield, DollarSign, PieChart, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';
import Navbar from '@/components/Navbar';

const AdvancedFinancialAnalysis = () => {
  const { statementData } = useStatement();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('security');

  // Check if we have real data
  const hasRealData = statementData && statementData.transactions && statementData.transactions.length > 0;

  useEffect(() => {
    // If no real data, redirect to upload page
    if (!hasRealData) {
      navigate('/dashboard/upload');
    }
  }, [hasRealData, navigate]);

  // Process real transaction data for analysis
  const processRealData = () => {
    if (!hasRealData) return null;

    const transactions = statementData.transactions;
    
    // Security analysis - detect suspicious patterns
    const securityAnalysis = {
      suspiciousTransactions: transactions.filter(t => 
        Math.abs(t.amount) > 1000 || 
        t.description.toLowerCase().includes('unknown') ||
        t.description.toLowerCase().includes('atm')
      ).slice(0, 5),
      totalSuspicious: transactions.filter(t => Math.abs(t.amount) > 1000).length,
      securityScore: Math.max(20, 100 - (transactions.filter(t => Math.abs(t.amount) > 1000).length * 5))
    };

    // Recurring expenses analysis
    const recurringAnalysis = {
      potentialRecurring: transactions
        .reduce((acc, t) => {
          const key = t.description.toLowerCase().replace(/\d+/g, '').trim();
          if (!acc[key]) acc[key] = [];
          acc[key].push(t);
          return acc;
        }, {} as Record<string, any[]>)
    };

    const recurring = Object.entries(recurringAnalysis.potentialRecurring)
      .filter(([_, txns]) => txns.length >= 2)
      .map(([desc, txns]) => ({
        description: desc,
        frequency: txns.length,
        averageAmount: txns.reduce((sum, t) => sum + Math.abs(t.amount), 0) / txns.length,
        totalAmount: txns.reduce((sum, t) => sum + Math.abs(t.amount), 0)
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 8);

    // Cash flow analysis
    const cashFlowData = transactions.reduce((acc, t) => {
      const date = t.date.slice(0, 7); // YYYY-MM format
      if (!acc[date]) acc[date] = { income: 0, expenses: 0 };
      if (t.amount > 0) {
        acc[date].income += t.amount;
      } else {
        acc[date].expenses += Math.abs(t.amount);
      }
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    const cashFlow = Object.entries(cashFlowData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        netFlow: data.income - data.expenses
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Merchant analysis
    const merchantAnalysis = transactions.reduce((acc, t) => {
      let merchant = t.description.split(/[-\/\s]/)[0].trim();
      if (merchant.length < 3) merchant = t.description;
      
      if (!acc[merchant]) {
        acc[merchant] = { totalSpent: 0, frequency: 0, category: t.category || 'Miscellaneous' };
      }
      acc[merchant].totalSpent += Math.abs(t.amount);
      acc[merchant].frequency += 1;
      return acc;
    }, {} as Record<string, any>);

    const topMerchants = Object.entries(merchantAnalysis)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // Financial health score calculation
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100;

    const healthScore = Math.max(0, Math.min(100, 
      (savingsRate > 20 ? 30 : savingsRate * 1.5) +
      (expenseRatio < 80 ? 30 : 30 - ((expenseRatio - 80) * 1.5)) +
      (recurring.length < 5 ? 20 : 20 - (recurring.length - 5) * 2) +
      (securityAnalysis.securityScore * 0.2)
    ));

    // Tax categorization
    const taxCategories = transactions.reduce((acc, t) => {
      const category = t.category || 'Miscellaneous';
      const isTaxDeductible = ['Business', 'Medical', 'Education', 'Charity'].some(cat => 
        category.toLowerCase().includes(cat.toLowerCase())
      );
      
      if (!acc[category]) {
        acc[category] = { total: 0, taxDeductible: isTaxDeductible, transactions: 0 };
      }
      acc[category].total += Math.abs(t.amount);
      acc[category].transactions += 1;
      return acc;
    }, {} as Record<string, any>);

    return {
      security: securityAnalysis,
      recurring,
      cashFlow,
      merchants: topMerchants,
      healthScore: Math.round(healthScore),
      taxCategories: Object.entries(taxCategories).map(([name, data]) => ({ name, ...data }))
    };
  };

  const analysisData = processRealData();

  if (!hasRealData) {
    return (
      <div className="container mx-auto p-6">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-32">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No bank statement data found. Please upload a statement first to view advanced analysis.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/dashboard/upload')} className="mt-4">
            Upload Statement
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/analyze')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analysis
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Advanced Financial Analysis</h1>
              <p className="text-muted-foreground">
                Comprehensive insights from your bank statement with {statementData?.transactions.length} transactions
              </p>
            </div>
          </div>
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Real Data Analysis
          </Badge>
        </div>

        {/* Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Recurring
            </TabsTrigger>
            <TabsTrigger value="cashflow" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Cash Flow
            </TabsTrigger>
            <TabsTrigger value="merchants" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Merchants
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Health Score
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Tax Analysis
            </TabsTrigger>
          </TabsList>

          {/* Security & Scam Alerts Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Score: {analysisData?.security.securityScore}/100
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium">Analysis Summary</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Found {analysisData?.security.totalSuspicious} potentially suspicious transactions
                      </p>
                    </div>
                    {analysisData?.security.suspiciousTransactions.map((transaction, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>{transaction.description}</strong> - ${Math.abs(transaction.amount).toFixed(2)}
                          <br />
                          <span className="text-xs">Date: {transaction.date}</span>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Monitor Large Transactions</p>
                        <p className="text-sm text-muted-foreground">Review transactions over $1,000 regularly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Set Account Alerts</p>
                        <p className="text-sm text-muted-foreground">Enable notifications for unusual activity</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Review ATM Usage</p>
                        <p className="text-sm text-muted-foreground">Verify all ATM withdrawals are legitimate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recurring Expenses Tab */}
          <TabsContent value="recurring">
            <Card>
              <CardHeader>
                <CardTitle>Recurring Transactions Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Identified {analysisData?.recurring.length} potential recurring expenses
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData?.recurring.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium capitalize">{item.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          Frequency: {item.frequency} times | Avg: ${item.averageAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.totalAmount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Total spent</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Flow Analysis Tab */}
          <TabsContent value="cashflow">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cash Flow Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysisData?.cashFlow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
                      <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" />
                      <Line type="monotone" dataKey="netFlow" stroke="#3b82f6" name="Net Flow" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Merchant Intelligence Tab */}
          <TabsContent value="merchants">
            <Card>
              <CardHeader>
                <CardTitle>Top Merchants by Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData?.merchants.map((merchant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{merchant.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {merchant.frequency} transactions | Category: {merchant.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${merchant.totalSpent.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Avg: ${(merchant.totalSpent / merchant.frequency).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Health Score Tab */}
          <TabsContent value="health">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-4">
                      {analysisData?.healthScore}
                    </div>
                    <div className="text-xl text-muted-foreground">out of 100</div>
                    <div className="mt-4">
                      <Badge variant={analysisData && analysisData.healthScore > 70 ? "default" : "destructive"}>
                        {analysisData && analysisData.healthScore > 70 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Savings Rate</span>
                      <span className="font-medium">
                        {statementData && statementData.totalIncome && statementData.totalExpense
                          ? `${(((statementData.totalIncome - Math.abs(statementData.totalExpense)) / statementData.totalIncome) * 100).toFixed(1)}%`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expense Ratio</span>
                      <span className="font-medium">
                        {statementData && statementData.totalIncome && statementData.totalExpense
                          ? `${((Math.abs(statementData.totalExpense) / statementData.totalIncome) * 100).toFixed(1)}%`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recurring Expenses</span>
                      <span className="font-medium">{analysisData?.recurring.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Score</span>
                      <span className="font-medium">{analysisData?.security.securityScore}/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tax & Expense Categorization Tab */}
          <TabsContent value="tax">
            <Card>
              <CardHeader>
                <CardTitle>Tax & Expense Categorization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Expense Categories</h4>
                    <div className="space-y-3">
                      {analysisData?.taxCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <span className="font-medium">{category.name}</span>
                            {category.taxDeductible && (
                              <Badge variant="secondary" className="ml-2 text-xs">Tax Deductible</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${category.total.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">{category.transactions} transactions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Tax Summary</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h5 className="font-medium">Potential Deductions</h5>
                        <p className="text-2xl font-bold text-green-600">
                          ${analysisData?.taxCategories
                            .filter(cat => cat.taxDeductible)
                            .reduce((sum, cat) => sum + cat.total, 0)
                            .toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h5 className="font-medium">Total Categorized</h5>
                        <p className="text-2xl font-bold">
                          ${analysisData?.taxCategories
                            .reduce((sum, cat) => sum + cat.total, 0)
                            .toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedFinancialAnalysis;
