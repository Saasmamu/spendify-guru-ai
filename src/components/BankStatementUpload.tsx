
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { storageService } from '@/services/storageService';
import type { Transaction } from '@/types';

interface BankStatementUploadProps {
  onUploadComplete?: (transactions: Transaction[]) => void;
}

const BankStatementUpload: React.FC<BankStatementUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          date: '2024-01-15',
          description: 'Grocery Store Purchase',
          amount: -85.50,
          type: 'debit',
          category: 'Food & Dining',
          reference: 'TXN001',
          channel: 'POS'
        },
        {
          id: '2',
          date: '2024-01-14',
          description: 'Salary Deposit',
          amount: 3500.00,
          type: 'credit',
          category: 'Income',
          reference: 'SAL001',
          channel: 'Direct Deposit'
        },
        {
          id: '3',
          date: '2024-01-13',
          description: 'Gas Station',
          amount: -45.20,
          type: 'debit',
          category: 'Transportation',
          reference: 'TXN002',
          channel: 'POS'
        }
      ];

      // Save to storage
      storageService.saveTransactions(mockTransactions);
      
      setUploadStatus('success');
      onUploadComplete?.(mockTransactions);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage('Failed to process bank statement. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Bank Statement
        </CardTitle>
        <CardDescription>
          Upload your bank statement in PDF, CSV, or Excel format for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            <Upload className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            
            {uploading ? (
              <div className="space-y-2">
                <div className="text-lg font-medium">Processing your statement...</div>
                <div className="text-sm text-muted-foreground">This may take a few moments</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg font-medium">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your bank statement'}
                </div>
                <div className="text-sm text-muted-foreground">
                  or <Button variant="link" className="p-0 h-auto">click to browse</Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Supports PDF, CSV, XLS, XLSX files
                </div>
              </div>
            )}
          </div>
        </div>

        {uploadStatus === 'success' && (
          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Bank statement uploaded and processed successfully!
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'error' && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BankStatementUpload;
export { BankStatementUpload };
