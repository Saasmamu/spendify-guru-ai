
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BudgetWithCategories } from '@/services/budgetService';
import { formatCurrency } from '@/lib/utils';

interface BudgetSpendingChartProps {
  budgets: BudgetWithCategories[];
  selectedBudget: string;
  onBudgetChange: (budgetId: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

const BudgetSpendingChart: React.FC<BudgetSpendingChartProps> = ({
  budgets,
  selectedBudget,
  onBudgetChange
}) => {
  const prepareChartData = () => {
    const filteredBudgets = selectedBudget === 'all' 
      ? budgets 
      : budgets.filter(b => b.id === selectedBudget);

    const categoryData = {};
    const budgetComparisonData = [];

    filteredBudgets.forEach(budget => {
      const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent_amount, 0);
      
      budgetComparisonData.push({
        name: budget.name.length > 15 ? budget.name.substring(0, 15) + '...' : budget.name,
        budgeted: budget.amount,
        spent: totalSpent,
        remaining: Math.max(0, budget.amount - totalSpent),
        overSpent: Math.max(0, totalSpent - budget.amount)
      });

      budget.categories.forEach(category => {
        if (categoryData[category.category]) {
          categoryData[category.category] += category.spent_amount;
        } else {
          categoryData[category.category] = category.spent_amount;
        }
      });
    });

    const pieData = Object.entries(categoryData)
      .map(([name, value]) => ({
        name,
        value: value as number
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    return { pieData, budgetComparisonData };
  };

  const { pieData, budgetComparisonData } = prepareChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.color }}>
            Amount: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            {((data.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Budget Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Spending Analysis</h3>
        <Select value={selectedBudget} onValueChange={onBudgetChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Budgets</SelectItem>
            {budgets.map(budget => (
              <SelectItem key={budget.id} value={budget.id}>
                {budget.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              Distribution of expenses across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        percent > 5 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No spending data available
              </div>
            )}
            
            {/* Category Summary */}
            {pieData.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm">Top Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {pieData.slice(0, 3).map((category, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {category.name}: {formatCurrency(category.value)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget vs Actual Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
            <CardDescription>
              Compare planned budget with actual spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            {budgetComparisonData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis tickFormatter={(value) => `$${value}`} fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="budgeted" fill="#8884d8" name="Budget" />
                    <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                    <Bar dataKey="overSpent" fill="#ff6b6b" name="Over Budget" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No budget data available
              </div>
            )}

            {/* Budget Summary */}
            {budgetComparisonData.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm">Budget Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Budgeted:</span>
                    <div className="font-medium">
                      {formatCurrency(budgetComparisonData.reduce((sum, item) => sum + item.budgeted, 0))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Spent:</span>
                    <div className="font-medium">
                      {formatCurrency(budgetComparisonData.reduce((sum, item) => sum + item.spent, 0))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetSpendingChart;
