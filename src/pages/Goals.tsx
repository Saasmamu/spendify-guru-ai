
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Flag, Target, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

interface Goal {
  id: string;
  name: string;
  type: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: string;
  progress_percentage: number;
  created_at: string;
  category: string | null;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load goals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'urgent':
        return 'bg-orange-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'savings':
        return <DollarSign className="w-5 h-5" />;
      case 'debt_payment':
        return <Target className="w-5 h-5" />;
      default:
        return <Flag className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading goals...</div>
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
            <h1 className="text-3xl font-bold mb-2">Financial Goals</h1>
            <p className="text-muted-foreground">
              Track your progress towards achieving your financial objectives
            </p>
          </div>
          <Link to="/dashboard/goals/create">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Goal
            </Button>
          </Link>
        </div>

        {goals.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Flag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first financial goal to start tracking your progress
              </p>
              <Link to="/dashboard/goals/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <Link key={goal.id} to={`/dashboard/goals/${goal.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(goal.type)}
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(goal.deadline)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{goal.progress_percentage?.toFixed(1) || 0}%</span>
                        </div>
                        <Progress value={goal.progress_percentage || 0} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Current: {formatCurrency(goal.current_amount || 0)}</span>
                          <span>Target: {formatCurrency(goal.target_amount)}</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          {goal.current_amount && goal.target_amount
                            ? formatCurrency(goal.target_amount - goal.current_amount)
                            : formatCurrency(goal.target_amount)
                          } remaining
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
