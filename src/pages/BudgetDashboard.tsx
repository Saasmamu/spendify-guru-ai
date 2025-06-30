
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
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BudgetInsights from '@/components/BudgetInsights';
import BudgetSpendingChart from '@/components/BudgetSpendingChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

const BudgetDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [budgets, setBudgets] = useState<BudgetWithCategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

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
      console.log('Budgets loaded:', data);
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
        <div className="mb-8">
          <BudgetInsights budgets={budgets} />
        </div>

        {/* Charts and Analytics */}
        <div className="mb-8">
          <BudgetSpendingChart 
            budgets={budgets}
            selectedBudget={selectedBudget}
            onBudgetChange={setSelectedBudget}
          />
        </div>

        {/* Individual Budget Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Performance</CardTitle>
            <CardDescription>
              Individual budget progress and health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgets.map((budget) => {
                const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent_amount, 0);
                const percentage = (totalSpent / budget.amount) * 100;
                const remaining = budget.amount - totalSpent;
                
                return (
                  <div key={budget.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg">{budget.name}</h4>
                      <Badge variant={percentage > 90 ? 'destructive' : percentage > 75 ? 'secondary' : 'default'}>
                        {percentage.toFixed(1)}% used
                      </Badge>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Spent:</span>
                        <div className="font-medium">{formatCurrency(totalSpent)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Remaining:</span>
                        <div className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {formatCurrency(remaining)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Category breakdown */}
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Categories</h5>
                      <div className="space-y-2">
                        {budget.categories.map((category) => (
                          <div key={category.id} className="flex justify-between items-center text-sm">
                            <span>{category.category}</span>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={Math.min(category.percentage, 100)} 
                                className="w-16 h-2" 
                              />
                              <span className={`font-medium ${category.percentage > 100 ? 'text-red-500' : ''}`}>
                                {formatCurrency(category.spent_amount)} / {formatCurrency(category.allocated_amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetDashboard;
