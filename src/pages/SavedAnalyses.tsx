import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Download,
  Trash2,
  Filter,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SavedAnalysis, ProcessedStatement } from '@/types';

const SavedAnalyses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    if (user) {
      loadSavedAnalyses();
    }
  }, [user]);

  const loadSavedAnalyses = async () => {
    try {
      setLoading(true);
      const { getSavedAnalyses } = await import('@/services/storageService');
      const savedAnalyses = await getSavedAnalyses();
      setAnalyses(savedAnalyses);
      setFilteredAnalyses(savedAnalyses);
    } catch (error) {
      console.error('Error loading saved analyses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved analyses',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNewAnalysis = async (data: any) => {
    try {
      const processedData: ProcessedStatement = {
        transactions: data.transactions,
        totalIncome: data.totalIncome,
        totalExpense: data.totalExpense,
        balance: data.totalIncome - data.totalExpense,
        categories: data.categories,
        insights: data.insights
      };

      const { saveAnalysis } = await import('@/services/storageService');
      await saveAnalysis(`Analysis ${new Date().toLocaleDateString()}`, processedData);
      await loadSavedAnalyses();
      
      toast({
        title: 'Success',
        description: 'Analysis saved successfully'
      });
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to save analysis',
        variant: 'destructive'
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterAnalyses(term, selectedPeriod);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    filterAnalyses(searchTerm, period);
  };

  const filterAnalyses = (term: string, period: string) => {
    let filtered = [...analyses];

    if (term) {
      filtered = filtered.filter(analysis =>
        analysis.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (period !== 'all') {
      filtered = filtered.filter(analysis => {
        const analysisDate = new Date(analysis.date);
        const currentDate = new Date();

        if (period === 'last7Days') {
          const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
          return analysisDate >= sevenDaysAgo;
        } else if (period === 'last30Days') {
          const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
          return analysisDate >= thirtyDaysAgo;
        } else if (period === 'thisYear') {
          return analysisDate.getFullYear() === new Date().getFullYear();
        }

        return true;
      });
    }

    setFilteredAnalyses(filtered);
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      const { deleteAnalysis } = await import('@/services/storageService');
      await deleteAnalysis(analysisId);
      await loadSavedAnalyses();
      toast({
        title: 'Success',
        description: 'Analysis deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete analysis',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Analyses</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Loading saved analyses...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Saved Analyses</CardTitle>
          <CardDescription>
            View and manage your past financial analyses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-sm"
              />
              <Search className="w-4 h-4 ml-2 text-muted-foreground" />
            </div>
            <div>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last7Days">Last 7 Days</SelectItem>
                  <SelectItem value="last30Days">Last 30 Days</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredAnalyses.length === 0 ? (
            <div className="text-center py-4">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No analyses found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnalyses.map(analysis => (
                <Card key={analysis.id} className="bg-card text-card-foreground shadow-sm">
                  <CardHeader>
                    <CardTitle>{analysis.name}</CardTitle>
                    <CardDescription>
                      <Calendar className="w-4 h-4 mr-2 inline-block" />
                      {new Date(analysis.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                        <span>Income:</span>
                      </div>
                      <Badge variant="secondary">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {analysis.totalIncome.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingDown className="w-4 h-4 mr-2 text-red-500" />
                        <span>Expenses:</span>
                      </div>
                      <Badge variant="secondary">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {analysis.totalExpense.toFixed(2)}
                      </Badge>
                    </div>
                  </CardContent>
                  <div className="flex justify-end p-4">
                    <Button variant="ghost" size="sm" onClick={() => console.log('View details for:', analysis.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => console.log('Download report for:', analysis.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAnalysis(analysis.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedAnalyses;
