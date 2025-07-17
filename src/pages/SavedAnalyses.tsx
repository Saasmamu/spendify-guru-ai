
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Download } from 'lucide-react';
import { storageService } from '@/services/storageService';
import type { SavedAnalysis } from '@/types';
import { toast } from 'sonner';

const SavedAnalyses: React.FC = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const savedAnalyses = await storageService.getSavedAnalyses();
      setAnalyses(savedAnalyses);
    } catch (error) {
      console.error('Error loading analyses:', error);
      toast.error('Failed to load saved analyses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storageService.deleteAnalysis(id);
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
      toast.success('Analysis deleted successfully');
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast.error('Failed to delete analysis');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Analyses</h1>
        <p className="text-muted-foreground">
          View and manage your saved financial analyses
        </p>
      </div>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No saved analyses found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{analysis.name}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(analysis.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {analysis.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(analysis.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAnalyses;
