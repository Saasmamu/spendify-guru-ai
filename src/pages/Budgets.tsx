
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Wallet, AlertTriangle, CheckCircle, BarChart } from 'lucide-react';
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

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
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
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load budgets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getBudgetProgress = (budget: Budget) => {
    // This would calculate actual spending vs budget
    // For now, returning mock data
    const totalAllocated = budget.budget_categories.reduce((sum, cat) => sum + cat.allocated_amount, 0);
    const spent = Math.random() * totalAllocated; // Mock spent amount
    const progress = (spent / totalAllocated) * 100;
    
    return {
      spent,
      remaining: totalAllocated - spent,
      progress: Math.min(progress, 100),
      isOverBudget: spent > totalAllocated
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading budgets...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Budget Tracking</h1>
            <p className="text-muted-foreground">
              Manage your budgets and track spending across categories
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/budgets/dashboard">
              <Button variant="outline" size="lg">
                <BarChart className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/budgets/create">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Budget
              </Button>
            </Link>
          </div>
        </div>

        {budgets.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first budget to start tracking your spending
              </p>
              <Link to="/budgets/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Budget
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => {
              const progress = getBudgetProgress(budget);
              
              return (
                <Link key={budget.id} to={`/budgets/${budget.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{budget.name}</CardTitle>
                        {progress.isOverBudget ? (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <CardDescription>
                        {budget.period} • {budget.budget_categories.length} categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Spent</span>
                            <span className={progress.isOverBudget ? 'text-destructive' : ''}>
                              {formatCurrency(progress.spent)}
                            </span>
                          </div>
                          <Progress 
                            value={progress.progress} 
                            className={`h-2 ${progress.isOverBudget ? 'bg-destructive/20' : ''}`}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Remaining: {formatCurrency(progress.remaining)}</span>
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
        )}
      </div>
    </div>
  );
};

export default Budgets;
