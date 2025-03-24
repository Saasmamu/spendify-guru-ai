
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useStatement } from '@/contexts/StatementContext';
import { FileText, Upload, PieChart, ArrowRight } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const { statementData } = useStatement();
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Manage and analyze your financial data</p>
      </div>
      
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

export default DashboardHome;

// Helper to conditionally join class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
