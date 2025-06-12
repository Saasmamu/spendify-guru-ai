
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetData {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: string;
}

interface BudgetProgressChartProps {
  budget: BudgetData | null;
}

const BudgetProgressChart = ({ budget }: BudgetProgressChartProps) => {
  if (!budget) {
    return (
      <div className="text-center py-8">
        <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No active budget found</p>
      </div>
    );
  }

  const spentPercentage = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;

  const data = [
    { name: 'Spent', value: budget.spent, color: spentPercentage > 80 ? '#ef4444' : '#3b82f6' },
    { name: 'Remaining', value: remaining > 0 ? remaining : 0, color: '#e5e7eb' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{budget.name}</h3>
          <p className="text-sm text-muted-foreground">{budget.period}</p>
        </div>
        {spentPercentage > 80 && (
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent</span>
            <span className="font-medium">${budget.spent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Budget</span>
            <span className="font-medium">${budget.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining</span>
            <span className={cn(
              "font-medium",
              remaining < 0 ? "text-red-500" : "text-green-500"
            )}>
              ${remaining.toFixed(2)}
            </span>
          </div>
          <Progress value={Math.min(spentPercentage, 100)} className="mt-2" />
          <p className="text-xs text-muted-foreground">
            {spentPercentage.toFixed(1)}% of budget used
          </p>
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgressChart;
