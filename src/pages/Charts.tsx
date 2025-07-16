
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { storageService } from '@/services/storageService';
import CategoryBreakdownChart from '@/components/CategoryBreakdownChart';
import SpendingTrendsChart from '@/components/SpendingTrendsChart';
import type { SavedAnalysis } from '@/types';

const Charts: React.FC = () => {
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
        if (transformedAnalyses.length > 0) {
          const transformedAnalysis: SavedAnalysis = {
            ...transformedAnalyses[0],
            transactions: transformedAnalyses[0].transactions.map(tx => ({
              ...tx,
              id: tx.id || Math.random().toString(36)
            }))
          };
          setSelectedAnalysis(transformedAnalysis);
        }
      } catch (error) {
        console.error('Error loading saved analyses:', error);
      }
    };

    loadSavedAnalyses();
  }, []);

  const categoryData = selectedAnalysis ? 
    Object.entries(selectedAnalysis.categories).map(([category, amount], index) => ({
      category,
      amount,
      color: `hsl(${index * 60}, 70%, 50%)`
    })) : [];

  const spendingData = selectedAnalysis ?
    selectedAnalysis.transactions
      .filter(tx => tx.type === 'debit')
      .map(tx => ({
        date: tx.date,
        amount: Math.abs(tx.amount)
      })) : [];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Financial Charts</h1>
        <p className="text-muted-foreground">
          Visual insights from your financial data
        </p>
      </div>

      {selectedAnalysis ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis: {selectedAnalysis.name}</CardTitle>
              <CardDescription>
                Data from {selectedAnalysis.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <CategoryBreakdownChart data={categoryData} />
                <SpendingTrendsChart data={spendingData} />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No saved analyses found. Upload and analyze a bank statement first.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Charts;
