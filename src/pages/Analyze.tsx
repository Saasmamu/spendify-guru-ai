
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BankStatementUpload from '@/components/BankStatementUpload';

const Analyze: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (analysis: any) => {
    setAnalysisResult(analysis);
    setIsAnalyzing(false);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Financial Analysis</h1>
        <p className="text-muted-foreground">
          Upload your bank statement to get detailed financial insights
        </p>
      </div>

      <div className="grid gap-6">
        <BankStatementUpload 
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisStart={handleAnalysisStart}
        />
        
        {isAnalyzing && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <div className="text-lg font-medium">Analyzing your financial data...</div>
                <div className="text-muted-foreground">This may take a few moments</div>
              </div>
            </CardContent>
          </Card>
        )}

        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Complete</CardTitle>
              <CardDescription>
                Here are your financial insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Analysis results will be displayed here
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analyze;
