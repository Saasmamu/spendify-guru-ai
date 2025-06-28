
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Plus, Save, CheckCircle, ArrowUp, ArrowDown, Home, ShoppingBag, Car, Coffee, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import Navbar from '@/components/Navbar';
import { useStatement } from '@/contexts/StatementContext';
import { SaveAnalysisDialog } from '@/components/SaveAnalysisDialog';
import { generateInsights } from '@/services/insightService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1'];

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>
  </svg>
);

interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
  type: 'debit' | 'credit';
}

interface CategoryData {
  name: string;
  amount: number;
  count: number;
}

interface MerchantData {
  name: string;
  totalSpent: number;
  transactionCount: number;
  category: string;
  color: string;
}

const processCategoriesFromTransactions = (transactions: BankTransaction[]): CategoryData[] => {
  const categoryMap = new Map<string, { amount: number; count: number }>();
  
  transactions.forEach(transaction => {
    const category = transaction.category || 'Miscellaneous';
    const amount = Math.abs(transaction.amount);
    
    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category)!;
      categoryMap.set(category, {
        amount: existing.amount + amount,
        count: existing.count + 1
      });
    } else {
      categoryMap.set(category, { amount, count: 1 });
    }
  });
  
  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    amount: data.amount,
    count: data.count
  }));
};

