
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye } from 'lucide-react';
import { storageService } from '@/services/storageService';
import type { SavedAnalysis } from '@/types';

const SavedAnalyses: React.FC = () => {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    const loadSavedAnalyses = async () => {
      try {
        const analyses = await storageService.getSavedAnalyses();
        const transformedAnalyses: SavedAnalysis[] = analyses.map(analysis => ({
          ...analysis,
          transactions: analysis.transactions.map(tx => ({
            ...tx,
            id: tx.id || Math.random().toString(36)
          }))
        }));
        setSavedAnalyses(transformedAnalyses);
      } catch (error) {
        console.error('Error loading saved analyses:', error);
      }
    };

    loadSavedAnalyses();
  }, []);

  const handleDelete = async (analysisId: string) => {
    try {
      await storageService.deleteSavedAnalysis(analysisId);
      setSavedAnalyses(prev => prev.filter(analysis => analysis.id !== analysisId));
      if (selectedAnalysis?.id === analysisId) {
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Analyses</h1>
        <p className="text-muted-foreground">
          View and manage your saved financial analyses
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Analyses</CardTitle>
            <CardDescription>
              {savedAnalyses.length} saved analysis{savedAnalyses.length !== 1 ? 'es' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savedAnalyses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No saved analyses found
              </div>
            ) : (
              <div className="space-y-4">
                {savedAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnalysis?.id === analysis.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{analysis.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysis.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAnalysis(analysis);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(analysis.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedAnalysis.name}</CardTitle>
              <CardDescription>
                Analysis from {new Date(selectedAnalysis.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">Total Income</div>
                    <div className="text-lg font-semibold text-green-700">
                      ₦{selectedAnalysis.totalIncome.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-600">Total Expenses</div>
                    <div className="text-lg font-semibold text-red-700">
                      ₦{selectedAnalysis.totalExpense.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedAnalysis.categories).map(([category, amount]) => (
                      <div key={category} className="flex justify-between text-sm">
                        <span className="capitalize">{category}</span>
                        <span>₦{amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Insights</h4>
                  <div className="space-y-2">
                    {selectedAnalysis.insights.map((insight, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {insight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedAnalyses;
