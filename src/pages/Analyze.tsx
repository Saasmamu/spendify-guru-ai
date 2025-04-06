import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import { 
  PieChart as PieChartIcon, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  ShoppingBag, 
  Home, 
  Car, 
  Coffee, 
  Tag, 
  SparkleIcon, 
  Store, 
  Printer,
  Download
} from 'lucide-react';
import { useStatement } from '@/contexts/StatementContext';
import ApiKeyInput from '@/components/ApiKeyInput';
import { generateInsights, hasGeminiApiKey } from '@/services/insightService';
import { useToast } from '@/components/ui/use-toast';
import { BankTransaction } from '@/services/pdfService';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const processCategoriesFromTransactions = (transactions: BankTransaction[]) => {
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
    'Miscellaneous': { icon: Tag, color: 'bg-purple-500', pieColor: '#a855f7' }
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

const processMerchantsFromTransactions = (transactions: BankTransaction[]) => {
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
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
};

const mockCategories = [
  { name: 'Shopping', amount: 1240, percentage: 28, icon: ShoppingBag, color: 'bg-blue-500', pieColor: '#3b82f6' },
  { name: 'Housing', amount: 1800, percentage: 40, icon: Home, color: 'bg-green-500', pieColor: '#22c55e' },
  { name: 'Transportation', amount: 450, percentage: 10, icon: Car, color: 'bg-amber-500', pieColor: '#f59e0b' },
  { name: 'Food & Dining', amount: 680, percentage: 15, icon: Coffee, color: 'bg-red-500', pieColor: '#ef4444' },
  { name: 'Miscellaneous', amount: 320, percentage: 7, icon: Tag, color: 'bg-purple-500', pieColor: '#a855f7' }
];

const mockTransactions: BankTransaction[] = [
  { date: '2023-06-15', description: 'Whole Foods Market', amount: 78.35, category: 'Food & Dining', type: 'debit' },
  { date: '2023-06-14', description: 'Amazon.com', amount: 124.99, category: 'Shopping', type: 'debit' },
  { date: '2023-06-13', description: 'Uber', amount: 24.50, category: 'Transportation', type: 'debit' },
  { date: '2023-06-10', description: 'Rent Payment', amount: 1800, category: 'Housing', type: 'debit' },
  { date: '2023-06-08', description: 'Starbucks', amount: 5.65, category: 'Food & Dining', type: 'debit' },
  { date: '2023-06-06', description: 'Target', amount: 95.47, category: 'Shopping', type: 'debit' },
  { date: '2023-06-05', description: 'Gas Station', amount: 45.23, category: 'Transportation', type: 'debit' },
  { date: '2023-06-03', description: 'Grocery Store', amount: 112.34, category: 'Food & Dining', type: 'debit' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Analyze = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { statementData } = useStatement();
  const [loaded, setLoaded] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [useRealData, setUseRealData] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);
  
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

  const categories = useRealData && statementData?.transactions 
    ? processCategoriesFromTransactions(statementData.transactions)
    : mockCategories;
  
  const transactions = useRealData && statementData?.transactions 
    ? statementData.transactions 
    : mockTransactions;
  
  const merchants = useRealData && statementData?.transactions
    ? processMerchantsFromTransactions(statementData.transactions)
    : processMerchantsFromTransactions(mockTransactions);
    
  const totalSpent = useRealData && statementData?.totalExpense 
    ? statementData.totalExpense
    : mockCategories.reduce((sum, category) => sum + category.amount, 0);

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
    if (!statementData) {
      toast({
        variant: "destructive",
        title: "No data available",
        description: "Please upload a bank statement to generate insights."
      });
      return;
    }
    
    setIsGeneratingInsights(true);
    
    try {
      console.log('Starting insight generation with data:', 
        `${statementData.transactions.length} transactions, income: ${statementData.totalIncome}, expenses: ${statementData.totalExpense}`);
      const generatedInsights = await generateInsights(statementData);
      setInsights(generatedInsights);
      
      toast({
        title: "Insights Generated",
        description: "AI analysis of your statement is complete!",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights([
        'Failed to generate AI insights. Please try again or check your connection.',
        'Consider reviewing your largest transactions for savings opportunities.',
        'Try categorizing your transactions to better understand spending patterns.'
      ]);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate insights: " + (error instanceof Error ? error.message : "Unknown error"),
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

  const handlePrintPDF = async () => {
    if (!printRef.current) return;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your report...",
    });
    
    try {
      const content = printRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('financial-analysis.pdf');
      
      toast({
        title: "PDF Generated",
        description: "Your financial analysis has been downloaded successfully!",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-20 px-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 animate-slide-down">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Spending Analysis</h1>
          <p className="text-muted-foreground">
            {useRealData 
              ? `Analysis of your uploaded statement with ${statementData?.transactions.length} transactions`
              : 'Example data shown. Please upload a statement for real insights.'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
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
            <Button variant="outline" className="gap-2 text-sm">
              <DollarSign className="w-4 h-4" />
              Your Statement
            </Button>
          )}
          <Button
            variant="outline"
            className="gap-2 text-sm"
            onClick={handlePrintPDF}
          >
            <Printer className="w-4 h-4" />
            Print Report
          </Button>
        </div>
      </div>
      
      {!loaded ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-28">
                <CardContent className="p-6">
                  <div className="h-5 w-24 bg-muted/50 rounded-md mb-4"></div>
                  <div className="h-6 w-16 bg-muted/50 rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="h-96">
            <CardContent className="p-6">
              <div className="h-full w-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 mb-4"></div>
                <div className="h-4 w-32 bg-muted/50 rounded-md"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6" ref={printRef}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
            <StatCard
              title="Total Expenses"
              value={`$${totalSpent.toLocaleString()}`}
              icon={<DollarSign className="w-4 h-4 text-primary" />}
              trend="up"
              trendValue={statementData ? `${statementData.transactions.length} items` : "+12%"}
            />
            <StatCard
              title="Top Category"
              value={categories[0]?.name || "N/A"}
              icon={categories[0]?.icon ? React.createElement(categories[0].icon, { className: "w-4 h-4 text-green-500" }) : <Tag className="w-4 h-4 text-green-500" />}
              trend="neutral"
              trendValue={categories[0] ? `${categories[0].percentage}%` : "0%"}
            />
            <StatCard
              title="Top Merchant"
              value={merchants[0]?.name || "N/A"}
              icon={<Store className="w-4 h-4 text-amber-500" />}
              trend="neutral"
              trendValue={merchants[0] ? `$${merchants[0].amount.toFixed(2)}` : "$0.00"}
            />
          </div>
          
          <Tabs defaultValue="categories" className="animate-blur-in" style={{ animationDelay: '200ms' }}>
            <TabsList className="mb-6">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="merchants">Merchants</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
                      
                      <div className="space-y-4 mt-6">
                        {categories.map((category, index) => (
                          <div key={index} className={cn(
                            "animate-fade-in",
                            index === activeIndex ? "scale-105 transition-transform" : ""
                          )} style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <div className={cn("p-1.5 rounded-md mr-2", category.color)}>
                                  {React.createElement(category.icon, { className: "w-3.5 h-3.5 text-white" })}
                                </div>
                                <span className="text-sm font-medium">{category.name}</span>
                              </div>
                              <span className="text-sm font-medium">${category.amount.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", category.color)}
                                style={{ width: `${category.percentage}%`, transition: "width 1s ease-in-out" }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>{category.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="h-64 w-full max-w-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              animationBegin={0}
                              animationDuration={1500}
                              animationEasing="ease-out"
                              onMouseEnter={onPieEnter}
                            >
                              {chartData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.color} 
                                  className={cn(
                                    "transition-opacity duration-300",
                                    index === activeIndex ? "filter drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))" : "opacity-70"
                                  )}
                                  stroke={index === activeIndex ? "#fff" : "none"}
                                  strokeWidth={index === activeIndex ? 2 : 0}
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-background border border-border p-2 rounded-md shadow-md">
                                      <p className="font-medium">{data.name}</p>
                                      <p className="text-sm">${data.value.toFixed(2)}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend 
                              layout="horizontal" 
                              verticalAlign="bottom" 
                              align="center"
                              wrapperStyle={{ paddingTop: "20px" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="merchants">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Top Merchants</h3>
                      
                      <div className="space-y-4 mt-6">
                        {merchants.map((merchant, index) => (
                          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <div className={cn("p-1.5 rounded-md mr-2", `bg-${COLORS[index % COLORS.length].replace('#', '')}-500`)}
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                  <Store className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm font-medium">{merchant.name}</span>
                              </div>
                              <span className="text-sm font-medium">${merchant.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>{merchant.count} transactions</span>
                              <span>Avg: ${(merchant.amount / merchant.count).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={merchants.slice(0, 8)}
                            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                            <YAxis />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-background border border-border p-2 rounded-md shadow-md">
                                      <p className="font-medium">{data.name}</p>
                                      <p className="text-sm">${data.amount.toFixed(2)}</p>
                                      <p className="text-sm">{data.count} transactions</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="amount" fill="#8884d8">
                              {merchants.slice(0, 8).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction, index) => (
                          <tr 
                            key={transaction.id || index}
                            className={cn(
                              "border-b border-border/50 hover:bg-muted/20 transition-colors",
                              "animate-fade-in"
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="py-3 px-4 text-sm">
                              {transaction.date}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium">{transaction.description}</td>
                            <td className="py-3 px-4 text-sm">
                              <span className="px-2 py-1 rounded-full text-xs bg-muted/50">
                                {transaction.category || "Uncategorized"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              ${transaction.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">AI-Powered Insights</h3>
                    <div className="mt-2 md:mt-0 flex gap-2">
                      <Button 
                        onClick={generateAIInsights} 
                        disabled={isGeneratingInsights}
                        className="gap-2"
                      >
                        <SparkleIcon className="w-4 h-4" />
                        {isGeneratingInsights ? 'Generating...' : 'Generate Insights'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handlePrintPDF}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                  
                  {insights.length > 0 ? (
                    <div className="space-y-6">
                      <div className="p-4 rounded-md bg-primary/5 border border-primary/20 animate-slide-up">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <ArrowDown className="w-4 h-4 text-green-500" />
                          {insights[0] ? 'Spending Opportunity' : 'No Insights Available'}
                        </h4>
                        <p className="text-muted-foreground">
                          {insights[0] || 'Generate insights to see recommendations based on your spending patterns.'}
                        </p>
                      </div>
                      
                      {insights[1] && (
                        <div className="p-4 rounded-md bg-amber-500/5 border border-amber-500/20 animate-slide-up" style={{ animationDelay: '100ms' }}>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <PieChartIcon className="w-4 h-4 text-amber-500" />
                            Category Analysis
                          </h4>
                          <p className="text-muted-foreground">{insights[1]}</p>
                        </div>
                      )}
                      
                      {insights[2] && (
                        <div className="p-4 rounded-md bg-green-500/5 border border-green-500/20 animate-slide-up" style={{ animationDelay: '200ms' }}>
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <ArrowUp className="w-4 h-4 text-green-500" />
                            Savings Recommendation
                          </h4>
                          <p className="text-muted-foreground">{insights[2]}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="bg-muted/30 p-4 rounded-full mb-4">
                        <SparkleIcon className="w-8 h-8 text-primary/50" />
                      </div>
                      <h4 className="text-lg font-medium mb-2">No insights generated yet</h4>
                      <p className="text-muted-foreground max-w-md mb-6">
                        Click the "Generate Insights" button to get AI-powered recommendations based on your financial data.
                      </p>
                      {!hasGeminiApiKey() && (
                        <div className="mt-2 p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-sm max-w-md">
                          <p className="font-medium mb-1">API Key Required</p>
                          <p>Please set your Gemini API key in the settings to enable AI insights.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Analyze;
