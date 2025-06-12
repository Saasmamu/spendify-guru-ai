
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Flag, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalData {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: string;
}

interface GoalProgressChartProps {
  goal: GoalData | null;
}

const GoalProgressChart = ({ goal }: GoalProgressChartProps) => {
  if (!goal) {
    return (
      <div className="text-center py-8">
        <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No active goals found</p>
      </div>
    );
  }

  const progressPercentage = (goal.current_amount / goal.target_amount) * 100;
  const remaining = goal.target_amount - goal.current_amount;
  const daysUntilDeadline = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Generate sample progress data for the chart
  const progressData = [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: goal.current_amount * 0.2 },
    { month: 'Mar', amount: goal.current_amount * 0.5 },
    { month: 'Apr', amount: goal.current_amount * 0.8 },
    { month: 'May', amount: goal.current_amount },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{goal.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Deadline passed'}
          </p>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          goal.status === 'completed' ? "bg-green-100 text-green-700" :
          goal.status === 'urgent' ? "bg-orange-100 text-orange-700" :
          goal.status === 'overdue' ? "bg-red-100 text-red-700" :
          "bg-blue-100 text-blue-700"
        )}>
          {goal.status.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">${goal.current_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Target</span>
            <span className="font-medium">${goal.target_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining</span>
            <span className="font-medium text-blue-600">${remaining.toFixed(2)}</span>
          </div>
          <Progress value={Math.min(progressPercentage, 100)} className="mt-2" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage.toFixed(1)}% completed
          </p>
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Progress']} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressChart;
