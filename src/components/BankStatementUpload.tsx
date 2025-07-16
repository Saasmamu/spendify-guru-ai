
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface BankStatementUploadProps {
  onAnalysisComplete: (analysis: any) => void;
  onAnalysisStart: () => void;
}

const BankStatementUpload: React.FC<BankStatementUploadProps> = ({ 
  onAnalysisComplete, 
  onAnalysisStart 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Bank Statement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-gray-500">
            Upload your bank statement to get started
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankStatementUpload;
