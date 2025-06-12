
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { History as HistoryIcon, Search, FileText, Calendar, DollarSign, TrendingUp, PieChart, BarChart } from 'lucide-react';
import { PieChart as RechartsePieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import InsightCard from '@/components/InsightCard';

interface Analysis {
  id: string;
  name: string;
  date: string;
  total_income: number;
  total_expense: number;
  transactions: any[];
  categories: any;
  insights: string[];
  created_at: string;
}

const History = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  useEffect(() => {
    filterAnalyses();
  }, [analyses, searchTerm]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setAnalyses(data);
      } else {
        // Mock data for demo
        const mockAnalyses: Analysis[] = [
          {
            id: '1',
            name: 'October Bank Statement',
            date: '2024-10-31',
            total_income: 5200.00,
            total_expense: 3450.75,
            transactions: [],
            categories: {
              'Food & Dining': 850.50,
              'Transportation': 320.25,
              'Entertainment': 180.00,
              'Shopping': 650.30,
              'Utilities': 280.70,
              'Healthcare': 120.00,
              'Other': 1049.00
            },
            insights: [
              "Your food spending increased by 15% compared to last month.",
              "You saved $200 on transportation by using public transit more often.",
              "Consider reducing entertainment expenses to meet your savings goal."
            ],
            created_at: '2024-10-31T10:00:00Z'
          },
          {
            id: '2',
            name: 'September Bank Statement',
            date: '2024-09-30',
            total_income: 5200.00,
            total_expense: 3200.40,
            transactions: [],
            categories: {
              'Food & Dining': 740.20,
              'Transportation': 520.80,
              'Entertainment': 220.50,
              'Shopping': 480.90,
              'Utilities': 275.00,
              'Healthcare': 85.00,
              'Other': 878.00
            },
            insights: [
              "Great month! You stayed under budget in most categories.",
              "Your transportation costs were higher due to increased gas prices.",
              "Emergency fund goal is 68% complete - you're doing well!"
            ],
            created_at: '2024-09-30T10:00:00Z'
          },
          {
            id: '3',
            name: 'August Bank Statement',
            date: '2024-08-31',
            total_income: 5200.00,
            total_expense: 3680.90,
            transactions: [],
            categories: {
              'Food & Dining': 920.30,
              'Transportation': 380.45,
              'Entertainment': 450.20,
              'Shopping': 720.60,
              'Utilities': 290.35,
              'Healthcare': 200.00,
              'Other': 719.00
            },
            insights: [
              "Entertainment spending was unusually high this month due to vacation.",
              "Consider meal planning to reduce food expenses next month.",
              "Your savings rate improved to 30% - excellent progress!"
            ],
            created_at: '2024-08-31T10:00:00Z'
          }
        ];
        setAnalyses(mockAnalyses);
      }
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnalyses = () => {
    if (!searchTerm) {
      setFilteredAnalyses(analyses);
    } else {
      const filtered = analyses.filter(analysis =>
        analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.insights.some(insight => 
          insight.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredAnalyses(filtered);
    }
  };

  const getCategoryChartData = (categories: any) => {
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: value as number,
      color: getRandomColor()
    }));
  };

  const getRandomColor = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getInsightType = (insight: string) => {
    if (insight.toLowerCase().includes('increased') || insight.toLowerCase().includes('higher')) {
      return 'warning';
    }
    if (insight.toLowerCase().includes('saved') || insight.toLowerCase().includes('great') || insight.toLowerCase().includes('excellent')) {
      return 'success';
    }
    if (insight.toLowerCase().includes('consider') || insight.toLowerCase().includes('goal')) {
      return 'info';
    }
    return 'trend';
  };

  const topAnalyses = filteredAnalyses.slice(0, 3);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <HistoryIcon className="w-8 h-8 text-primary" />
            Analysis History
          </h1>
          <p className="text-muted-foreground">View your past financial analyses and insights</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search analyses or insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-80"
          />
        </div>
      </div>

      {filteredAnalyses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analyses Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No analyses match your search criteria.' : 'Upload and analyze your first bank statement to get started.'}
            </p>
            <Button>
              Upload Statement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Top 3 Analyses */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold mb-4">Featured Analyses</h2>
            <div className="grid gap-6">
              {topAnalyses.map((analysis, index) => (
                <Card key={analysis.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            #{index + 1}
                          </Badge>
                          {analysis.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(analysis.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${analysis.total_expense.toLocaleString()} spent
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Net</div>
                        <div className={`text-lg font-semibold ${
                          analysis.total_income - analysis.total_expense > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${(analysis.total_income - analysis.total_expense).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Charts */}
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <PieChart className="w-4 h-4" />
                          Spending Breakdown
                        </h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsePieChart>
                              <Pie
                                data={getCategoryChartData(analysis.categories)}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {getCategoryChartData(analysis.categories).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, '']} />
                            </RechartsePieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Category Bar Chart */}
                      <div className="space-y-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <BarChart className="w-4 h-4" />
                          Category Comparison
                        </h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={getCategoryChartData(analysis.categories)}>
                              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                              <YAxis />
                              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                              <Bar dataKey="value" fill="#3b82f6" />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        AI Insights
                      </h4>
                      <div className="space-y-3">
                        {analysis.insights.map((insight, insightIndex) => (
                          <InsightCard
                            key={insightIndex}
                            insight={insight}
                            type={getInsightType(insight)}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Analyses Timeline */}
          {filteredAnalyses.length > 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">All Analyses</h2>
              <div className="grid gap-4">
                {filteredAnalyses.slice(3).map((analysis) => (
                  <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">{analysis.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(analysis.date).toLocaleDateString()} • 
                              ${analysis.total_expense.toLocaleString()} spent
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${
                            analysis.total_income - analysis.total_expense > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${(analysis.total_income - analysis.total_expense).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {analysis.insights.length} insights
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
