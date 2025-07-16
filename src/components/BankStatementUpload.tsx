
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pdfService } from '@/services/pdfService';
import { Transaction, BankStatementUploadProps } from '@/types';

export default function BankStatementUpload({ onUploadComplete }: BankStatementUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const transactions = await pdfService.extractTransactions(file);
      
      toast({
        title: "Success",
        description: `Extracted ${transactions.length} transactions from the statement.`,
      });

      if (onUploadComplete) {
        onUploadComplete(transactions);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the bank statement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Bank Statement
        </CardTitle>
        <CardDescription>
          Upload a PDF bank statement to extract transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              Click to select a PDF file
            </p>
          </label>
        </div>

        {file && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">{file.name}</span>
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Upload and Process'}
        </Button>

        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">
            Only PDF bank statements are supported. Ensure the file contains clear transaction data.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
