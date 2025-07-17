
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import CategoryBreakdownChart from '@/components/CategoryBreakdownChart';
import SpendingTrendsChart from '@/components/SpendingTrendsChart';
import { Transaction, TransactionCategory } from '@/types';

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<{
    transactions: Transaction[];
    categories: TransactionCategory[];
    summary: {
      totalIncome: number;
      totalExpenses: number;
      netFlow: number;
      transactionCount: number;
    };
  } | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError('');

    try {
      // Simulate file processing
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis results
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          date: '2024-01-15',
          description: 'Salary Payment',
          amount: 3500,
          type: 'credit',
          category: 'Income',
          balance: 3500
        },
        {
          id: '2',
          date: '2024-01-16',
          description: 'Grocery Store',
          amount: -85.50,
          type: 'debit',
          category: 'Food & Dining',
          balance: 3414.50
        },
        {
          id: '3',
          date: '2024-01-17',
          description: 'Gas Station',
          amount: -45.00,
          type: 'debit',
          category: 'Transportation',
          balance: 3369.50
        }
      ];

      const mockCategories: TransactionCategory[] = [
        {
          name: 'Income',
          amount: 3500,
          count: 1,
          percentage: 100,
          color: '#10B981',
          transactions: [mockTransactions[0]]
        },
        {
          name: 'Food & Dining',
          amount: 85.50,
          count: 1,
          percentage: 65.4,
          color: '#F59E0B',
          transactions: [mockTransactions[1]]
        },
        {
          name: 'Transportation',
          amount: 45.00,
          count: 1,
          percentage: 34.6,
          color: '#EF4444',
          transactions: [mockTransactions[2]]
        }
      ];

      setProgress(100);
      setAnalysisResults({
        transactions: mockTransactions,
        categories: mockCategories,
        summary: {
          totalIncome: 3500,
          totalExpenses: 130.50,
          netFlow: 3369.50,
          transactionCount: 3
        }
      });
    } catch (err) {
      setError('Failed to analyze the file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Financial Document Analyzer</h1>
          <p className="text-muted-foreground">
            Upload your bank statements or financial documents for intelligent analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>

            {file && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing document...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleAnalyze} 
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Analyze Document'}
            </Button>
          </CardContent>
        </Card>

        {analysisResults && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${analysisResults.summary.totalIncome.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      ${analysisResults.summary.totalExpenses.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Expenses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${analysisResults.summary.netFlow.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Net Flow</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {analysisResults.summary.transactionCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Transactions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryBreakdownChart categories={analysisResults.categories} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Spending Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingTrendsChart transactions={analysisResults.transactions} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
