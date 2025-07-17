
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { BankStatementUpload } from '@/components/BankStatementUpload';
import { SavedAnalyses } from '@/components/SavedAnalyses';
import { useToast } from '@/hooks/use-toast';
import { SavedAnalysis } from '@/types';

export default function Analyze() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<SavedAnalysis | null>(null);

  const handleAnalysisComplete = useCallback((analysis: any) => {
    setCurrentAnalysis(analysis);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete!",
      description: "Your bank statement has been successfully analyzed.",
    });
    
    // Switch to results tab
    setActiveTab('results');
  }, [toast]);

  const handleLoadAnalysis = useCallback((analysis: SavedAnalysis) => {
    setCurrentAnalysis(analysis);
    setActiveTab('results');
    
    toast({
      title: "Analysis Loaded",
      description: `Loaded analysis: ${analysis.name}`,
    });
  }, [toast]);

  const handleStartAnalysis = useCallback(() => {
    setIsAnalyzing(true);
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Financial Analysis</h1>
        <p className="text-muted-foreground">
          Upload your bank statements and get AI-powered insights into your financial patterns
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload & Analyze
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Saved Analyses
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Step 1</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Upload</div>
                <p className="text-xs text-muted-foreground">
                  Upload your bank statement PDF or CSV file
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Step 2</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Process</div>
                <p className="text-xs text-muted-foreground">
                  AI analyzes your transactions and spending patterns
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Step 3</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Insights</div>
                <p className="text-xs text-muted-foreground">
                  Get detailed insights and recommendations
                </p>
              </CardContent>
            </Card>
          </div>

          {isAnalyzing && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your bank statement is being analyzed. This may take a few moments...
              </AlertDescription>
            </Alert>
          )}

          <BankStatementUpload 
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisStart={handleStartAnalysis}
          />
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <SavedAnalyses onLoadAnalysis={handleLoadAnalysis} />
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {currentAnalysis ? (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Analysis Results: {currentAnalysis.name}
                  </CardTitle>
                  <CardDescription>
                    Analysis completed on {new Date(currentAnalysis.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Total Income</div>
                      <div className="text-2xl font-bold text-green-500">
                        ${currentAnalysis.totalIncome.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Total Expenses</div>
                      <div className="text-2xl font-bold text-red-500">
                        ${currentAnalysis.totalExpense.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Net Balance</div>
                      <div className={`text-2xl font-bold ${(currentAnalysis.totalIncome - currentAnalysis.totalExpense) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${(currentAnalysis.totalIncome - currentAnalysis.totalExpense).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Category Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentAnalysis.categories?.slice(0, 5).map((category, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{category.category}</span>
                          <span className="font-medium">${Math.abs(category.amount).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Transaction Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Transactions</span>
                        <span className="font-medium">{currentAnalysis.transactions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Categories</span>
                        <span className="font-medium">{currentAnalysis.categories?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patterns Found</span>
                        <span className="font-medium">{currentAnalysis.patterns?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Anomalies</span>
                        <span className="font-medium">{currentAnalysis.anomalies?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => window.location.href = '/charts'}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Charts
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard/advanced-analytics'}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Advanced Analysis
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Upload a new bank statement or select a saved analysis to view results.
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => setActiveTab('upload')}>
                    Upload New Statement
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('saved')}>
                    View Saved Analyses
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
