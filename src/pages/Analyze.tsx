import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useStatement } from '@/contexts/StatementContext';
import { generateInsights } from '@/services/insightService';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  ArrowLeft,
  Save,
  AlertTriangle,
  Target,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import ExportReport from '@/components/ExportReport';
import SaveAnalysisDialog from '@/components/SaveAnalysisDialog';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface Insight {
  text: string;
  type: 'positive' | 'negative' | 'neutral';
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#d0ed57'
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

const Analyze = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { statementData, previousMonthData } = useStatement();
  
  const [insights, setInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    const generateInitialInsights = async () => {
      if (statementData && statementData.transactions.length > 0) {
        setIsGeneratingInsights(true);
        try {
          const newInsights = await generateInsights(statementData);
          setInsights(newInsights);
        } catch (error) {
          console.error("Error generating insights:", error);
          toast({
            title: "Error",
            description: "Failed to generate insights. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsGeneratingInsights(false);
        }
      }
    };

    generateInitialInsights();
  }, [statementData, toast]);

  const handleGoBack = () => {
    navigate('/dashboard/upload');
  };

  const handleSaveAnalysis = () => {
    setShowSaveDialog(true);
  };

  if (!statementData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Data Available</h1>
        <p className="text-muted-foreground mb-4">
          Please upload a bank statement first to analyze your spending.
        </p>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back to Upload
        </Button>
      </div>
    );
  }

  const totalIncome = statementData.totalIncome || 0;
  const totalExpense = statementData.totalExpense || 0;
  const netBalance = totalIncome - totalExpense;

  // Create category data from transactions if categories don't exist
  const createCategoryData = () => {
    const categoryMap = new Map();
    statementData.transactions.forEach(transaction => {
      const category = transaction.category || 'Miscellaneous';
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + Math.abs(transaction.amount));
    });

    return Array.from(categoryMap.entries()).map(([name, amount], index) => ({
      name,
      value: amount as number,
      color: COLORS[index % COLORS.length],
    }));
  };

  const categoryData: CategoryData[] = createCategoryData();

  const comparisonData = previousMonthData ? {
    totalExpenses: previousMonthData.totalExpense || 0,
    categoryPercentages: previousMonthData.categoryPercentages || {}
  } : {
    totalExpenses: 0,
    categoryPercentages: {}
  };

  const renderInsight = (insight: string, index: number) => {
    let type: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (insight.toLowerCase().includes('increased') || insight.toLowerCase().includes('positive')) {
      type = 'positive';
    } else if (insight.toLowerCase().includes('decreased') || insight.toLowerCase().includes('negative')) {
      type = 'negative';
    }

    let icon;
    switch (type) {
      case 'positive':
        icon = <TrendingUp className="h-4 w-4 text-green-500 mr-2" />;
        break;
      case 'negative':
        icon = <TrendingDown className="h-4 w-4 text-red-500 mr-2" />;
        break;
      default:
        icon = <Lightbulb className="h-4 w-4 text-gray-500 mr-2" />;
        break;
    }

    return (
      <li key={index} className="mb-2 flex items-start">
        {icon}
        <span>{insight}</span>
      </li>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Analysis</h1>
            <p className="text-gray-600">AI-powered insights into your spending patterns</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveAnalysis}>
            <Save className="w-4 h-4 mr-2" />
            Save Analysis
          </Button>
          <Button onClick={() => setShowExportDialog(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</div>
            <p className="text-sm text-gray-500">All credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</div>
            <p className="text-sm text-gray-500">All debits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netBalance)}</div>
            <p className="text-sm text-gray-500">Income less expenses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center">No category data available.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {isGeneratingInsights ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Generating Insights...
            </div>
          ) : insights.length > 0 ? (
            <ul className="list-none pl-0">
              {insights.map((insight, index) => (
                renderInsight(insight, index)
              ))}
            </ul>
          ) : (
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              No insights generated.
            </div>
          )}
        </CardContent>
      </Card>

      <ExportReport 
        statement={statementData}
        insights={insights}
        categoryData={categoryData}
      />

      <SaveAnalysisDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        statementData={statementData}
        insights={insights}
        categories={categoryData}
      />
    </div>
  );
};

export default Analyze;
