
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, Calendar } from 'lucide-react';
import { storageService } from '@/services/storageService';
import type { SavedAnalysis } from '@/types';

const SavedAnalyses = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = () => {
    try {
      const savedAnalyses = storageService.getSavedAnalyses();
      setAnalyses(savedAnalyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    try {
      storageService.deleteAnalysis(id);
      loadAnalyses(); // Reload the list
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading saved analyses...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Saved Analyses</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your saved financial analyses
        </p>
      </div>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No saved analyses</h3>
            <p className="text-muted-foreground text-center">
              Upload and analyze bank statements to start saving your insights.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {analyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{analysis.name}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(analysis.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Saved on {new Date(analysis.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Income</div>
                    <div className="text-lg font-medium text-green-600">
                      ${analysis.totalIncome.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Expenses</div>
                    <div className="text-lg font-medium text-red-600">
                      ${analysis.totalExpense.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Net Amount</div>
                    <div className={`text-lg font-medium ${
                      (analysis.totalIncome - analysis.totalExpense) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      ${(analysis.totalIncome - analysis.totalExpense).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Transactions</div>
                    <div className="text-lg font-medium">
                      {analysis.transactions.length}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(analysis.categories).slice(0, 5).map(([category, amount]) => (
                      <Badge key={category} variant="secondary">
                        {category}: ${Math.abs(amount).toFixed(0)}
                      </Badge>
                    ))}
                    {Object.keys(analysis.categories).length > 5 && (
                      <Badge variant="outline">
                        +{Object.keys(analysis.categories).length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAnalyses;
