import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import Navbar from '@/components/Navbar';
import { PieChart, ArrowDown, ArrowUp, DollarSign, ShoppingBag, Home, Car, Coffee, Tag } from 'lucide-react';

// Mock data
const mockCategories = [
  { name: 'Shopping', amount: 1240, percentage: 28, icon: ShoppingBag, color: 'bg-blue-500' },
  { name: 'Housing', amount: 1800, percentage: 40, icon: Home, color: 'bg-green-500' },
  { name: 'Transportation', amount: 450, percentage: 10, icon: Car, color: 'bg-amber-500' },
  { name: 'Food & Dining', amount: 680, percentage: 15, icon: Coffee, color: 'bg-red-500' },
  { name: 'Miscellaneous', amount: 320, percentage: 7, icon: Tag, color: 'bg-purple-500' }
];

const mockTransactions = [
  { id: 1, date: '2023-06-15', description: 'Whole Foods Market', amount: 78.35, category: 'Food & Dining' },
  { id: 2, date: '2023-06-14', description: 'Amazon.com', amount: 124.99, category: 'Shopping' },
  { id: 3, date: '2023-06-13', description: 'Uber', amount: 24.50, category: 'Transportation' },
  { id: 4, date: '2023-06-10', description: 'Rent Payment', amount: 1800, category: 'Housing' },
  { id: 5, date: '2023-06-08', description: 'Starbucks', amount: 5.65, category: 'Food & Dining' },
  { id: 6, date: '2023-06-06', description: 'Target', amount: 95.47, category: 'Shopping' },
  { id: 7, date: '2023-06-05', description: 'Gas Station', amount: 45.23, category: 'Transportation' },
  { id: 8, date: '2023-06-03', description: 'Grocery Store', amount: 112.34, category: 'Food & Dining' },
];

const Analyze = () => {
  const [loaded, setLoaded] = useState(false);
  const [activeChart, setActiveChart] = useState('all');
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const totalSpent = mockCategories.reduce((sum, category) => sum + category.amount, 0);
  
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-32 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 animate-slide-down">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Spending Analysis</h1>
            <p className="text-muted-foreground">
              Review your expenses and understand where your money is going
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="gap-2 text-sm">
              <DollarSign className="w-4 h-4" />
              June 2023
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
              <StatCard
                title="Total Expenses"
                value={`$${totalSpent.toLocaleString()}`}
                icon={<DollarSign className="w-4 h-4 text-primary" />}
                trend="up"
                trendValue="+12%"
              />
              <StatCard
                title="Top Category"
                value="Housing"
                icon={<Home className="w-4 h-4 text-green-500" />}
                trend="neutral"
                trendValue="40%"
              />
              <StatCard
                title="Transactions"
                value={mockTransactions.length}
                icon={<Tag className="w-4 h-4 text-amber-500" />}
                trend="down"
                trendValue="-3%"
              />
            </div>
            
            <Tabs defaultValue="categories" className="animate-blur-in" style={{ animationDelay: '200ms' }}>
              <TabsList className="mb-6">
                <TabsTrigger value="categories">Categories</TabsTrigger>
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
                          {mockCategories.map((category, index) => (
                            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center">
                                  <div className={cn("p-1.5 rounded-md mr-2", category.color)}>
                                    <category.icon className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <span className="text-sm font-medium">{category.name}</span>
                                </div>
                                <span className="text-sm font-medium">${category.amount}</span>
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
                        <div className="relative w-64 h-64">
                          <div className="absolute inset-0 rounded-full border-8 border-muted/30 animate-float"></div>
                          <div className="absolute inset-4 rounded-full border-8 border-blue-500/70 animate-pulse-subtle"></div>
                          <div className="absolute inset-8 rounded-full border-8 border-green-500/70"></div>
                          <div className="absolute inset-12 rounded-full border-8 border-amber-500/70 animate-pulse-subtle"></div>
                          <div className="absolute inset-16 rounded-full border-8 border-red-500/70"></div>
                          <div className="absolute inset-20 rounded-full border-8 border-purple-500/70 animate-pulse-subtle"></div>
                          <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
                            <span className="text-3xl font-bold">${totalSpent}</span>
                            <span className="text-sm text-muted-foreground">Total Spent</span>
                          </div>
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
                          {mockTransactions.map((transaction, index) => (
                            <tr 
                              key={transaction.id}
                              className={cn(
                                "border-b border-border/50 hover:bg-muted/20 transition-colors",
                                "animate-fade-in"
                              )}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <td className="py-3 px-4 text-sm">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-sm font-medium">{transaction.description}</td>
                              <td className="py-3 px-4 text-sm">
                                <span className="px-2 py-1 rounded-full text-xs bg-muted/50">
                                  {transaction.category}
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
                    <h3 className="text-lg font-medium mb-6">AI-Powered Insights</h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 rounded-md bg-primary/5 border border-primary/20 animate-slide-up">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <ArrowDown className="w-4 h-4 text-green-500" />
                          Spending Opportunities
                        </h4>
                        <p className="text-muted-foreground">
                          Your spending on food delivery services has increased by 30% this month. 
                          Consider cooking at home more frequently to save approximately $120 per month.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-md bg-amber-500/5 border border-amber-500/20 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <PieChart className="w-4 h-4 text-amber-500" />
                          Category Analysis
                        </h4>
                        <p className="text-muted-foreground">
                          Housing costs consume 40% of your monthly expenses, which is slightly higher than the recommended 30%. 
                          Consider evaluating your living situation for potential savings.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-md bg-green-500/5 border border-green-500/20 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <ArrowUp className="w-4 h-4 text-green-500" />
                          Savings Recommendation
                        </h4>
                        <p className="text-muted-foreground">
                          Based on your income and expenses, you could potentially save $350 more per month by 
                          reducing discretionary spending on shopping and entertainment.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
