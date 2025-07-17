import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Pie,
  BarChart3,
  Download,
  Eye,
  Trash2,
  Zap,
  Brain,
  Target,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BankTransaction, ProcessedStatement } from '@/types';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface AnalysisResult {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  incomeVsExpense: number;
  topCategories: { category: string; amount: number }[];
  insights: string[];
}

const Analyze = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { activePlan, isTrialActive } = useSubscription();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ProcessedStatement | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [demoMode, setDemoMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDemoMode = () => {
    setDemoMode(true);
    setActiveTab('results');
  };

  const mockTransactions: BankTransaction[] = [
    {
      id: "1",
      date: "2024-01-15",
      description: "GROCERY STORE PURCHASE",
      amount: -85.32,
      type: "debit",
      category: "Groceries"
    },
    {
      id: "2", 
      date: "2024-01-14",
      description: "SALARY DEPOSIT",
      amount: 3200.00,
      type: "credit",
      category: "Income"
    },
    {
      id: "3",
      date: "2024-01-13", 
      description: "UTILITY BILL PAYMENT",
      amount: -120.50,
      type: "debit",
      category: "Utilities"
    },
    {
      id: "4",
      date: "2024-01-12",
      description: "RESTAURANT CHARGE",
      amount: -45.75,
      type: "debit", 
      category: "Dining"
    },
    {
      id: "5",
      date: "2024-01-11",
      description: "GAS STATION PURCHASE",
      amount: -52.20,
      type: "debit",
      category: "Transportation"
    }
  ];

  const handleAnalyze = async () => {
    if (!selectedFile && !demoMode) {
      toast({
        title: "No file selected",
        description: "Please select a bank statement file to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Process the statement (mock data for demo)
      const processedData: ProcessedStatement = {
        transactions: mockTransactions,
        totalIncome: 3200.00,
        totalExpense: 303.77,
        balance: 2896.23,
        categories: [
          { category: "Income", amount: 3200.00, count: 1 },
          { category: "Groceries", amount: 85.32, count: 1 },
          { category: "Utilities", amount: 120.50, count: 1 },
          { category: "Dining", amount: 45.75, count: 1 },
          { category: "Transportation", amount: 52.20, count: 1 }
        ],
        insights: [
          "Your monthly income covers expenses with a healthy 90% surplus",
          "Largest expense category is Utilities at $120.50",
          "Consider setting up automatic savings with your surplus"
        ]
      };

      setAnalysisResult(processedData);
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete!",
        description: "Your bank statement has been successfully analyzed.",
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your statement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!analysisResult) {
      toast({
        title: "No analysis to save",
        description: "Please analyze a statement before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { saveAnalysis } = await import('@/services/storageService');
      await saveAnalysis(`Analysis ${new Date().toLocaleDateString()}`, analysisResult);
      toast({
        title: "Analysis Saved!",
        description: "Your analysis has been successfully saved.",
      });
    } catch (error) {
      console.error('Save analysis error:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 md:space-x-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statement Analyzer</h1>
          <p className="text-muted-foreground">
            Upload your bank statement to get detailed insights into your finances
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={handleDemoMode}>
            <Zap className="mr-2 h-4 w-4" />
            Demo Mode
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Select File
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="upload">
            <FileText className="mr-2 h-4 w-4" />
            Upload Statement
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResult && !demoMode}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analysis Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Bank Statement</CardTitle>
              <CardDescription>
                We support PDF, CSV, and TXT formats.
              </CardDescription>
            </CardHeader>
            <CardContent
              className="flex flex-col items-center justify-center p-8 border-dashed border-2 rounded-lg cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedFile ? (
                <>
                  <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
                  <p className="text-lg font-semibold">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ready to analyze
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Or click to select a file
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {selectedFile && (
            <Card>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Selected file: {selectedFile.name}
                </p>
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Statement
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {isAnalyzing && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Progress</CardTitle>
                <CardDescription>
                  Analyzing your bank statement to extract key insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{analysisProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={analysisProgress} />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          {analysisResult && (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ${analysisResult.totalIncome.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      ${analysisResult.totalExpense.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${analysisResult.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${analysisResult.balance.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analysisResult.transactions.length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Details</CardTitle>
                  <CardDescription>
                    All transactions found in your statement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.date} • {transaction.category}
                          </div>
                        </div>
                        <div className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analyze;
