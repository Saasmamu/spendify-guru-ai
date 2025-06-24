
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RotateCcw, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDate: string;
  category: string;
  status: 'active' | 'cancelled' | 'paused';
  confidence: number;
}

interface RecurringExpensesTabProps {
  transactions: any[];
}

const RecurringExpensesTab: React.FC<RecurringExpensesTabProps> = ({ transactions }) => {
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');

  const recurringExpenses: RecurringExpense[] = [
    {
      id: '1',
      name: 'Netflix Subscription',
      amount: 15.99,
      frequency: 'monthly',
      nextDate: '2024-02-15',
      category: 'Entertainment',
      status: 'active',
      confidence: 95
    },
    {
      id: '2',
      name: 'Spotify Premium',
      amount: 9.99,
      frequency: 'monthly',
      nextDate: '2024-02-10',
      category: 'Entertainment',
      status: 'active',
      confidence: 98
    },
    {
      id: '3',
      name: 'Gym Membership',
      amount: 49.99,
      frequency: 'monthly',
      nextDate: '2024-02-01',
      category: 'Health & Fitness',
      status: 'active',
      confidence: 92
    },
    {
      id: '4',
      name: 'Cloud Storage',
      amount: 5.99,
      frequency: 'monthly',
      nextDate: '2024-02-20',
      category: 'Technology',
      status: 'active',
      confidence: 89
    }
  ];

  const totalMonthlyRecurring = recurringExpenses
    .filter(expense => expense.frequency === 'monthly' && expense.status === 'active')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'cancelled': return 'destructive';
      case 'paused': return 'secondary';
      default: return 'secondary';
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-green-100 text-green-800',
      quarterly: 'bg-yellow-100 text-yellow-800',
      yearly: 'bg-purple-100 text-purple-800'
    };
    return colors[frequency as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredExpenses = selectedFrequency === 'all' 
    ? recurringExpenses 
    : recurringExpenses.filter(expense => expense.frequency === selectedFrequency);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recurringExpenses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active recurring payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyRecurring.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Per month recurring costs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalMonthlyRecurring * 12).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Annual subscription cost
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">$156</div>
            <p className="text-xs text-muted-foreground">
              Unused subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recurring Expenses</CardTitle>
              <CardDescription>
                AI-detected subscription and recurring payments
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {['all', 'monthly', 'quarterly', 'yearly'].map((freq) => (
                <Button
                  key={freq}
                  variant={selectedFrequency === freq ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFrequency(freq)}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{expense.name}</h4>
                    <Badge className={getFrequencyBadge(expense.frequency)}>
                      {expense.frequency}
                    </Badge>
                    <Badge variant={getStatusColor(expense.status) as any}>
                      {expense.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>${expense.amount}</span>
                    <span>•</span>
                    <span>Next: {expense.nextDate}</span>
                    <span>•</span>
                    <span>{expense.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">AI Confidence:</span>
                    <Progress value={expense.confidence} className="w-20 h-2" />
                    <span className="text-xs">{expense.confidence}%</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Duplicate Entertainment Subscriptions</h4>
                <p className="text-sm text-yellow-700">
                  You have multiple streaming services. Consider canceling one to save $15.99/month.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Annual Payment Savings</h4>
                <p className="text-sm text-green-700">
                  Switch to annual billing for eligible subscriptions to save up to 20%.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringExpensesTab;
