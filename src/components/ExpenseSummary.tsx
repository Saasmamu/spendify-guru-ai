
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, PieChart } from 'lucide-react';

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

interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: string;
  start_date: string;
  end_date: string;
}

interface ExpenseSummaryProps {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses, categories, budgets }) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(exp => {
    const expenseDate = new Date(exp.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  }).reduce((sum, exp) => sum + exp.amount, 0);

  const budgetRemaining = totalBudget - monthlyExpenses;
  const isOverBudget = budgetRemaining < 0;

  // Category breakdown
  const categoryBreakdown = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category === category.name);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      ...category,
      total,
      count: categoryExpenses.length
    };
  }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} total transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current month spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            {isOverBudget ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(budgetRemaining).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOverBudget ? 'Over budget' : 'Remaining budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Spending by Category
          </CardTitle>
          <CardDescription>
            Your top spending categories this period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryBreakdown.slice(0, 5).map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({category.count} transactions)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${category.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {((category.total / totalExpenses) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
            {categoryBreakdown.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No expenses found. Start by adding your first expense!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;
