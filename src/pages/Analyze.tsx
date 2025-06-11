import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useStatement } from '@/contexts/StatementContext';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Bookmark
} from 'lucide-react';
import ExportReport from '@/components/ExportReport';
import SaveAnalysisDialog from '@/components/SaveAnalysisDialog';
import { cn } from '@/lib/utils';
import { generateInsights } from '@/services/insightService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to process categories from transactions
const processCategoriesFromTransactions = (transactions: any[]) => {
  const categoryMap = new Map();
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  transactions.forEach(t => {
    const category = t.category || 'Miscellaneous';
    const currentAmount = categoryMap.get(category)?.amount || 0;
    
    categoryMap.set(category, {
      amount: currentAmount + t.amount,
    });
  });
  
  const categoryIcons: Record<string, any> = {
    'Shopping': { icon: TrendingUp, color: 'bg-blue-500', pieColor: '#3b82f6' },
    'Housing': { icon: Home, color: 'bg-green-500', pieColor: '#22c55e' },
    'Transportation': { icon: ArrowUpCircle, color: 'bg-amber-500', pieColor: '#f59e0b' },
    'Food & Dining': { icon: ArrowDownCircle, color: 'bg-red-500', pieColor: '#ef4444' },
    'Miscellaneous': { icon: Info, color: 'bg-purple-500', pieColor: '#a855f7' }
  };
  
  return Array.from(categoryMap.entries()).map(([name, data]: [string, any]) => {
    const amount = data.amount;
    const percentage = Math.round((amount / totalAmount) * 100);
    const { icon, color, pieColor } = categoryIcons[name] || categoryIcons['Miscellaneous'];
    
    return {
      name,
      amount,
      percentage,
      icon,
      color,
      pieColor
    };
  }).sort((a, b) => b.amount - a.amount);
};

