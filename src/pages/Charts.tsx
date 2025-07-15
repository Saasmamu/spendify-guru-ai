
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  TrendingUp, 
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SavedAnalysis } from '@/types';
import { getSavedAnalyses } from '@/services/storageService';

// Chart components - using default imports
import CategoryBreakdownChart from '@/components/CategoryBreakdownChart';
import SpendingTrendsChart from '@/components/SpendingTrendsChart';

export default function Charts() {
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('category');

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const savedAnalyses = await getSavedAnalyses();
      setAnalyses(savedAnalyses);
      
      // Auto-select the first analysis if available
      if (savedAnalyses.length > 0 && !selectedAnalysis) {
        setSelectedAnalysis(savedAnalyses[0]);
      }
    } catch (error) {
      console.error('Error loading analyses:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved analyses."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisChange = (analysisId: string) => {
    const analysis = analyses.find(a => a.id === analysisId);
    setSelectedAnalysis(analysis || null);
  };

  const exportChart = (chartType: string) => {
    // Implementation for chart export
    toast({
      title: "Export Started",
      description: `Exporting ${chartType} chart...`
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertDescription>
            No saved analyses found. Please upload and analyze a bank statement first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Charts</h1>
          <p className="text-muted-foreground">
            Visual insights from your financial data
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedAnalysis?.id || ''} onValueChange={handleAnalysisChange}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select an analysis" />
            </SelectTrigger>
            <SelectContent>
              {analyses.map((analysis) => (
                <SelectItem key={analysis.id} value={analysis.id}>
                  {analysis.name} ({new Date(analysis.date).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={() => exportChart(activeTab)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {selectedAnalysis && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="category" className="gap-2">
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2">
              <LineChart className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-2">
              <BarChart className="h-4 w-4" />
              Comparison
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="category" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Categories</CardTitle>
                  <CardDescription>
                    Breakdown of your spending by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdownChart data={selectedAnalysis.categories || []} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Category Summary</CardTitle>
                  <CardDescription>
                    Top spending categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedAnalysis.categories?.slice(0, 5).map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <div className="text-right">
                          <div className="font-semibold">${Math.abs(category.amount).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{category.count} transactions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>
                  Your spending patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpendingTrendsChart data={selectedAnalysis.transactions || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>
                  Monthly comparison of income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      ${selectedAnalysis.totalIncome.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Income</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">
                      ${selectedAnalysis.totalExpense.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Expenses</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>
                  AI-generated insights from your financial data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedAnalysis.insights?.map((insight, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                  {(!selectedAnalysis.insights || selectedAnalysis.insights.length === 0) && (
                    <p className="text-muted-foreground">No insights available for this analysis.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
