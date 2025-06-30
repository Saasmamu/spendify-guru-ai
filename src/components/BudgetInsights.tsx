
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Lightbulb,
  Target
} from 'lucide-react';
import { BudgetWithCategories } from '@/services/budgetService';
import { formatCurrency } from '@/lib/utils';

interface BudgetInsightsProps {
  budgets: BudgetWithCategories[];
}

interface Insight {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  value?: string;
  trend?: 'up' | 'down' | 'neutral';
  actionable?: boolean;
}

const BudgetInsights: React.FC<BudgetInsightsProps> = ({ budgets }) => {
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    
    if (budgets.length === 0) {
      return [{
        type: 'info',
        title: 'No Budget Data',
        description: 'Create your first budget to start getting personalized insights.',
        actionable: true
      }];
    }

    // Calculate overall metrics
    const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => 
      sum + budget.categories.reduce((catSum, cat) => catSum + cat.spent_amount, 0), 0
    );
    const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

    // Overall budget health
    if (overallPercentage <= 70) {
      insights.push({
        type: 'success',
        title: 'Excellent Budget Control',
        description: 'You\'re doing great! Your spending is well within your budget limits.',
        value: `${overallPercentage.toFixed(1)}% used`,
        trend: 'up'
      });
    } else if (overallPercentage <= 85) {
      insights.push({
        type: 'warning',
        title: 'Moderate Spending',
        description: 'You\'re on track but approaching your budget limits. Monitor closely.',
        value: `${overallPercentage.toFixed(1)}% used`,
        trend: 'neutral'
      });
    } else {
      insights.push({
        type: 'danger',
        title: 'High Budget Usage',
        description: 'You\'re using most of your budget. Consider reviewing your expenses.',
        value: `${overallPercentage.toFixed(1)}% used`,
        trend: 'down',
        actionable: true
      });
    }

    // Find problematic categories
    const overBudgetCategories: any[] = [];
    const nearLimitCategories: any[] = [];
    
    budgets.forEach(budget => {
      budget.categories.forEach(category => {
        if (category.percentage > 100) {
          overBudgetCategories.push({ budget: budget.name, category: category.category, percentage: category.percentage });
        } else if (category.percentage > 80) {
          nearLimitCategories.push({ budget: budget.name, category: category.category, percentage: category.percentage });
        }
      });
    });

    if (overBudgetCategories.length > 0) {
      insights.push({
        type: 'danger',
        title: 'Categories Over Budget',
        description: `${overBudgetCategories.length} categories have exceeded their limits. Immediate action needed.`,
        actionable: true
      });
    }

    if (nearLimitCategories.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Categories Near Limit',
        description: `${nearLimitCategories.length} categories are approaching their budget limits.`,
        actionable: true
      });
    }

    // Savings opportunity
    const wellManagedCategories: any[] = [];
    budgets.forEach(budget => {
      budget.categories.forEach(category => {
        if (category.percentage < 50 && category.allocated_amount > 0) {
          wellManagedCategories.push({
            budget: budget.name,
            category: category.category,
            saved: category.allocated_amount - category.spent_amount
          });
        }
      });
    });

    if (wellManagedCategories.length > 0) {
      const totalSavings = wellManagedCategories.reduce((sum, cat) => sum + cat.saved, 0);
      insights.push({
        type: 'success',
        title: 'Savings Opportunity',
        description: `You're under budget in ${wellManagedCategories.length} categories.`,
        value: `${formatCurrency(totalSavings)} available`,
        trend: 'up'
      });
    }

    // Spending pattern insights
    const categorySpending: Record<string, number> = {};
    budgets.forEach(budget => {
      budget.categories.forEach(category => {
        if (categorySpending[category.category]) {
          categorySpending[category.category] += category.spent_amount;
        } else {
          categorySpending[category.category] = category.spent_amount;
        }
      });
    });

    const topSpendingCategory = Object.entries(categorySpending).reduce((max, [category, amount]) => 
      (amount as number) > (max.amount as number) ? { category, amount } : max
    , { category: '', amount: 0 });

    if (topSpendingCategory.category) {
      const percentage = ((topSpendingCategory.amount as number) / totalSpent) * 100;
      insights.push({
        type: 'info',
        title: 'Top Spending Category',
        description: `${topSpendingCategory.category} accounts for ${percentage.toFixed(1)}% of your total spending.`,
        value: formatCurrency(topSpendingCategory.amount as number)
      });
    }

    return insights;
  };

  const getInsightIcon = (type: string, trend?: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <AlertTriangle className="w-4 h-4" />;
      case 'info': return <Lightbulb className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightVariant = (type: string) => {
    switch (type) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'danger': return 'destructive';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const insights = generateInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Budget Insights
        </CardTitle>
        <CardDescription>
          Smart analysis and recommendations based on your spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Alert key={index} className="relative">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${
                  insight.type === 'success' ? 'text-green-600' :
                  insight.type === 'warning' ? 'text-yellow-600' :
                  insight.type === 'danger' ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {getInsightIcon(insight.type, insight.trend)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      {insight.value && (
                        <Badge variant="outline" className="text-xs">
                          {insight.value}
                        </Badge>
                      )}
                      {insight.actionable && (
                        <Badge variant={getInsightVariant(insight.type)} className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          Action Needed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <AlertDescription>
                    {insight.description}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetInsights;
