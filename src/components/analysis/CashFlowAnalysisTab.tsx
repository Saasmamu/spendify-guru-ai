
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CashFlowAnalysisTabProps {
  transactions: any[];
}

const CashFlowAnalysisTab: React.FC<CashFlowAnalysisTabProps> = ({ transactions }) => {
  const cashFlowData = [
    { month: 'Oct', income: 4200, expenses: 3400, netFlow: 800 },
    { month: 'Nov', income: 4500, expenses: 3600, netFlow: 900 },
    { month: 'Dec', income: 4800, expenses: 4200, netFlow: 600 },
    { month: 'Jan', income: 4200, expenses: 3800, netFlow: 400 },
    { month: 'Feb', income: 4600, expenses: 3500, netFlow: 1100 },
    { month: 'Mar', income: 4400, expenses: 3700, netFlow: 700 }
  ];

  const monthlyBreakdown = [
    { category: 'Housing', amount: 1500, percentage: 38 },
    { category: 'Food', amount: 600, percentage: 15 },
    { category: 'Transportation', amount: 400, percentage: 10 },
    { category: 'Entertainment', amount: 300, percentage: 8 },
    { category: 'Utilities', amount: 250, percentage: 6 },
    { category: 'Others', amount: 950, percentage: 23 }
  ];

  const predictions = [
    {
      period: 'Next Month',
      income: 4500,
      expenses: 3600,
      netFlow: 900,
      confidence: 85
    },
    {
      period: 'Next Quarter',
      income: 13200,
      expenses: 10800,
      netFlow: 2400,
      confidence: 72
    },
    {
      period: 'Next 6 Months',
      income: 26400,
      expenses: 21600,
      netFlow: 4800,
      confidence: 65
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,240</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$4,400</div>
            <p className="text-xs text-muted-foreground">
              Average this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$3,700</div>
            <p className="text-xs text-muted-foreground">
              Average this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$700</div>
            <p className="text-xs text-muted-foreground">
              Monthly average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Trend</CardTitle>
            <CardDescription>6-month income vs expenses overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="netFlow" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Net Flow"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Breakdown</CardTitle>
            <CardDescription>Current month spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm">${item.amount}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {item.percentage}% of total expenses
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Predictions</CardTitle>
          <CardDescription>
            AI-powered forecasts based on your spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{prediction.period}</h4>
                  <Badge variant="outline">
                    {prediction.confidence}% confidence
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Income:</span>
                    <span className="font-medium text-green-600">${prediction.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Expenses:</span>
                    <span className="font-medium text-red-600">${prediction.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Net Cash Flow:</span>
                    <span className={`font-bold ${prediction.netFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${prediction.netFlow.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Progress value={prediction.confidence} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Positive Trend</h4>
              </div>
              <p className="text-sm text-green-700">
                Your income has increased by 8% over the last 3 months while expenses remained stable.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">Seasonal Pattern</h4>
              </div>
              <p className="text-sm text-blue-700">
                Your expenses typically increase by 15% during holiday months (November-December).
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <PieChart className="h-5 w-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-800">Budget Allocation</h4>
              </div>
              <p className="text-sm text-yellow-700">
                Consider reducing entertainment expenses by 20% to increase your savings rate.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-purple-800">Emergency Fund</h4>
              </div>
              <p className="text-sm text-purple-700">
                Based on current expenses, aim for an emergency fund of $11,100 (3 months of expenses).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlowAnalysisTab;
