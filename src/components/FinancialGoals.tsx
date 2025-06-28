
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Plus, Lightbulb } from 'lucide-react';
import { financialGoalsService, GoalSuggestion } from '@/services/financialGoalsService';

interface FinancialGoal {
  id?: string;
  user_id?: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  type: 'savings' | 'budget' | 'emergency' | 'retirement';
  category_id?: string;
  category?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  status?: 'completed' | 'overdue' | 'urgent' | 'in_progress';
  progress_percentage?: number;
}

const FinancialGoals: React.FC = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [suggestions, setSuggestions] = useState<GoalSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    type: 'savings' as 'savings' | 'budget' | 'emergency' | 'retirement',
    category_id: '',
    notes: ''
  });

  useEffect(() => {
    fetchGoals();
    fetchSuggestions();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await financialGoalsService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await financialGoalsService.getGoalSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newGoal = {
        name: formData.name,
        target_amount: parseFloat(formData.targetAmount),
        current_amount: parseFloat(formData.currentAmount) || 0,
        deadline: formData.deadline,
        type: formData.type,
        category_id: formData.category_id,
        notes: formData.notes,
        status: 'in_progress' as const,
        progress_percentage: 0
      };

      await financialGoalsService.addGoal(newGoal);
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        type: 'savings',
        category_id: '',
        notes: ''
      });
      fetchGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: GoalSuggestion) => {
    setFormData({
      name: suggestion.name,
      targetAmount: suggestion.suggested_amount.toString(),
      currentAmount: '0',
      deadline: suggestion.suggested_deadline,
      type: suggestion.type as 'savings' | 'budget' | 'emergency' | 'retirement',
      category_id: suggestion.category_id,
      notes: suggestion.description || ''
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Financial Goals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  placeholder="Enter target amount"
                  required
                />
              </div>

              <div>
                <Label htmlFor="currentAmount">Current Amount</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                  placeholder="Enter current amount"
                />
              </div>

              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Goal Type</Label>
                <Select value={formData.type} onValueChange={(value: 'savings' | 'budget' | 'emergency' | 'retirement') => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any additional notes"
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{suggestion.name}</h4>
                    <span className="text-sm text-gray-500">{suggestion.type}</span>
                  </div>
                  <Progress value={0} className="mb-2" />
                  <p className="text-sm text-gray-600">
                    Target: ${suggestion.suggested_amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{goal.name}</h4>
                  <span className="text-sm text-gray-500">{goal.type}</span>
                </div>
                <Progress value={(goal.current_amount / goal.target_amount) * 100} className="mb-2" />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Current: ${goal.current_amount.toLocaleString()}</span>
                  <span>Target: ${goal.target_amount.toLocaleString()}</span>
                </div>
                {goal.notes && (
                  <p className="text-sm text-gray-600 mt-2">{goal.notes}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialGoals;
