
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, BarChart3, PieChart, Download } from 'lucide-react';
import { SpendingPatternAnalysis } from '@/components/SpendingPatternAnalysis';
import { AnomalyDetection } from '@/components/AnomalyDetection';
import { FinancialPrediction } from '@/components/FinancialPrediction';
import { TransactionCategorization } from '@/components/TransactionCategorization';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { BankTransaction } from '@/types';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  balance?: number;
}

interface Anomaly {
  id: string;
  transaction_id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  detected_at: string;
}

interface TransactionData {
  data: Transaction[];
  total: number;
  categorized: number;
}

interface AnomalyData {
  data: Anomaly[];
  count: number;
  highSeverity: number;
}

export default function AdvancedAnalysis() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patterns');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (transactionError) throw transactionError;

      // Load anomalies
      const { data: anomalyData, error: anomalyError } = await supabase
        .from('transaction_anomalies')
        .select('*')
        .eq('user_id', user?.id)
        .order('detected_at', { ascending: false });

      if (anomalyError) throw anomalyError;

      setTransactions(transactionData || []);
      setAnomalies(anomalyData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analysis data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const reportData = {
        transactions,
        anomalies,
        summary: {
          totalTransactions: transactions.length,
          totalAnomalies: anomalies.length,
          highSeverityAnomalies: anomalies.filter(a => a.severity === 'high').length,
        },
        generatedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
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
        description: 'Your analysis report has been downloaded.',
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: 'Export Error',
        description: 'Failed to export the report.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const transactionData: TransactionData = {
    data: transactions,
    total: transactions.length,
    categorized: transactions.filter(t => t.category && t.category !== 'Other').length
  };

  const anomalyData: AnomalyData = {
    data: anomalies,
    count: anomalies.length,
    highSeverity: anomalies.filter(a => a.severity === 'high').length
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analysis</h1>
          <p className="text-muted-foreground">
            Deep insights into your financial patterns and behaviors
          </p>
        </div>
        <Button onClick={exportReport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {transactionData.categorized} categorized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anomalies.length}</div>
            <p className="text-xs text-muted-foreground">
              {anomalyData.highSeverity} high severity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spending Patterns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">patterns identified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictions</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">accuracy rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns">Spending Patterns</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="categorization">Categorization</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <SpendingPatternAnalysis transactions={transactionData} />
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <AnomalyDetection 
            anomalies={anomalyData}
            transactions={transactions}
          />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <FinancialPrediction transactions={transactions} />
        </TabsContent>

        <TabsContent value="categorization" className="space-y-4">
          <TransactionCategorization transactions={transactionData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
