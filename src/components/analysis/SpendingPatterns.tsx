import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, DollarSign, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SpendingPattern {
  id: string;
  name: string;
  type: 'recurring' | 'seasonal' | 'trend';
  frequency: string;
  amount: number;
  confidence: number;
  description: string;
  transactions: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface SpendingPatternsProps {
  patterns: {
    data: any[];
    count: number;
    recurring: number;
  };
  transactions: any[];
}

const SpendingPatterns: React.FC<SpendingPatternsProps> = ({ patterns, transactions }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock pattern data - in real implementation, this would come from AI analysis
  const mockPatterns: SpendingPattern[] = [
    {
      id: '1',
      name: 'Monthly Coffee Subscriptions',
      type: 'recurring',
      frequency: 'Monthly',
      amount: 45.99,
      confidence: 95,
      description: 'Regular coffee subscription payments every 15th of the month',
      transactions: 12,
      trend: 'stable'
    },
    {
      id: '2',
      name: 'Weekend Dining',
      type: 'seasonal',
      frequency: 'Weekly',
      amount: 127.50,
      confidence: 89,
      description: 'Increased restaurant spending on weekends',
      transactions: 48,
      trend: 'increasing'
    }
  ];

  const trendData = [
    { month: 'Oct', spending: 3200 },
    { month: 'Nov', spending: 3400 },
    { month: 'Dec', spending: 4100 },
    { month: 'Jan', spending: 3800 },
    { month: 'Feb', spending: 3600 },
    { month: 'Mar', spending: 3900 }
  ];

  const categoryBreakdown = [
    { category: 'Groceries', amount: 850, percentage: 28 },
    { category: 'Dining', amount: 600, percentage: 20 },
    { category: 'Transportation', amount: 450, percentage: 15 },
    { category: 'Entertainment', amount: 300, percentage: 10 },
    { category: 'Utilities', amount: 250, percentage: 8 },
    { category: 'Others', amount: 550, percentage: 19 }
  ];

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'recurring': return <RotateCcw className="h-4 w-4" />;
      case 'seasonal': return <Calendar className="h-4 w-4" />;
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-500';
      case 'decreasing': return 'text-green-500';
      case 'stable': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patterns Found</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.count}</div>
            <p className="text-xs text-muted-foreground">
              AI-detected patterns
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring Expenses</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patterns.recurring}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly recurring
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seasonal Patterns</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPatterns.filter(p => p.type === 'seasonal').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Seasonal variations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockPatterns.reduce((sum, p) => sum + p.confidence, 0) / mockPatterns.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Pattern accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Detected Spending Patterns</CardTitle>
              <CardDescription>
                AI-identified patterns in your transaction history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patterns.data.map((pattern: any) => (
                <div key={pattern.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getPatternIcon(pattern.type)}
                      <h4 className="font-medium">{pattern.name}</h4>
                      <Badge variant="outline">{pattern.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>${pattern.amount}</span>
                      <span>•</span>
                      <span>{pattern.frequency}</span>
                      <span>•</span>
                      <span>{pattern.transactions} transactions</span>
                      <span>•</span>
                      <span className={getTrendColor(pattern.trend)}>{pattern.trend}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pattern.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Confidence:</span>
                      <Progress value={pattern.confidence} className="w-20 h-2" />
                      <span className="text-xs">{pattern.confidence}%</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends</CardTitle>
              <CardDescription>Monthly spending patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Spending"]} />
                    <Line type="monotone" dataKey="spending" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Spending distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm">${item.amount}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">
                      {item.percentage}% of total spending
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpendingPatterns;
