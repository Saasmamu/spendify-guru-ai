
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useStatement } from '@/contexts/StatementContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, PieChart, ArrowRight, DollarSign, Target, TrendingUp, Wallet, Flag } from 'lucide-react';
import DashboardWidget from '@/components/DashboardWidget';
import BudgetProgressChart from '@/components/BudgetProgressChart';
import GoalProgressChart from '@/components/GoalProgressChart';
import InsightCard from '@/components/InsightCard';
import StatCard from '@/components/StatCard';

const DashboardHome = () => {
  const { user } = useAuth();
  const { statementData } = useStatement();
  const [latestBudget, setLatestBudget] = useState(null);
  const [latestGoal, setLatestGoal] = useState(null);
  const [insights, setInsights] = useState([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    budgetUtilization: 0,
    goalCompletion: 0
  });

  useEffect(() => {
    if (user) {
      fetchLatestBudget();
      fetchLatestGoal();
      fetchRecentInsights();
      calculateStats();
    }
  }, [user]);

  const fetchLatestBudget = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        // Mock spent amount for demo - in real app, calculate from transactions
        const mockSpent = data.amount * (Math.random() * 0.9);
        setLatestBudget({ ...data, spent: mockSpent });
      }
    } catch (error) {
      console.error('Error fetching latest budget:', error);
    }
  };

  const fetchLatestGoal = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setLatestGoal(data);
      }
    } catch (error) {
      console.error('Error fetching latest goal:', error);
    }
  };

  const fetchRecentInsights = async () => {
    // Mock insights for demo - in real app, fetch from saved_analyses
    const mockInsights = [
      { text: "Your food spending has increased by 15% this month compared to last month.", type: "warning" },
      { text: "Great job! You're under budget in the entertainment category by $120.", type: "success" },
      { text: "Consider setting up automatic savings to reach your vacation goal faster.", type: "info" }
    ];
    setInsights(mockInsights);
  };

  const calculateStats = () => {
    // Mock calculations for demo
    setStats({
      totalExpenses: 2450.75,
      budgetUtilization: 68,
      goalCompletion: 42
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your financial overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Monthly Expenses"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Budget Utilization"
          value={`${stats.budgetUtilization}%`}
          icon={<Wallet className="w-5 h-5 text-primary" />}
          trend="neutral"
        />
        <StatCard
          title="Goal Progress"
          value={`${stats.goalCompletion}%`}
          icon={<Target className="w-5 h-5 text-primary" />}
          trend="up"
          trendValue="+12%"
        />
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Budget Widget */}
        <DashboardWidget
          title="Current Budget"
          description="Track your monthly spending"
          icon={<Wallet className="w-5 h-5 text-primary" />}
        >
          <BudgetProgressChart budget={latestBudget} />
          <div className="mt-4 pt-4 border-t">
            <Link to="/dashboard/budgets">
              <Button variant="outline" size="sm" className="w-full">
                View All Budgets
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </DashboardWidget>

        {/* Latest Goal Widget */}
        <DashboardWidget
          title="Active Goal"
          description="Monitor your progress"
          icon={<Flag className="w-5 h-5 text-primary" />}
        >
          <GoalProgressChart goal={latestGoal} />
          <div className="mt-4 pt-4 border-t">
            <Link to="/dashboard/goals">
              <Button variant="outline" size="sm" className="w-full">
                View All Goals
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </DashboardWidget>
      </div>

      {/* AI Insights */}
      <DashboardWidget
        title="AI Insights"
        description="Personalized recommendations based on your spending"
        icon={<TrendingUp className="w-5 h-5 text-primary" />}
      >
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <InsightCard
              key={index}
              insight={insight.text}
              type={insight.type}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Link to="/dashboard/history">
            <Button variant="outline" size="sm" className="w-full">
              View All Insights
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </DashboardWidget>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Statement
            </CardTitle>
            <CardDescription>
              Upload your bank statement to get started with the analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {statementData 
                ? `Your current statement has ${statementData.transactions.length} transactions`
                : "You haven't uploaded any statements yet"}
            </p>
            <Link to="/dashboard/upload">
              <Button className="gap-2">
                <FileText className="w-4 h-4" />
                {statementData ? "Upload Another Statement" : "Upload Statement"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className={cn(
          "border border-border/50 transition-all duration-300",
          statementData ? "hover:border-primary/30" : "opacity-70"
        )}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Analyze Expenses
            </CardTitle>
            <CardDescription>
              View detailed analysis of your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {statementData 
                ? "Your statement is ready for analysis"
                : "Upload a statement first to analyze your expenses"}
            </p>
            <Link to="/dashboard/analyze">
              <Button 
                className="gap-2" 
                disabled={!statementData}
              >
                <PieChart className="w-4 h-4" />
                View Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper to conditionally join class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default DashboardHome;
