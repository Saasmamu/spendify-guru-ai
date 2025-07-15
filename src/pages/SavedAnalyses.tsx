
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  Calendar,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SavedAnalysis } from '@/types';
import { getSavedAnalyses, deleteAnalysis } from '@/services/storageService';
import { formatCurrency } from '@/lib/utils';

export default function SavedAnalyses() {
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    loadAnalyses();
  }, []);

  useEffect(() => {
    filterAndSortAnalyses();
  }, [analyses, searchTerm, sortBy, filterBy]);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const savedAnalyses = await getSavedAnalyses();
      setAnalyses(savedAnalyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved analyses."
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAnalyses = () => {
    let filtered = [...analyses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(analysis => 
        analysis.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(analysis => {
        const balance = analysis.totalIncome - analysis.totalExpense;
        if (filterBy === 'profit' && balance > 0) return true;
        if (filterBy === 'loss' && balance < 0) return true;
        return filterBy === 'all';
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'income':
          return b.totalIncome - a.totalIncome;
        case 'expense':
          return b.totalExpense - a.totalExpense;
        case 'transactions':
          return b.transactions.length - a.transactions.length;
        default: // date
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    setFilteredAnalyses(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;

    try {
      await deleteAnalysis(id);
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
      toast({
        title: "Success",
        description: "Analysis deleted successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the analysis."
      });
    }
  };

  const handleView = (analysis: SavedAnalysis) => {
    // Navigate to analysis view
    window.location.href = `/analyze?id=${analysis.id}`;
  };

  const handleExport = (analysis: SavedAnalysis) => {
    // Implementation for exporting analysis
    toast({
      title: "Export Started",
      description: `Exporting analysis: ${analysis.name}`
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Analyses</h1>
          <p className="text-muted-foreground">
            Manage and review your previously analyzed financial data
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={loadAnalyses} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter">Filter By</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="profit">Profit</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis List */}
      {filteredAnalyses.length === 0 ? (
        <Alert>
          <AlertDescription>
            {analyses.length === 0 
              ? "No saved analyses found. Upload and analyze a bank statement to get started."
              : "No analyses match your current filters."
            }
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis) => {
            const balance = analysis.totalIncome - analysis.totalExpense;
            const isProfit = balance >= 0;
            
            return (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{analysis.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(analysis.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={isProfit ? "default" : "destructive"}>
                      {isProfit ? "Profit" : "Loss"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Income</div>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(analysis.totalIncome)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Expenses</div>
                      <div className="font-semibold text-red-600">
                        {formatCurrency(analysis.totalExpense)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Transactions</div>
                      <div className="font-semibold">{analysis.transactions.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Categories</div>
                      <div className="font-semibold">{analysis.categories?.length || 0}</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground">Net Balance</div>
                    <div className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(balance)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleView(analysis)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExport(analysis)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(analysis.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
