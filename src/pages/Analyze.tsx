
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, BarChart3, PieChart, TrendingUp, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PdfUploader } from '@/components/PdfUploader';
import { AnalysisResults } from '@/components/AnalysisResults';
import { CategoryBreakdownChart } from '@/components/CategoryBreakdownChart';
import { SpendingTrendsChart } from '@/components/SpendingTrendsChart';
import type { BankTransaction, TransactionCategory } from '@/types';

interface AnalysisData {
  transactions: BankTransaction[];
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  categories: TransactionCategory[];
  insights: string[];
}

export default function Analyze() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleAnalysisComplete = useCallback((analysis: AnalysisData) => {
    setAnalysisData(analysis);
    setActiveTab('results');
    toast({
      title: 'Analysis Complete',
      description: 'Your financial analysis is ready to view.',
    });
  }, [toast]);

  const handleAnalysisStart = useCallback(() => {
    setIsAnalyzing(true);
  }, []);

  const exportAnalysis = () => {
    if (!analysisData) return;

    const dataToExport = {
      ...analysisData,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Your analysis has been downloaded.',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyze Documents</h1>
          <p className="text-muted-foreground">
            Upload and analyze your financial documents for insights
          </p>
        </div>
        {analysisData && (
          <Button onClick={exportAnalysis} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Analysis
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2" disabled={!analysisData}>
            <BarChart3 className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2" disabled={!analysisData}>
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PdfUploader
                onAnalysisComplete={handleAnalysisComplete}
                onAnalysisStart={handleAnalysisStart}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {analysisData && (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ${analysisData.totalIncome.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      ${Math.abs(analysisData.totalExpenses).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${
                      analysisData.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${analysisData.netFlow.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analysisData.transactions.length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <CategoryBreakdownChart data={analysisData.categories} />
                <SpendingTrendsChart data={analysisData.transactions} />
              </div>

              <AnalysisResults data={analysisData} />
            </>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {analysisData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Financial Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {isAnalyzing && (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Analyzing your document...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