const processMerchantsFromTransactions = (transactions: BankTransaction[], categoryIcons: Record<string, any>): MerchantData[] => {
  const merchantMap = new Map<string, { totalSpent: number; count: number; category: string }>();
  
  transactions.forEach(transaction => {
    if (transaction.amount > 0) return;
    
    const merchant = transaction.description.split(' ')[0] || 'Unknown';
    const amount = Math.abs(transaction.amount);
    const category = transaction.category || 'Miscellaneous';
    
    if (merchantMap.has(merchant)) {
      const existing = merchantMap.get(merchant)!;
      merchantMap.set(merchant, {
        totalSpent: existing.totalSpent + amount,
        count: existing.count + 1,
        category: existing.category
      });
    } else {
      merchantMap.set(merchant, { totalSpent: amount, count: 1, category });
    }
  });
  
  return Array.from(merchantMap.entries())
    .map(([name, data]) => ({
      name,
      totalSpent: data.totalSpent,
      transactionCount: data.count,
      category: data.category,
      color: categoryIcons[data.category]?.pieColor || '#8884D8'
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
};

const mockCategories = [
  { name: 'Food & Dining', amount: 1250, count: 24 },
  { name: 'Shopping', amount: 850, count: 12 },
  { name: 'Transportation', amount: 450, count: 8 },
  { name: 'Housing', amount: 1200, count: 3 },
  { name: 'Miscellaneous', amount: 320, count: 15 }
];

const mockTransactions: BankTransaction[] = [
  { date: '2024-01-15', description: 'Restaurant ABC', amount: -45.50, category: 'Food & Dining', type: 'debit' },
  { date: '2024-01-14', description: 'Gas Station XYZ', amount: -32.20, category: 'Transportation', type: 'debit' },
  { date: '2024-01-13', description: 'Grocery Store', amount: -87.65, category: 'Food & Dining', type: 'debit' },
  { date: '2024-01-12', description: 'Online Shopping', amount: -156.00, category: 'Shopping', type: 'debit' },
  { date: '2024-01-11', description: 'Coffee Shop', amount: -8.95, category: 'Food & Dining', type: 'debit' }
];

export default function Analyze() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { statementData } = useStatement();
  const [loaded, setLoaded] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  useEffect(() => {
    if (statementData && statementData.transactions && statementData.transactions.length > 0) {
      console.log("Using real statement data with", statementData.transactions.length, "transactions");
      setUseRealData(true);
    } else {
      console.log("No statement data available, using mock data");
      setUseRealData(false);
    }
  }, [statementData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (statementData && statementData.transactions.length > 0) {
      generateAIInsights();
    }
  }, [statementData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex(prevIndex => {
        const categories = useRealData && statementData?.transactions 
          ? processCategoriesFromTransactions(statementData.transactions)
          : mockCategories;
          
        return (prevIndex + 1) % categories.length;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [statementData, useRealData]);

  const categoryIcons: Record<string, any> = {
    'Shopping': { icon: ShoppingBag, color: 'bg-blue-500', pieColor: '#4285F4' },
    'Housing': { icon: Home, color: 'bg-green-500', pieColor: '#34A853' },
    'Transportation': { icon: Car, color: 'bg-amber-500', pieColor: '#FBBC05' },
    'Food & Dining': { icon: Coffee, color: 'bg-red-500', pieColor: '#EA4335' },
    'Miscellaneous': { icon: Tag, color: 'bg-purple-500', pieColor: '#9334EA' },
    'TV': { icon: Home, color: 'bg-purple-600', pieColor: '#9333EA' },
    'Bank Deposit': { icon: ArrowDown, color: 'bg-emerald-500', pieColor: '#10B981' },
    'Transfer from': { icon: ArrowDown, color: 'bg-indigo-500', pieColor: '#6366F1' },
    'Transfer to': { icon: ArrowUp, color: 'bg-rose-500', pieColor: '#F43F5E' },
    'Betting': { icon: Tag, color: 'bg-orange-500', pieColor: '#F97316' },
    'Mobile Data': { icon: SparkleIcon, color: 'bg-cyan-500', pieColor: '#06B6D4' },
    'Cash Withdraw': { icon: ArrowUp, color: 'bg-red-600', pieColor: '#DC2626' },
    'Targets': { icon: DollarSign, color: 'bg-amber-600', pieColor: '#D97706' },
    'USSD Charge': { icon: Tag, color: 'bg-slate-500', pieColor: '#64748B' }
  };

  const processedCategoriesData = useRealData && statementData?.transactions
    ? processCategoriesFromTransactions(statementData.transactions)
    : mockCategories.map(c => ({ name: c.name, amount: c.amount }));

  const totalAmountForPercentage = useRealData && statementData?.transactions
    ? statementData.transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    : mockCategories.reduce((sum, c) => sum + c.amount, 0);

  const categories = processedCategoriesData.map(cat => {
    const { icon, color, pieColor } = categoryIcons[cat.name] || categoryIcons['Miscellaneous'];
    const percentage = totalAmountForPercentage > 0 ? Math.round((Math.abs(cat.amount) / totalAmountForPercentage) * 100) : 0;
    return {
      ...cat,
      icon,
      color,
      pieColor,
      percentage
    };
  }).sort((a, b) => b.amount - a.amount);

  const transactions = useRealData && statementData?.transactions
    ? statementData.transactions
    : mockTransactions;

  const merchants = processMerchantsFromTransactions(transactions, categoryIcons);

  const totalSpent = useRealData && statementData?.totalExpense
    ? statementData.totalExpense
    : mockCategories.reduce((sum, category) => sum + (category.amount > 0 ? category.amount : 0), 0);

  const expenseCategoriesChartData = categories
    .filter(category => category.amount > 0 && category.name !== 'Income' && !category.name.includes('Transfer from') && !category.name.includes('Deposit'))
    .map(category => ({
      name: category.name,
      value: category.amount,
      color: category.pieColor
  }));

  const topMerchantsChartData = merchants.slice(0, 8).map((m, idx) => ({
    name: m.name,
    totalSpent: m.totalSpent,
    fill: COLORS[idx % COLORS.length]
  }));

  const chartData = categories.map(category => ({
    name: category.name,
    value: category.amount,
    color: category.pieColor
  }));

  const CHART_CONFIG = {
    expenses: {
      label: "Expenses",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))"
      }
    }
  };

  const generateAIInsights = async () => {
    if (!statementData || !statementData.transactions || statementData.transactions.length === 0) {
      toast({
        variant: "destructive",
        title: "No data available",
        description: "Please upload a bank statement with valid transactions to generate insights."
      });
      return;
    }

    setIsGeneratingInsights(true);

    try {
      console.log('Attempting to generate insights with raw statementData:', JSON.stringify(statementData, null, 2));

      const sanitizedTransactions = statementData.transactions.map(t => ({
        ...t,
        amount: typeof t.amount === 'string'
                  ? parseFloat(t.amount.toString().replace(/[^0-9.-]+/g,""))
                  : (typeof t.amount === 'number' ? t.amount : 0),
        category: typeof t.category === 'string' && t.category.trim() !== '' ? t.category : 'Miscellaneous',
        description: typeof t.description === 'string' ? t.description : '',
        date: typeof t.date === 'string' ? t.date : '',
      })).filter(t => !isNaN(t.amount));

      if (sanitizedTransactions.length === 0) {
         throw new Error("No valid transactions found after sanitization. Check data quality.");
      }

      const dataToSend = {
        ...statementData,
        transactions: sanitizedTransactions,
        totalIncome: typeof statementData.totalIncome === 'number' ? statementData.totalIncome : 0,
        totalExpense: typeof statementData.totalExpense === 'number' ? statementData.totalExpense : 0,
      };

      console.log('Sending sanitized data to generateInsights:', JSON.stringify(dataToSend, null, 2));

      const generatedInsights = await generateInsights(dataToSend);
      setInsights(generatedInsights);

      toast({
        title: "Insights Generated",
        description: "AI analysis of your statement is complete!",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error('Error details:', errorMessage);

      setInsights([
        `Failed to generate AI insights. Error: ${errorMessage}`,
        'Consider reviewing your largest transactions for savings opportunities.',
        'Try categorizing your transactions to better understand spending patterns.'
      ]);

      toast({
        variant: "destructive",
        title: "Error Generating Insights",
        description: `Failed: ${errorMessage}. Please check console logs for details.`,
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleNoDataRedirect = () => {
    toast({
      title: "No Statement Data",
      description: "Please upload a bank statement first.",
    });
    navigate('/dashboard/upload');
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleLoadAnalysis = async (analysis: any) => {
    if (statementData) {
      const typedTransactions = analysis.transactions.map((t: any) => ({
        ...t,
        type: t.type || (t.amount < 0 ? 'expense' : 'income')
      }));

      statementData.transactions = typedTransactions;
      statementData.totalIncome = analysis.totalIncome;
      statementData.totalExpense = analysis.totalExpense;
      
      setInsights(analysis.insights || []);
      setUseRealData(true);
      
      toast({
        title: "Analysis Loaded",
        description: "Your saved analysis has been loaded successfully.",
      });
    }
  };

  const DataSourceIndicator = ({ isReal }: { isReal: boolean }) => (
    <div className="flex items-center gap-2 mb-4">
      {isReal ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Real Data
          </Badge>
          <span className="text-sm text-gray-600">Based on your uploaded bank statement</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
            Mock Data
          </Badge>
          <span className="text-sm text-gray-600">Example data - upload a statement for real insights</span>
        </>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-32 px-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 animate-slide-down">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Spending Analysis</h1>
            <p className="text-muted-foreground">
              {useRealData 
                ? `Analysis of your uploaded statement with ${statementData?.transactions.length} transactions`
                : 'Example data shown. Please upload a statement for real insights.'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            {!useRealData && (
              <Button 
                variant="default" 
                className="gap-2 text-sm"
                onClick={handleNoDataRedirect}
              >
                <DollarSign className="w-4 h-4" />
                Upload Statement
              </Button>
            )}
            {useRealData && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-2 text-sm mr-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Your Statement
                </Button>
                <Button 
                  variant="default" 
                  className="gap-2 text-sm mr-2"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="w-4 h-4" />
                  Save Analysis
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 text-sm"
                  onClick={() => navigate('/advanced-analysis')}
                >
                  Advanced Analysis
                </Button>
              </>
            )}
          </div>
        </div>
        
        {!loaded ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-24 bg-gray-200 rounded-md"></div>
              <div className="h-24 bg-gray-200 rounded-md"></div>
              <div className="h-24 bg-gray-200 rounded-md"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded-md"></div>
              <div className="h-64 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-48 bg-gray-200 rounded-md"></div>
            <div className="h-48 bg-gray-200 rounded-md"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <DataSourceIndicator isReal={useRealData} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="animate-slide-up delay-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {categories.length} categories
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up delay-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories[0]?.name || 'None'}</div>
                  <p className="text-xs text-muted-foreground">
                    ${categories[0]?.amount.toFixed(2) || '0.00'} spent
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-slide-up delay-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insights.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {isGeneratingInsights ? 'Generating...' : 'Generated insights'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="animate-slide-up delay-400">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Your expense breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategoriesChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                        >
                          {expenseCategoriesChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up delay-500">
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                  <CardDescription>Your highest spending areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.slice(0, 5).map((category, index) => {
                      const IconComponent = category.icon;
                      return (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${category.color}`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {category.percentage}% of total
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${category.amount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              {useRealData && statementData?.transactions 
                                ? statementData.transactions.filter(t => t.category === category.name).length 
                                : mockCategories.find(c => c.name === category.name)?.count || 0} transactions
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {merchants.length > 0 && (
              <Card className="animate-slide-up delay-600">
                <CardHeader>
                  <CardTitle>Top Merchants</CardTitle>
                  <CardDescription>Where you spend the most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topMerchantsChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Total Spent']} />
                        <Bar dataKey="totalSpent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {insights.length > 0 && (
              <Card className="animate-slide-up delay-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SparkleIcon className="w-5 h-5 text-blue-500" />
                    AI Insights
                    <Badge variant={useRealData ? "default" : "secondary"}>
                      {useRealData ? "Real Data Analysis" : "Mock Data Example"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {useRealData 
                      ? "Personalized insights based on your spending patterns" 
                      : "Example insights - upload your statement for personalized analysis"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.map((insight, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{insight}</AlertDescription>
                      </Alert>
                    ))}
                    {isGeneratingInsights && (
                      <Alert>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <AlertDescription>Generating additional insights...</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {showSaveDialog && (
          <SaveAnalysisDialog
            isOpen={showSaveDialog}
            onClose={() => setShowSaveDialog(false)}
            data={{
              transactions: transactions,
              totalIncome: statementData?.totalIncome || 0,
              totalExpense: statementData?.totalExpense || totalSpent,
              categories: processCategoriesFromTransactions(transactions),
              insights
            }}
          />
        )}
      </div>
    </div>
  );
}
