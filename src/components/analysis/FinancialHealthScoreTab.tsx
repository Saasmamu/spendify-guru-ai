
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  TrendingUp, 
  Shield, 
  Target,
  PiggyBank,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface HealthMetric {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  recommendation: string;
  icon: React.ComponentType<any>;
}

interface FinancialHealthScoreTabProps {
  transactions: any[];
}

const FinancialHealthScoreTab: React.FC<FinancialHealthScoreTabProps> = ({ transactions }) => {
  const overallScore = 78;

  const healthMetrics: HealthMetric[] = [
    {
      name: 'Savings Rate',
      score: 85,
      status: 'excellent',
      description: 'You save 20% of your income monthly',
      recommendation: 'Maintain your excellent savings habit',
      icon: PiggyBank
    },
    {
      name: 'Expense Control',
      score: 72,
      status: 'good',
      description: 'Your expenses are generally well-managed',
      recommendation: 'Consider reducing entertainment spending by 10%',
      icon: Target
    },
    {
      name: 'Emergency Fund',
      score: 65,
      status: 'fair',
      description: 'You have 2 months of expenses saved',
      recommendation: 'Aim for 3-6 months of emergency savings',
      icon: Shield
    },
    {
      name: 'Debt Management',
      score: 90,
      status: 'excellent',
      description: 'Very low debt-to-income ratio',
      recommendation: 'Continue your excellent debt management',
      icon: CreditCard
    },
    {
      name: 'Investment Diversification',
      score: 55,
      status: 'fair',
      description: 'Limited investment portfolio',
      recommendation: 'Consider diversifying your investment portfolio',
      icon: TrendingUp
    },
    {
      name: 'Financial Planning',
      score: 68,
      status: 'good',
      description: 'Good budget adherence',
      recommendation: 'Set more specific financial goals',
      icon: Heart
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
      case 'fair': return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
      case 'poor': return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  };

  const improvements = [
    {
      title: 'Build Emergency Fund',
      impact: '+15 points',
      description: 'Increase your emergency savings to 6 months of expenses',
      priority: 'high'
    },
    {
      title: 'Diversify Investments',
      impact: '+12 points',
      description: 'Add index funds or ETFs to your portfolio',
      priority: 'medium'
    },
    {
      title: 'Reduce Discretionary Spending',
      impact: '+8 points',
      description: 'Cut entertainment and dining expenses by 15%',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <CardTitle>Overall Financial Health</CardTitle>
            <CardDescription>Your comprehensive financial wellness score</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={overallScore}
                text={`${overallScore}`}
                styles={buildStyles({
                  textSize: '20px',
                  pathColor: getScoreColor(overallScore),
                  textColor: getScoreColor(overallScore),
                  trailColor: '#e5e7eb'
                })}
              />
            </div>
            <div className="text-center">
              <h3 className={`text-2xl font-bold ${getStatusColor('good')}`}>Good</h3>
              <p className="text-sm text-muted-foreground">
                You're on the right track! A few improvements can boost your score significantly.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Health Metrics Breakdown</CardTitle>
            <CardDescription>Detailed analysis of your financial health components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium">{metric.name}</h4>
                    </div>
                    {getStatusBadge(metric.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Score</span>
                      <span className={`font-bold ${getStatusColor(metric.status)}`}>
                        {metric.score}/100
                      </span>
                    </div>
                    <Progress value={metric.score} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Improvement Recommendations</CardTitle>
          <CardDescription>
            Targeted actions to improve your financial health score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {improvements.map((improvement, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className={`p-2 rounded-full ${
                  improvement.priority === 'high' ? 'bg-red-100' :
                  improvement.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {improvement.priority === 'high' ? (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{improvement.title}</h4>
                    <Badge variant="outline" className="text-green-600">
                      {improvement.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{improvement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>Your financial health score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: 'January', score: 72, change: '+5' },
                { month: 'February', score: 75, change: '+3' },
                { month: 'March', score: 78, change: '+3' }
              ].map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{month.score}/100</span>
                    <Badge variant="outline" className="text-green-600">
                      {month.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Goals Status</CardTitle>
            <CardDescription>Progress towards your financial objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { goal: 'Emergency Fund', progress: 67, target: '$15,000' },
                { goal: 'Retirement Savings', progress: 45, target: '15% of income' },
                { goal: 'Debt Payoff', progress: 85, target: 'Pay off by 2025' }
              ].map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.goal}</span>
                    <span className="text-sm text-muted-foreground">{goal.target}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="text-right text-sm text-muted-foreground">
                    {goal.progress}% complete
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Health Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-800">Strengths</h4>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Excellent savings rate (20% of income)</li>
                <li>• Very low debt levels</li>
                <li>• Consistent budgeting habits</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">Focus Areas</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Build larger emergency fund</li>
                <li>• Diversify investment portfolio</li>
                <li>• Set specific financial goals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialHealthScoreTab;
