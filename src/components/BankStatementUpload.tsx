
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfService } from '@/services/pdfService';
import { Transaction } from '@/types';

export interface BankStatementUploadProps {
  onAnalysisComplete: (analysis: any) => void;
  onAnalysisStart: () => void;
}

const BankStatementUpload: React.FC<BankStatementUploadProps> = ({ 
  onAnalysisComplete, 
  onAnalysisStart 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    onAnalysisStart();

    try {
      const transactions = await pdfService.extractTransactions(file);
      
      // Mock analysis result
      const analysis = {
        transactions,
        totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0),
        categories: [] // This would be calculated from transactions
      };

      onAnalysisComplete(analysis);

      toast({
        title: 'Success!',
        description: `Processed ${transactions.length} transactions from your bank statement.`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Processing error',
        description: 'Failed to process the bank statement. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onAnalysisComplete, onAnalysisStart, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Bank Statement
        </CardTitle>
        <CardDescription>
          Upload your PDF bank statement to analyze your spending patterns and financial health.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : (
              <FileText className="h-12 w-12 text-gray-400" />
            )}
            <div>
              <p className="text-lg font-medium">
                {isProcessing
                  ? 'Processing your bank statement...'
                  : isDragActive
                  ? 'Drop your PDF file here'
                  : 'Drag & drop your PDF bank statement here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {!isProcessing && 'or click to browse files'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Security & Privacy</p>
              <p className="text-blue-700">
                Your bank statement is processed locally and securely. We extract transaction data 
                without storing sensitive account information.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankStatementUpload;
