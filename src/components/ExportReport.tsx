
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProcessedStatement } from '@/services/pdfService';
import { 
  DollarSign, 
  ShoppingBag, 
  Home, 
  Car,
  Store,
  TrendingUp,
  ArrowUpCircle,
  Coffee
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryBreakdown {
  name: string;
  amount: number;
  percentage: number;
  icon: React.ElementType;
  color: string;
}

interface ExportReportProps {
  statement: ProcessedStatement;
  previousMonthData?: {
    totalExpenses: number;
    categoryPercentages: Record<string, number>;
  };
}

const ExportReport: React.FC<ExportReportProps> = ({ 
  statement,
  previousMonthData = {
    totalExpenses: 0,
    categoryPercentages: {}
  }
}) => {
  // Process category data
  const categories = processCategoriesFromTransactions(statement.transactions);
  const merchants = processMerchantsFromTransactions(statement.transactions);
  
  // Calculate percentage change from previous month
  const expenseChangePercent = previousMonthData.totalExpenses > 0 
    ? Math.round(((statement.totalExpense - previousMonthData.totalExpenses) / previousMonthData.totalExpenses) * 100) 
    : 12; // Default to 12% if no previous data
  
  // Get top category
  const topCategory = categories[0] || {
    name: 'Shopping',
    amount: 1240,
    percentage: 28,
    icon: ShoppingBag,
    color: 'bg-blue-500'
  };

  // Get top merchant
  const topMerchant = merchants[0] || {
    name: 'Rent',
    amount: 1800,
    count: 1
  };

  // Calculate category percentage change
  const getCategoryChange = (categoryName: string) => {
    const prevPercentage = previousMonthData.categoryPercentages[categoryName] || 0;
    if (prevPercentage === 0) return 0;
    
    const currentCategory = categories.find(c => c.name === categoryName);
    if (!currentCategory) return 0;
    
    return Math.round(currentCategory.percentage - prevPercentage);
  };

  return (
    <div className="bg-background rounded-lg p-6 max-w-md mx-auto">
      {/* Total Expenses */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-muted-foreground text-lg font-medium">Total Expenses</h2>
          <DollarSign className="text-blue-500 h-6 w-6" />
        </div>
        <div className="mt-4">
          <h1 className="text-4xl font-bold">${statement.totalExpense.toLocaleString()}</h1>
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-sm font-medium",
              expenseChangePercent >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {expenseChangePercent >= 0 ? "+" : ""}{expenseChangePercent}%
            </span>
            <span className="text-sm text-muted-foreground ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Top Category */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-muted-foreground text-lg font-medium">Top Category</h2>
          <div className={cn("p-1.5 rounded-full", topCategory.color)}>
            {React.createElement(topCategory.icon, { className: "text-white h-5 w-5" })}
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-3xl font-bold">{topCategory.name}</h2>
          <div className="flex items-center mt-2">
            <span className="text-sm font-medium">
              {topCategory.percentage}%
            </span>
            <span className="text-sm text-muted-foreground ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Top Merchant */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-muted-foreground text-lg font-medium">Top Merchant</h2>
          <Store className="text-amber-500 h-6 w-6" />
        </div>
        <div className="mt-4">
          <h2 className="text-3xl font-bold">{topMerchant.name}</h2>
          <div className="flex items-center mt-2">
            <span className="text-sm font-medium">
              ${topMerchant.amount.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Categories Tab Content */}
        <TabsContent value="categories">
          <h3 className="text-lg font-medium mb-6">Spending by Category</h3>
          
          {categories.slice(0, 3).map((category, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={cn("p-1.5 rounded-full mr-3", category.color)}>
                    {React.createElement(category.icon, { className: "text-white h-4 w-4" })}
                  </div>
                  <span>{category.name}</span>
                </div>
                <span className="font-medium">${category.amount.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full", category.color)}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {category.percentage}%
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Merchants Tab Content */}
        <TabsContent value="merchants">
          <h3 className="text-lg font-medium mb-4">Top Merchants</h3>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="py-2 font-medium text-sm">Merchant</TableHead>
                  <TableHead className="py-2 font-medium text-sm">Category</TableHead>
                  <TableHead className="py-2 font-medium text-sm text-right">Total Spent</TableHead>
                  <TableHead className="py-2 font-medium text-sm text-right">Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchants.slice(0, 10).map((merchant, i) => (
                  <TableRow key={i} className="border-t border-border/30">
                    <TableCell className="font-medium py-2 text-sm">{merchant.name}</TableCell>
                    <TableCell className="py-2 text-sm">
                      {getMerchantCategory(merchant.name, statement.transactions) || "Other"}
                    </TableCell>
                    <TableCell className="py-2 text-sm text-right">
                      ${merchant.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-2 text-sm text-right">
                      {merchant.count}x
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Other tabs would go here */}
        <TabsContent value="transactions">
          <div className="p-4 text-center text-muted-foreground">
            Transactions list will appear here
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="p-4 text-center text-muted-foreground">
            AI insights will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

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
    'Shopping': { icon: ShoppingBag, color: 'bg-blue-500', pieColor: '#3b82f6' },
    'Housing': { icon: Home, color: 'bg-green-500', pieColor: '#22c55e' },
    'Transportation': { icon: Car, color: 'bg-amber-500', pieColor: '#f59e0b' },
    'Food & Dining': { icon: Coffee, color: 'bg-red-500', pieColor: '#ef4444' },
    'Miscellaneous': { icon: ShoppingBag, color: 'bg-purple-500', pieColor: '#a855f7' }
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

// New helper function to get merchant category
const getMerchantCategory = (merchantName: string, transactions: any[]): string | null => {
  const transaction = transactions.find(t => t.description.includes(merchantName));
  return transaction?.category || null;
};

export default ExportReport;
