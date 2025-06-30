
import React, { useState, useEffect } from 'react';
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
  Brain
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

interface BudgetInsight {
  type: 'warning' | 'success' | 'info' | 'danger';
  title: string;
  description: string;
  action?: string;
}

const BudgetDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [budgets, setBudgets] = useState<BudgetWithCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [insights, setInsights] = useState<BudgetInsight[]>([]);

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
      generateInsights(data);
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

  const generateInsights = (budgetData: BudgetWithCategories[]) => {
    const insights: BudgetInsight[] = [];
    
    budgetData.forEach(budget => {
      const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent_amount, 0);
      const spentPercentage = (totalSpent / budget.amount) * 100;
      
      if (spentPercentage > 90) {
        insights.push({
          type: 'danger',
          title: `${budget.name} Almost Exhausted`,
          description: `You've spent ${spentPercentage.toFixed(1)}% of your budget. Consider reviewing your expenses.`,
          action: 'Review Budget'
        });
      } else if (spentPercentage > 75) {
        insights.push({
          type: 'warning',
          title: `${budget.name} Nearing Limit`,
          description: `You've spent ${spentPercentage.toFixed(1)}% of your budget. Monitor closely.`,
          action: 'Monitor Spending'
        });
      }
      
      budget.categories.forEach(category => {
        if (category.percentage > 100) {
          insights.push({
            type: 'danger',
            title: `${category.category} Over Budget`,
            description: `This category has exceeded its allocation by ${(category.percentage - 100).toFixed(1)}%.`,
            action: 'Adjust Category'
          });
        }
      });
    });

    // Add positive insights
    if (budgetData.length > 0) {
      const wellManagedBudgets = budgetData.filter(b => {
        const totalSpent = b.categories.reduce((sum, cat) => sum + cat.spent_amount, 0);
        const spentPercentage = (totalSpent / b.amount) * 100;
        return spentPercentage <= 75;
      });

      if (wellManagedBudgets.length > 0) {
        insights.push({
          type: 'success',
          title: 'Good Budget Management',
          description: `${wellManagedBudgets.length} of your budgets are well within limits. Keep it up!`,
        });
      }
    }

    setInsights(insights);
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

  const prepareChartData = () => {
    const filteredBudgets = selectedBudget === 'all' 
      ? budgets 
      : budgets.filter(b => b.id === selectedBudget);

    const categoryData = {};
    const budgetComparisonData = [];

    filteredBudgets.forEach(budget => {
      const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent_amount, 0);
      
      budgetComparisonData.push({
        name: budget.name,
        budgeted: budget.amount,
        spent: totalSpent,
        remaining: budget.amount - totalSpent
      });

      budget.categories.forEach(category => {
        if (categoryData[category.category]) {
          categoryData[category.category] += category.spent_amount;
        } else {
          categoryData[category.category] = category.spent_amount;
        }
      });
    });

    const pieData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value: value as number
    }));

    return { pieData, budgetComparisonData };
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <TrendingUp className="w-4 h-4 text-green-500" />;
      default: return <Brain className="w-4 h-4 text-blue-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'danger': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
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
      <div className="min-h-screen">
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
  const { pieData, budgetComparisonData } = prepareChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto pt-24 px-4 pb-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Budget Dashboard</h1>
              <p className="text-muted-foreground">
                Track your spending, analyze trends, and get AI-powered insights
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/budgets')}>
                Manage Budgets
              </Button>
              <Button onClick={() => navigate('/budgets/create')}>
                <Plus className="w-4 h-4 mr-2" />
                New Budget
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgets.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently tracking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
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

        {/* AI Insights */}
        {insights.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Insights & Recommendations
              </CardTitle>
              <CardDescription>
                Smart analysis of your budget performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        {insight.action && (
                          <Badge variant="outline" className="text-xs">
                            {insight.action}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts and Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="comparison">Budget vs Actual</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>
                    Distribution of your expenses across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Performance</CardTitle>
                  <CardDescription>
                    Individual budget progress and health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.map((budget) => {
                      const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent_amount, 0);
                      const percentage = (totalSpent / budget.amount) * 100;
                      const remaining = budget.amount - totalSpent;
                      
                      return (
                        <div key={budget.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{budget.name}</span>
                            <Badge variant={percentage > 90 ? 'destructive' : percentage > 75 ? 'secondary' : 'default'}>
                              {percentage.toFixed(1)}%
                            </Badge>
                          </div>
                          <Progress value={Math.min(percentage, 100)} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Spent: {formatCurrency(totalSpent)}</span>
                            <span>Remaining: {formatCurrency(remaining)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Spending Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of spending by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pieData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Spending</CardTitle>
                <CardDescription>
                  Compare your planned budget with actual spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
                      <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BudgetDashboard;