// Helper function to process merchants from transactions
const processMerchantsFromTransactions = (transactions: any[]) => {
  const merchantMap = new Map();
  
  transactions.forEach(t => {
    const merchantName = t.description.split(' ')[0];
    const currentAmount = merchantMap.get(merchantName)?.amount || 0;
    const currentCount = merchantMap.get(merchantName)?.count || 0;
    
    merchantMap.set(merchantName, {
      amount: currentAmount + t.amount,
      count: currentCount + 1
    });
  });
  
  return Array.from(merchantMap.entries())
    .map(([name, data]: [string, any]) => ({
      name,
      amount: data.amount,
      count: data.count
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Helper function to get merchant category
const getMerchantCategory = (merchantName: string, transactions: any[]): string | null => {
  const transaction = transactions.find(t => t.description.includes(merchantName));
  return transaction?.category || null;
};

// New helper function to generate enhanced insights with actionable recommendations
const generateEnhancedInsights = (
  statement: any, 
  categories: any[],
  merchants: any[], 
  previousMonthData: { totalExpenses: number; categoryPercentages: Record<string, number> }
) => {
  const insights: {
    type: 'warning' | 'success' | 'info';
    title: string;
    description: string;
    action?: string;
  }[] = [];

  // Calculate monthly budget based on total expenses
  const monthlyBudget = statement.totalExpense;
  const topCategory = categories[0];
  const topMerchant = merchants[0];

  // Calculate month-over-month changes
  const expenseChange = previousMonthData.totalExpenses > 0 
    ? ((statement.totalExpense - previousMonthData.totalExpenses) / previousMonthData.totalExpenses) * 100 
    : 0;
  const expenseChangeRounded = Math.round(expenseChange);

  // Add insights based on spending patterns
  if (topCategory && topCategory.percentage > 35) {
    insights.push({
      type: 'warning',
      title: `High ${topCategory.name} Spending (${topCategory.percentage}%)`,
      description: `Your ${topCategory.name} spending of $${topCategory.amount.toLocaleString()} represents ${topCategory.percentage}% of your total expenses, which is higher than the recommended 30% threshold.`,
      action: `Consider reducing your ${topCategory.name} expenses by $${Math.round((topCategory.percentage - 30) * statement.totalExpense / 100).toLocaleString()} per month to reach the recommended level.`
    });
  }

  // Month-over-month comparison insight
  if (Math.abs(expenseChangeRounded) > 0) {
    if (expenseChangeRounded > 15) {
      insights.push({
        type: 'warning',
        title: `Spending Increased by ${expenseChangeRounded}%`,
        description: `Your total spending of $${statement.totalExpense.toLocaleString()} has increased by ${expenseChangeRounded}% compared to last month ($${previousMonthData.totalExpenses.toLocaleString()}).`,
        action: 'Review your recent transactions to identify unexpected increases in spending.'
      });
    } else if (expenseChangeRounded < -10) {
      insights.push({
        type: 'success',
        title: `Spending Decreased by ${Math.abs(expenseChangeRounded)}%`,
        description: `Your total spending of $${statement.totalExpense.toLocaleString()} has decreased by ${Math.abs(expenseChangeRounded)}% compared to last month ($${previousMonthData.totalExpenses.toLocaleString()}).`,
        action: 'Continue your savings momentum and consider directing saved amounts to investments or savings.'
      });
    }
  }

  // Merchant concentration insight
  if (topMerchant && (topMerchant.amount / statement.totalExpense) > 0.25) {
    const merchantPercentage = Math.round((topMerchant.amount / statement.totalExpense) * 100);
    insights.push({
      type: 'info',
      title: `${topMerchant.name}: ${merchantPercentage}% of Total Spending`,
      description: `You spent $${topMerchant.amount.toLocaleString()} at ${topMerchant.name}, which represents ${merchantPercentage}% of your total monthly expenses.`,
      action: `Look for alternatives to ${topMerchant.name} that might offer better prices or negotiate better terms if this is a recurring expense.`
    });
  }

  // Balance insight
  if (statement.balance !== undefined) {
    if (statement.balance < 0) {
      insights.push({
        type: 'warning',
        title: 'Negative Account Balance',
        description: `Your current balance of $${statement.balance.toLocaleString()} is negative. This may incur overdraft fees.`,
        action: 'Consider transferring funds into this account to avoid overdraft fees and interest charges.'
      });
    } else if (statement.balance > statement.totalExpense * 3) {
      insights.push({
        type: 'info',
        title: 'Excess Cash on Hand',
        description: `Your balance of $${statement.balance.toLocaleString()} is more than 3x your monthly expenses of $${statement.totalExpense.toLocaleString()}.`,
        action: 'Consider moving excess funds to high-yield savings or investments to earn better returns.'
      });
    }
  }

  // If no insights were generated, add some generic ones
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'Spending Analysis',
      description: `Your total monthly expenses are $${statement.totalExpense.toLocaleString()}, with ${topCategory ? topCategory.name : 'N/A'} as your largest spending category at ${topCategory ? topCategory.percentage : 0}%.`,
      action: 'Consider creating a budget to track and optimize your spending patterns.'
    });
  }

  return insights;
};

const Analyze = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { statementData, previousMonthData } = useStatement();
  const [loaded, setLoaded] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [exportFormat, setExportFormat] = useState<'image' | 'pdf'>('image');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  useEffect(() => {
    if (statementData) {
      setLoaded(true);
      generateFinancialInsights();
    }
  }, [statementData]);

  const generateFinancialInsights = async () => {
    if (!statementData) return;
    setIsGeneratingInsights(true);
    try {
      // For now, use the enhanced insights generator
      const categories = processCategoriesFromTransactions(statementData.transactions);
      const merchants = processMerchantsFromTransactions(statementData.transactions);
      const enhanced = generateEnhancedInsights(statementData, categories, merchants, previousMonthData || { totalExpenses: 0, categoryPercentages: {} });
      setInsights(enhanced.map(i => i.title));
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleExport = async () => {
    if (!statementData) return;
    setIsExporting(true);
    try {
      const element = document.getElementById('export-report');
      if (!element) throw new Error('Export element not found');

      if (exportFormat === 'image') {
        const canvas = await html2canvas(element);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'financial_analysis.png';
        link.click();
      } else if (exportFormat === 'pdf') {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('financial_analysis.pdf');
      }
      toast({
        title: "Success",
        description: "Export completed successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!statementData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Statement Data</h2>
          <p className="text-gray-600 mb-4">Please upload a bank statement first to view the analysis.</p>
          <Button onClick={() => navigate('/dashboard/upload')}>
            Upload Statement
          </Button>
        </div>
      </div>
    );
  }

  const categories = processCategoriesFromTransactions(statementData.transactions);
  const merchants = processMerchantsFromTransactions(statementData.transactions);
  const topCategory = categories[0] || {
    name: 'Shopping',
    amount: 1240,
    percentage: 28,
    icon: TrendingUp,
    color: 'bg-blue-500'
  };
  const topMerchant = merchants[0] || {
    name: 'Rent',
    amount: 1800,
    count: 1
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Analysis</h1>
          <p className="text-gray-600">Detailed breakdown of your financial statement</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsSaveDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Bookmark className="h-4 w-4" />
            Save Analysis
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Export Report Section */}
      <div id="export-report">
        <ExportReport 
          statement={statementData} 
          previousMonthData={previousMonthData ? {
            totalExpenses: previousMonthData.totalExpense,
            categoryPercentages: previousMonthData.categoryPercentages
          } : undefined}
          insights={insights}
        />
      </div>

      {/* Save Analysis Dialog */}
      <SaveAnalysisDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        statementData={statementData}
        insights={insights}
        categories={categories}
      />
    </div>
  );
};

export default Analyze;
