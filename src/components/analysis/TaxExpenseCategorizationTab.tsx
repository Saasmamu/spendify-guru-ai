
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Calculator, 
  Receipt, 
  Download,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Home
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface TaxCategory {
  name: string;
  amount: number;
  count: number;
  percentage: number;
  deductible: boolean;
  color: string;
}

interface BusinessExpense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  taxCategory: string;
  deductible: boolean;
  verified: boolean;
}

interface TaxExpenseCategorizationTabProps {
  transactions: any[];
}

const TaxExpenseCategorizationTab: React.FC<TaxExpenseCategorizationTabProps> = ({ transactions }) => {
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [showBusinessOnly, setShowBusinessOnly] = useState<boolean>(false);

  const taxCategories: TaxCategory[] = [
    {
      name: 'Business Meals',
      amount: 1240.50,
      count: 18,
      percentage: 15.2,
      deductible: true,
      color: '#3b82f6'
    },
    {
      name: 'Office Supplies',
      amount: 890.25,
      count: 24,
      percentage: 10.9,
      deductible: true,
      color: '#10b981'
    },
    {
      name: 'Transportation',
      amount: 2150.00,
      count: 32,
      percentage: 26.3,
      deductible: true,
      color: '#f59e0b'
    },
    {
      name: 'Professional Services',
      amount: 1500.00,
      count: 8,
      percentage: 18.4,
      deductible: true,
      color: '#8b5cf6'
    },
    {
      name: 'Equipment',
      amount: 950.75,
      count: 5,
      percentage: 11.6,
      deductible: true,
      color: '#ef4444'
    },
    {
      name: 'Personal Expenses',
      amount: 1450.80,
      count: 45,
      percentage: 17.8,
      deductible: false,
      color: '#6b7280'
    }
  ];

  const businessExpenses: BusinessExpense[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Client Lunch - Restaurant ABC',
      amount: 89.50,
      category: 'Meals',
      taxCategory: 'Business Meals',
      deductible: true,
      verified: true
    },
    {
      id: '2',
      date: '2024-01-12',
      description: 'Office Depot - Supplies',
      amount: 156.75,
      category: 'Office',
      taxCategory: 'Office Supplies',
      deductible: true,
      verified: true
    },
    {
      id: '3',
      date: '2024-01-10',
      description: 'Uber - Business Trip',
      amount: 45.20,
      category: 'Transportation',
      taxCategory: 'Transportation',
      deductible: true,
      verified: false
    },
    {
      id: '4',
      date: '2024-01-08',
      description: 'Legal Consultation',
      amount: 350.00,
      category: 'Professional',
      taxCategory: 'Professional Services',
      deductible: true,
      verified: true
    }
  ];

  const monthlyDeductibles = [
    { month: 'Jan', amount: 1250 },
    { month: 'Feb', amount: 980 },
    { month: 'Mar', amount: 1420 },
    { month: 'Apr', amount: 1150 },
    { month: 'May', amount: 1380 },
    { month: 'Jun', amount: 1100 }
  ];

  const totalDeductible = taxCategories
    .filter(cat => cat.deductible)
    .reduce((sum, cat) => sum + cat.amount, 0);

  const estimatedTaxSavings = totalDeductible * 0.25; // Assuming 25% tax bracket

  const filteredExpenses = showBusinessOnly 
    ? businessExpenses.filter(exp => exp.deductible)
    : businessExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tax & Expense Categorization</h2>
          <p className="text-muted-foreground">
            AI-powered tax preparation and business expense tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowBusinessOnly(!showBusinessOnly)}>
            {showBusinessOnly ? 'Show All' : 'Business Only'}
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Tax Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deductible</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDeductible.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This tax year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Tax Savings</CardTitle>
            <Calculator className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${estimatedTaxSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              25% tax bracket
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Expenses</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessExpenses.filter(exp => exp.deductible).length}</div>
            <p className="text-xs text-muted-foreground">
              Deductible transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessExpenses.filter(exp => exp.verified).length}</div>
            <p className="text-xs text-muted-foreground">
              Of {businessExpenses.length} expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Category Breakdown</CardTitle>
            <CardDescription>Deductible vs non-deductible expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taxCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {taxCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Deductible Trend</CardTitle>
            <CardDescription>Business expenses by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyDeductibles}>
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
          <CardTitle>Tax Categories Overview</CardTitle>
          <CardDescription>
            Detailed breakdown of expenses by tax deductibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taxCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <h4 className="font-medium">{category.name}</h4>
                    {category.deductible ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Deductible
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Personal
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <div className="font-medium">${category.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transactions:</span>
                      <div className="font-medium">{category.count}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Percentage:</span>
                      <div className="font-medium">{category.percentage}%</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Expense Transactions</CardTitle>
          <CardDescription>
            Review and verify your business expenses for tax purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {expense.verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <h4 className="font-medium">{expense.description}</h4>
                    </div>
                    <Badge variant="outline">{expense.taxCategory}</Badge>
                    {expense.deductible && (
                      <Badge className="bg-green-100 text-green-800">Deductible</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{expense.date}</span>
                    <span>•</span>
                    <span>${expense.amount}</span>
                    <span>•</span>
                    <span>{expense.category}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!expense.verified && (
                    <Button variant="outline" size="sm">
                      Verify
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Preparation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Completed</h4>
              {[
                'Categorize all business expenses',
                'Verify largest deductions',
                'Separate personal vs business'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Pending</h4>
              {[
                'Review unverified transactions',
                'Download tax summary report',
                'Consult with tax professional'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxExpenseCategorizationTab;
