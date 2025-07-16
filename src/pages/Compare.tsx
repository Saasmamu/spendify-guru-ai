
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storageService } from '@/services/storageService';
import type { SavedAnalysis } from '@/types';

const Compare: React.FC = () => {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Compare Analysis</h1>
        <p className="text-muted-foreground">
          Compare your financial data across different time periods
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Comparison features coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Compare;
