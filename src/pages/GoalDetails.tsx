
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Plus, Calendar, DollarSign, Flag, Target } from 'lucide-react';
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
  notes: string | null;
}

const GoalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && id) {
      fetchGoal();
    }
  }, [user, id]);

  const fetchGoal = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setGoal(data);
    } catch (error) {
      console.error('Error fetching goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to load goal details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !newAmount) return;

    setUpdating(true);
    try {
      const amount = parseFloat(newAmount);
      const { error } = await supabase.rpc('update_goal_progress', {
        p_goal_id: goal.id,
        p_amount: amount,
        p_notes: notes || null,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Goal progress updated successfully',
      });

      // Refresh goal data
      fetchGoal();
      setNewAmount('');
      setNotes('');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update goal progress',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
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
      month: 'long',
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
            <div className="text-lg">Loading goal details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto pt-24 px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Goal not found</h2>
            <Link to="/dashboard/goals">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Goals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const remaining = goal.target_amount - (goal.current_amount || 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto pt-24 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/goals">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              {getTypeIcon(goal.type)}
              <div>
                <h1 className="text-3xl font-bold">{goal.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline: {formatDate(goal.deadline)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(goal.status)}>
              {goal.status?.replace('_', ' ')}
            </Badge>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Goal
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Progress Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Track your progress towards your goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Progress</span>
                  <span>{goal.progress_percentage?.toFixed(1) || 0}%</span>
                </div>
                <Progress value={goal.progress_percentage || 0} className="h-4" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Current: {formatCurrency(goal.current_amount || 0)}</span>
                  <span>Target: {formatCurrency(goal.target_amount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(goal.current_amount || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Current Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(goal.target_amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">Target Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(remaining)}
                  </div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>

              {goal.notes && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{goal.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Update Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Update Progress</CardTitle>
              <CardDescription>Add funds to track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProgress} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">New Total Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder={`Current: ${goal.current_amount || 0}`}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note about this update..."
                  />
                </div>

                <Button type="submit" disabled={updating} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {updating ? 'Updating...' : 'Update Progress'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalDetails;
