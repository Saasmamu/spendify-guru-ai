import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { processPDFFile } from '@/services/pdfService';
import { ProcessedStatement } from '@/types';

interface BankStatementUploadProps {
  onUploadComplete?: (statement: ProcessedStatement) => void;
  onAnalysisComplete?: (analysis: any) => void;
  onAnalysisStart?: () => void;
}

const BankStatementUpload: React.FC<BankStatementUploadProps> = ({
  onUploadComplete,
  onAnalysisComplete,
  onAnalysisStart
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    onAnalysisStart?.();

    try {
      const processedStatement = await processPDFFile(file);
      onUploadComplete?.(processedStatement);
      onAnalysisComplete?.(processedStatement);
      
      toast({
        title: "Success",
        description: `Processed ${processedStatement.transactions.length} transactions`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process the bank statement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onUploadComplete, onAnalysisComplete, onAnalysisStart, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Bank Statement</h3>
            <p className="text-muted-foreground mb-4">
              {isDragActive
                ? 'Drop your PDF file here...'
                : 'Drag & drop your bank statement PDF here, or click to select'}
            </p>
            <Button variant="outline">Select File</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isProcessing && (
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Processing your bank statement...</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BankStatementUpload;
