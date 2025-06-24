
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Store, 
  TrendingUp, 
  MapPin, 
  Clock,
  Star,
  AlertTriangle,
  ShoppingBag
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Merchant {
  id: string;
  name: string;
  category: string;
  totalSpent: number;
  frequency: number;
  lastVisit: string;
  averageAmount: number;
  rating: number;
  location: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
}

interface MerchantIntelligenceTabProps {
  transactions: any[];
}

const MerchantIntelligenceTab: React.FC<MerchantIntelligenceTabProps> = ({ transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const merchants: Merchant[] = [
    {
      id: '1',
      name: 'Amazon',
      category: 'Shopping',
      totalSpent: 1250.00,
      frequency: 24,
      lastVisit: '2024-01-20',
      averageAmount: 52.08,
      rating: 4.5,
      location: 'Online',
      trend: 'increasing',
      riskLevel: 'low'
    },
    {
      id: '2',
      name: 'Whole Foods',
      category: 'Groceries',
      totalSpent: 980.50,
      frequency: 18,
      lastVisit: '2024-01-22',
      averageAmount: 54.47,
      rating: 4.2,
      location: 'Local',
      trend: 'stable',
      riskLevel: 'low'
    },
    {
      id: '3',
      name: 'Gas Station XYZ',
      category: 'Transportation',
      totalSpent: 650.00,
      frequency: 16,
      lastVisit: '2024-01-21',
      averageAmount: 40.63,
      rating: 3.8,
      location: 'Local',
      trend: 'decreasing',
      riskLevel: 'low'
    },
    {
      id: '4',
      name: 'Unknown Online Store',
      category: 'Shopping',
      totalSpent: 299.99,
      frequency: 1,
      lastVisit: '2024-01-15',
      averageAmount: 299.99,
      rating: 0,
      location: 'Online',
      trend: 'stable',
      riskLevel: 'high'
    }
  ];

  const categorySpending = [
    { category: 'Shopping', amount: 1549.99, merchants: 8 },
    { category: 'Groceries', amount: 980.50, merchants: 3 },
    { category: 'Transportation', amount: 650.00, merchants: 4 },
    { category: 'Entertainment', amount: 420.00, merchants: 6 },
    { category: 'Dining', amount: 380.50, merchants: 12 },
    { category: 'Utilities', amount: 250.00, merchants: 3 }
  ];

  const spendingTrends = [
    { month: 'Oct', amount: 3200 },
    { month: 'Nov', amount: 3600 },
    { month: 'Dec', amount: 4200 },
    { month: 'Jan', amount: 3800 },
    { month: 'Feb', amount: 4100 },
    { month: 'Mar', amount: 3900 }
  ];

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-500 rotate-90" />;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <Badge variant="destructive">High Risk</Badge>;
      case 'medium': return <Badge variant="default">Medium Risk</Badge>;
      default: return <Badge variant="secondary">Low Risk</Badge>;
    }
  };

  const filteredMerchants = selectedCategory === 'all' 
    ? merchants 
    : merchants.filter(merchant => merchant.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchants.length}</div>
            <p className="text-xs text-muted-foreground">
              Active this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Merchant</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Amazon</div>
            <p className="text-xs text-muted-foreground">
              $1,250 spent this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">1</div>
            <p className="text-xs text-muted-foreground">
              Merchant needs review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$61.79</div>
            <p className="text-xs text-muted-foreground">
              Across all merchants
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Total amount spent per merchant category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ category, amount }) => `${category}: $${amount}`}
                >
                  {categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
            <CardDescription>Total merchant spending over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Merchant Intelligence</CardTitle>
              <CardDescription>
                Detailed analysis of your spending patterns by merchant
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {['all', 'shopping', 'groceries', 'transportation'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMerchants.map((merchant) => (
              <div key={merchant.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{merchant.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{merchant.category}</Badge>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span>{merchant.location}</span>
                        {merchant.rating > 0 && (
                          <>
                            <span>•</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{merchant.rating}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(merchant.trend)}
                    {getRiskBadge(merchant.riskLevel)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Spent:</span>
                    <div className="font-medium">${merchant.totalSpent.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frequency:</span>
                    <div className="font-medium">{merchant.frequency} visits</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg. Amount:</span>
                    <div className="font-medium">${merchant.averageAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Visit:</span>
                    <div className="font-medium">{merchant.lastVisit}</div>
                  </div>
                </div>

                {merchant.riskLevel === 'high' && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Risk Alert</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      This merchant appears to be unverified or has unusual transaction patterns. Review for potential fraud.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Merchant Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Loyalty Opportunity</h4>
              <p className="text-sm text-blue-700">
                You spend frequently at Whole Foods. Consider their loyalty program for potential savings.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Cost Optimization</h4>
              <p className="text-sm text-green-700">
                Compare prices between Amazon and local retailers for better deals on regular purchases.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Spending Pattern</h4>
              <p className="text-sm text-yellow-700">
                Your online shopping has increased 25% this month. Consider setting a monthly limit.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">New Merchant Alert</h4>
              <p className="text-sm text-purple-700">
                You made a large purchase at an unknown online store. Verify the merchant for security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantIntelligenceTab;
