
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Expense {
  id: string;
  user_id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  receipt?: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: any) => Promise<void>;
  categories: Category[];
  expense?: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  categories, 
  expense 
}) => {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    date: new Date(),
    receipt: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        category: expense.category,
        amount: expense.amount.toString(),
        date: new Date(expense.date),
        receipt: expense.receipt || ''
      });
    } else {
      setFormData({
        description: '',
        category: '',
        amount: '',
        date: new Date(),
        receipt: ''
      });
    }
  }, [expense, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description?.trim() || !formData.category || !formData.amount) {
      console.log('Validation failed:', { formData });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      console.log('Invalid amount:', formData.amount);
      return;
    }

    try {
      setLoading(true);
      
      const expenseData = {
        description: formData.description.trim(),
        category: formData.category,
        amount: amount,
        date: format(formData.date, 'yyyy-MM-dd'),
        receipt: formData.receipt || null,
        ...(expense && { id: expense.id })
      };

      console.log('Submitting expense data:', expenseData);
      await onSave(expenseData);
      
      if (!expense) {
        setFormData({
          description: '',
          category: '',
          amount: '',
          date: new Date(),
          receipt: ''
        });
      }
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {expense ? 'Update your expense details' : 'Add a new expense to track your spending'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Coffee at Starbucks"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-sm text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="pl-7"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt/Notes (Optional)</Label>
            <Textarea
              id="receipt"
              placeholder="Additional notes or receipt information"
              value={formData.receipt}
              onChange={(e) => setFormData(prev => ({ ...prev, receipt: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {expense ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                expense ? 'Update Expense' : 'Add Expense'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;
