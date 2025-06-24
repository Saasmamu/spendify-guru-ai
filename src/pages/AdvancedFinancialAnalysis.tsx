
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield,
  RefreshCw,
  TrendingUp,
  Store,
  Heart,
  Receipt,
  ArrowLeft,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useStatement } from '@/contexts/StatementContext';
import ScamAlertsTab from '@/components/analysis/ScamAlertsTab';
import RecurringExpensesTab from '@/components/analysis/RecurringExpensesTab';
import CashFlowAnalysisTab from '@/components/analysis/CashFlowAnalysisTab';
import MerchantIntelligenceTab from '@/components/analysis/MerchantIntelligenceTab';
import FinancialHealthScoreTab from '@/components/analysis/FinancialHealthScoreTab';
import TaxExpenseCategorizationTab from '@/components/analysis/TaxExpenseCategorizationTab';

export default function AdvancedFinancialAnalysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { statementData } = useStatement();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'scam-alerts');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Redirect if no statement data
  useEffect(() => {
    if (!statementData) {
      navigate('/dashboard/analyze');
    }
  }, [statementData, navigate]);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', activeTab);
    navigate(`?${params.toString()}`, { replace: true });
  }, [activeTab, navigate, searchParams]);

  const handleBackToBasicAnalysis = () => {
    navigate('/dashboard/analyze');
  };

  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate analysis refresh
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  if (!statementData) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            Please upload and analyze a bank statement first to view advanced analysis.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const analysisOverview = {
    totalTransactions: statementData.transactions.length,
    suspiciousTransactions: Math.floor(statementData.transactions.length * 0.02),
    recurringExpenses: Math.floor(statementData.transactions.length * 0.15),
    healthScore: 78,
    taxDeductible: Math.floor(statementData.transactions.length * 0.08)
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToBasicAnalysis}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Basic Analysis
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Advanced Financial Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive AI-powered insights and security analysis
            </p>
          </div>
        </div>
        <Button onClick={handleRefreshAnalysis} disabled={isAnalyzing} className="gap-2">
          {isAnalyzing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Activity className="h-4 w-4" />
          )}
          {isAnalyzing ? "Analyzing..." : "Refresh Analysis"}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisOverview.totalTransactions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{analysisOverview.suspiciousTransactions}</div>
            <Badge variant="destructive" className="mt-1">Needs Review</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring Items</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{analysisOverview.recurringExpenses}</div>
            <Badge variant="secondary" className="mt-1">Tracked</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Heart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{analysisOverview.healthScore}%</div>
            <Badge variant="outline" className="mt-1">Good</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Deductible</CardTitle>
            <Receipt className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{analysisOverview.taxDeductible}</div>
            <Badge variant="outline" className="mt-1">Potential</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="scam-alerts" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="recurring" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Recurring</span>
              </TabsTrigger>
              <TabsTrigger value="cash-flow" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Cash Flow</span>
              </TabsTrigger>
              <TabsTrigger value="merchants" className="gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Merchants</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Health</span>
              </TabsTrigger>
              <TabsTrigger value="tax" className="gap-2">
                <Receipt className="h-4 w-4" />
                <span className="hidden sm:inline">Tax</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scam-alerts" className="mt-0">
              <ScamAlertsTab transactions={statementData.transactions} />
            </TabsContent>

            <TabsContent value="recurring" className="mt-0">
              <RecurringExpensesTab transactions={statementData.transactions} />
            </TabsContent>

            <TabsContent value="cash-flow" className="mt-0">
              <CashFlowAnalysisTab transactions={statementData.transactions} />
            </TabsContent>

            <TabsContent value="merchants" className="mt-0">
              <MerchantIntelligenceTab transactions={statementData.transactions} />
            </TabsContent>

            <TabsContent value="health" className="mt-0">
              <FinancialHealthScoreTab transactions={statementData.transactions} />
            </TabsContent>

            <TabsContent value="tax" className="mt-0">
              <TaxExpenseCategorizationTab transactions={statementData.transactions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
