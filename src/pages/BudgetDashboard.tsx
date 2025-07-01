import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { budgetService, BudgetWithCategories } from '@/services/budgetService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Target,
  Calendar,
  Plus,
  CheckCircle,
  Wallet,
  Brain,
  Activity
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

const BudgetDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [budgets, setBudgets] = useState<BudgetWithCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await budgetService.getBudgets(user!.id);
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load budget data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallMetrics = () => {
    const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => 
      sum + budget.categories.reduce((catSum, cat) => catSum + cat.spent_amount, 0), 0
    );
    const totalRemaining = totalBudgeted - totalSpent;
    const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
    
    return { totalBudgeted, totalSpent, totalRemaining, overallPercentage };
  };

  const generateCategoryBreakdown = () => {
    return budgets.flatMap(budget => 
      budget.categories.map(cat => ({
        name: cat.category,
        value: cat.spent_amount,
        budget: cat.allocated_amount,
        percentage: (cat.spent_amount / cat.allocated_amount) * 100
      }))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="text-center py-12">
            <PieChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Budgets Found</h2>
            <p className="text-muted-foreground mb-6">
              Create your first budget to start tracking your spending and get insights.
            </p>
            <Button onClick={() => navigate('/budgets/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Budget
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = calculateOverallMetrics();
  const categoryBreakdown = generateCategoryBreakdown();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Budget Dashboard</h1>
              <p className="text-muted-foreground">
                Comprehensive view of your financial goals and spending patterns
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/budgets/create')}>
                <Plus className="w-4 h-4 mr-2" />
                New Budget
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.totalBudgeted)}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {budgets.length} budget{budgets.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.totalSpent)}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.overallPercentage.toFixed(1)}% of total budget
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${metrics.totalRemaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(metrics.totalRemaining)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.totalRemaining < 0 ? 'Over budget' : 'Within budget'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.overallPercentage > 90 ? '⚠️' : metrics.overallPercentage > 75 ? '⚡' : '✅'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.overallPercentage > 90 ? 'Needs attention' : metrics.overallPercentage > 75 ? 'Watch closely' : 'Healthy'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Budget Progress</CardTitle>
                  <CardDescription>
                    Your spending progress across all budgets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Total Progress</span>
                      <span>{metrics.overallPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(metrics.overallPercentage, 100)} className="h-3" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Spent: {formatCurrency(metrics.totalSpent)}</span>
                      <span>Budget: {formatCurrency(metrics.totalBudgeted)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>
                    Spending distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {budgets.map((budget) => {
                const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent_amount, 0);
                const percentage = (totalSpent / budget.amount) * 100;
                const remaining = budget.amount - totalSpent;
                
                return (
                  <Link key={budget.id} to={`/budgets/${budget.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{budget.name}</CardTitle>
                          {percentage > 90 ? (
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <CardDescription>
                          {budget.period} • {budget.categories.length} categories
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Spent</span>
                              <span className={percentage > 90 ? 'text-destructive' : ''}>
                                {formatCurrency(totalSpent)}
                              </span>
                            </div>
                            <Progress 
                              value={Math.min(percentage, 100)} 
                              className={`h-2 ${percentage > 90 ? 'bg-destructive/20' : ''}`}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Remaining: {formatCurrency(remaining)}</span>
                              <span>Total: {formatCurrency(budget.amount)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Budget Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Overall Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      You have spent {metrics.overallPercentage.toFixed(1)}% of your total budget. 
                      {metrics.overallPercentage > 90 ? ' Consider reducing expenses in high-spending categories.' : 
                       metrics.overallPercentage > 75 ? ' You\'re on track but monitor closely.' :
                       ' Great job staying within budget!'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Optimization Tips</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider setting up automatic savings transfers for your remaining budget balance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Spending</CardTitle>
                <CardDescription>Category-wise comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="budget" fill="hsl(var(--secondary))" name="Budget" />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BudgetDashboard;