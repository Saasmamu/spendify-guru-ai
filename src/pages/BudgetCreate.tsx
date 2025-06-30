
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

interface BudgetCategory {
  category: string;
  allocated_amount: number;
}

const BudgetCreate = () => {
  const [name, setName] = useState('');
  const [period, setPeriod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { category: '', allocated_amount: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const addCategory = () => {
    setCategories([...categories, { category: '', allocated_amount: 0 }]);
  };

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const updateCategory = (index: number, field: keyof BudgetCategory, value: string | number) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    setCategories(updated);
  };

  const getTotalAmount = () => {
    return categories.reduce((sum, cat) => sum + (cat.allocated_amount || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate form
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Budget name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!period) {
      toast({
        title: 'Error',
        description: 'Period is required',
        variant: 'destructive',
      });
      return;
    }

    if (!startDate) {
      toast({
        title: 'Error',
        description: 'Start date is required',
        variant: 'destructive',
      });
      return;
    }

    // Filter out empty categories
    const validCategories = categories.filter(cat => 
      cat.category.trim() && cat.allocated_amount > 0
    );

    if (validCategories.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one valid category is required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Creating budget with data:', {
        name: name.trim(),
        amount: getTotalAmount(),
        period,
        start_date: startDate,
        end_date: endDate || null,
        categories: validCategories
      });

      // Create budget
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          name: name.trim(),
          amount: getTotalAmount(),
          period,
          start_date: startDate,
          end_date: endDate || null,
        })
        .select()
        .single();

      if (budgetError) {
        console.error('Budget creation error:', budgetError);
        throw budgetError;
      }

      console.log('Budget created successfully:', budget);

      // Create budget categories - now with proper ID generation
      const categoriesData = validCategories.map(cat => ({
        budget_id: budget.id,
        category: cat.category.trim(),
        allocated_amount: cat.allocated_amount,
      }));

      console.log('Creating budget categories:', categoriesData);

      const { data: createdCategories, error: categoriesError } = await supabase
        .from('budget_categories')
        .insert(categoriesData)
        .select();

      if (categoriesError) {
        console.error('Budget categories creation error:', categoriesError);
        throw categoriesError;
      }

      console.log('Budget categories created successfully:', createdCategories);

      toast({
        title: 'Success',
        description: 'Budget created successfully',
      });

      navigate('/dashboard/budgets');
    } catch (error: any) {
      console.error('Error creating budget:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create budget',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto pt-24 px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Budget</h1>
          <p className="text-muted-foreground">
            Set up a new budget to track your spending across different categories
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budget Details</CardTitle>
            <CardDescription>
              Fill in the details for your new budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Budget Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Monthly Expenses"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Period *</Label>
                  <Select value={period} onValueChange={setPeriod} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Budget Categories *</Label>
                  <Button type="button" variant="outline" onClick={addCategory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>

                {categories.map((category, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`category-${index}`}>Category</Label>
                      <Input
                        id={`category-${index}`}
                        value={category.category}
                        onChange={(e) => updateCategory(index, 'category', e.target.value)}
                        placeholder="e.g., Food, Transportation"
                        required
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`amount-${index}`}>Amount</Label>
                      <Input
                        id={`amount-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={category.allocated_amount || ''}
                        onChange={(e) => updateCategory(index, 'allocated_amount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {categories.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCategory(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <div className="text-right border-t pt-4">
                  <span className="text-lg font-semibold">
                    Total Budget: ${getTotalAmount().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/budgets')}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Budget'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetCreate;
