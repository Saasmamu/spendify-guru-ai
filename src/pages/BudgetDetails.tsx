
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

interface Budget {
  id: string;
  name: string;
  amount: number;
  period: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  budget_categories: {
    id: string;
    category: string;
    allocated_amount: number;
  }[];
}

const BudgetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && id) {
      fetchBudget();
    }
  }, [user, id]);

  const fetchBudget = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          budget_categories (
            id,
            category,
            allocated_amount
          )
        `)
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setBudget(data);
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to load budget details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryProgress = (allocated: number) => {
    // Mock spending data - in real app, this would come from expenses
    const spent = Math.random() * allocated * 1.2; // Sometimes over budget
    const progress = (spent / allocated) * 100;
    
    return {
      spent,
      remaining: allocated - spent,
      progress: Math.min(progress, 100),
      isOverBudget: spent > allocated
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading budget details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Budget not found</h2>
            <Link to="/dashboard/budgets">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Budgets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = budget.budget_categories.reduce((sum, cat) => {
    return sum + getCategoryProgress(cat.allocated_amount).spent;
  }, 0);

  const overallProgress = (totalSpent / budget.amount) * 100;
  const isOverBudget = totalSpent > budget.amount;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/budgets">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{budget.name}</h1>
              <p className="text-muted-foreground">
                {formatDate(budget.start_date)} 
                {budget.end_date && ` - ${formatDate(budget.end_date)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={budget.period === 'monthly' ? 'default' : 'secondary'}>
              {budget.period}
            </Badge>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Budget
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Overview Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Budget Overview
                {isOverBudget ? (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Total Spent</span>
                  <span className={isOverBudget ? 'text-destructive font-medium' : ''}>
                    {formatCurrency(totalSpent)}
                  </span>
                </div>
                <Progress 
                  value={overallProgress} 
                  className={`h-3 ${isOverBudget ? 'bg-destructive/20' : ''}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    Remaining: {formatCurrency(budget.amount - totalSpent)}
                  </span>
                  <span>{overallProgress.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(budget.amount)}</div>
                  <div className="text-xs text-muted-foreground">Total Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{budget.budget_categories.length}</div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Category Breakdown</h2>
            
            {budget.budget_categories.map((category) => {
              const progress = getCategoryProgress(category.allocated_amount);
              
              return (
                <Card key={category.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{category.category}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(category.allocated_amount)} allocated
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${progress.isOverBudget ? 'text-destructive' : ''}`}>
                          {formatCurrency(progress.spent)}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {progress.isOverBudget ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-destructive" />
                              <span className="text-destructive">Over budget</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 text-green-500" />
                              <span className="text-green-500">On track</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Progress 
                        value={progress.progress} 
                        className={`h-2 ${progress.isOverBudget ? 'bg-destructive/20' : ''}`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>
                          {progress.remaining > 0 
                            ? `${formatCurrency(progress.remaining)} remaining`
                            : `${formatCurrency(Math.abs(progress.remaining))} over`
                          }
                        </span>
                        <span>{progress.progress.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDetails;
