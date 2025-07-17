
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, Target, PiggyBank, CreditCard, Repeat, Shield, Brain } from 'lucide-react';

export default function AdvancedAnalysis() {
  const [selectedTab, setSelectedTab] = useState('spending-patterns');

  // Mock data for demonstration
  const spendingPatterns = [
    { name: 'Coffee Purchases', frequency: 'Daily', amount: 4.50, confidence: 95 },
    { name: 'Grocery Shopping', frequency: 'Weekly', amount: 85.00, confidence: 88 },
    { name: 'Netflix Subscription', frequency: 'Monthly', amount: 15.99, confidence: 100 },
  ];

  const anomalies = [
    { description: 'Unusual large purchase at electronics store', amount: 1200, risk: 'medium' },
    { description: 'Multiple small transactions in short period', amount: 45, risk: 'low' },
    { description: 'Transaction at unusual location', amount: 150, risk: 'high' },
  ];

  const predictions = [
    { category: 'Groceries', predicted: 340, actual: 320, confidence: 85 },
    { category: 'Utilities', predicted: 150, actual: null, confidence: 92 },
    { category: 'Entertainment', predicted: 120, actual: 95, confidence: 75 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Advanced Financial Analysis</h1>
          <p className="text-muted-foreground">
            Deep insights into your financial patterns and behaviors
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="spending-patterns" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="categorization" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spending-patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Recurring Spending Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spendingPatterns.map((pattern, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{pattern.name}</h3>
                        <Badge variant="outline">{pattern.frequency}</Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Average Amount: ${pattern.amount}
                        </span>
                        <span className="text-sm font-medium">
                          {pattern.confidence}% confidence
                        </span>
                      </div>
                      <Progress value={pattern.confidence} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pattern Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <p className="text-sm">
                        Your coffee spending is highly predictable - consider a monthly coffee subscription to save money.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <p className="text-sm">
                        Grocery shopping patterns are consistent, showing good budgeting habits.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                      <p className="text-sm">
                        Subscription services are automatically renewed - review for unused services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-1">Optimize Subscriptions</h4>
                      <p className="text-sm text-green-700">
                        Bundle streaming services or switch to annual billing for 15% savings.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-1">Bulk Purchases</h4>
                      <p className="text-sm text-blue-700">
                        Consider buying non-perishables in bulk during sales to reduce weekly grocery costs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Transaction Anomalies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {anomalies.map((anomaly, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">${anomaly.amount}</span>
                        <Badge 
                          variant={
                            anomaly.risk === 'high' ? 'destructive' : 
                            anomaly.risk === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {anomaly.risk} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {anomaly.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Fraud Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-green-800">Real-time Monitoring</h4>
                      <p className="text-sm text-green-700">Active fraud detection enabled</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-blue-800">Location Tracking</h4>
                      <p className="text-sm text-blue-700">Unusual location alerts</p>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Enabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Spending Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{prediction.category}</h3>
                        <Badge variant="outline">{prediction.confidence}% confidence</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Predicted: ${prediction.predicted}</span>
                          {prediction.actual && (
                            <span className={`font-medium ${
                              prediction.actual <= prediction.predicted ? 'text-green-600' : 'text-red-600'
                            }`}>
                              Actual: ${prediction.actual}
                            </span>
                          )}
                        </div>
                        <Progress value={prediction.confidence} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accuracy Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Overall Accuracy</span>
                      <span className="font-bold text-green-600">84%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Predictions This Month</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Correct Predictions</span>
                      <span className="font-bold">10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prediction Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <p className="text-sm">
                        Grocery predictions are highly accurate based on your consistent shopping patterns.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                      <p className="text-sm">
                        Entertainment spending shows seasonal variations that may affect predictions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categorization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Smart Categorization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Auto-Categorization Accuracy</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Correctly Categorized</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Most Accurate Categories</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subscriptions</span>
                          <span className="text-green-600">100%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Groceries</span>
                          <span className="text-green-600">98%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Utilities</span>
                          <span className="text-green-600">96%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Needs Review</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Miscellaneous</span>
                          <span className="text-yellow-600">78%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cash Withdrawals</span>
                          <span className="text-yellow-600">65%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Online Purchases</span>
                          <span className="text-yellow-600">82%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
