
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, TrendingUp, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storageService';
import AnomalyDetection from '@/components/analysis/AnomalyDetection';
import type { Transaction, Anomaly, CategoryData, AnomalyData } from '@/types';

const AdvancedAnalysis: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<{
    transactions: Transaction[];
    anomalies: AnomalyData;
    categories: CategoryData;
    patterns: any[];
  } | null>(null);
  const { toast } = useToast();

  const generateMockData = (): {
    transactions: Transaction[];
    anomalies: AnomalyData;
    categories: CategoryData;
    patterns: any[];
  } => {
    const transactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
      id: `tx_${i}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `Transaction ${i + 1}`,
      amount: Math.random() * 1000 + 100,
      type: Math.random() > 0.3 ? 'debit' : 'credit',
      category: ['food', 'transport', 'entertainment', 'utilities'][Math.floor(Math.random() * 4)]
    }));

    const anomalies: Anomaly[] = Array.from({ length: 5 }, (_, i) => ({
      id: `anomaly_${i}`,
      type: 'Unusual spending pattern',
      description: `Detected unusual transaction pattern ${i + 1}`,
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      detected_at: new Date().toISOString()
    }));

    return {
      transactions,
      anomalies: {
        data: anomalies,
        count: anomalies.length,
        highSeverity: anomalies.filter(a => a.severity === 'high').length
      },
      categories: {
        data: transactions,
        total: transactions.length,
        categorized: transactions.filter(t => t.category).length
      },
      patterns: []
    };
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = generateMockData();
      setAnalysisData(mockData);
      
      toast({
        title: "Analysis Complete",
        description: "Advanced financial analysis has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error performing the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Financial Analysis</h1>
        <p className="text-muted-foreground">
          Deep insights into your financial patterns, anomalies, and trends
        </p>
      </div>

      {!analysisData ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Start Advanced Analysis
            </CardTitle>
            <CardDescription>
              Perform comprehensive analysis of your financial data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready for Advanced Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Click below to start analyzing your financial data for patterns, anomalies, and insights
                </p>
              </div>
              <Button 
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysisData.transactions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {analysisData.categories.categorized} categorized
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysisData.anomalies.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {analysisData.anomalies.highSeverity} high severity
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Analysis Period</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">50 Days</div>
                  <p className="text-xs text-muted-foreground">
                    Recent transaction history
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-6">
            <AnomalyDetection 
              anomalies={analysisData.anomalies}
              transactions={analysisData.transactions}
            />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Patterns</CardTitle>
                <CardDescription>
                  Recurring patterns and trends in your financial behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Pattern analysis coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Predictions</CardTitle>
                <CardDescription>
                  AI-powered predictions based on your spending patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Prediction models coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdvancedAnalysis;
