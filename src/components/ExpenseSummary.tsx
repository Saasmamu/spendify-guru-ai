
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

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
  // Calculate category spending
  const categorySpending = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category === category.name);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budget = budgets.find(b => b.category_id === category.id);
    
    return {
      ...category,
      spent: total,
      budget: budget?.amount || 0,
      transactions: categoryExpenses.length,
      percentage: budget?.amount ? (total / budget.amount) * 100 : 0
    };
  });

  // Recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5);

  // Calculate trends
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  }).reduce((sum, exp) => sum + exp.amount, 0);

  const lastMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === lastMonth && expDate.getFullYear() === lastMonthYear;
  }).reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyChange = lastMonthExpenses > 0 ? 
    ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Monthly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Comparison</CardTitle>
          <CardDescription>Current month vs. last month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${currentMonthExpenses.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">This month</p>
            </div>
            <div className="flex items-center gap-2">
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              <span className={`text-sm font-medium ${
                monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                {Math.abs(monthlyChange).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              Last month: ${lastMonthExpenses.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Spending by category with budget comparison</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categorySpending.map(category => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary">{category.transactions}</Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold">${category.spent.toFixed(2)}</p>
                  {category.budget > 0 && (
                    <p className="text-sm text-muted-foreground">
                      of ${category.budget.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              {category.budget > 0 && (
                <div className="space-y-1">
                  <Progress 
                    value={Math.min(category.percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {category.percentage.toFixed(1)}% of budget
                    </span>
                    {category.percentage > 90 ? (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Over budget</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        <span>On track</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: categories.find(c => c.name === expense.category)?.color || '#gray' 
                      }}
                    />
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No expenses recorded yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;
